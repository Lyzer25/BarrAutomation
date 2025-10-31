import { NextRequest, NextResponse } from 'next/server'
import { contactPayloadSchema } from '@/lib/validators/contact'
import { checkRateLimit } from '@/lib/utils/rateLimit'
import type { ContactPayload } from '@/types/automation-types'

const RATE_MS = 60_000 // 1 minute (kept for reference)

async function sendEmailWithResend(payload: ContactPayload) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const to = process.env.CONTACT_TO_EMAIL ?? 'barrautomations@gmail.com'
  const from = process.env.RESEND_FROM ?? `Barr Automations <no-reply@${process.env.RESEND_DOMAIN ?? 'barrautomations.com'}>`
  const subject = `New Contact: ${payload.fullName} (${payload.email})`

  // Build a simple HTML representation of the payload
  const htmlLines: string[] = [
    `<h2>${subject}</h2>`,
    `<p><strong>Page:</strong> ${payload.page ?? 'contact'}</p>`,
    `<p><strong>IP:</strong> ${payload.ip ?? ''}</p>`,
    `<p><strong>User Agent:</strong> ${payload.userAgent ?? ''}</p>`,
    `<h3>Contact Details</h3>`,
    `<p><strong>Name:</strong> ${payload.fullName ?? ''}</p>`,
    `<p><strong>Email:</strong> ${payload.email ?? ''}</p>`,
  ]

  if (payload.phone) htmlLines.push(`<p><strong>Phone:</strong> ${payload.phone}</p>`)
  if (payload.company) htmlLines.push(`<p><strong>Company:</strong> ${payload.company}</p>`)
  if (payload.website) htmlLines.push(`<p><strong>Website:</strong> ${payload.website}</p>`)
  if (payload.message) htmlLines.push(`<p><strong>Message:</strong><br/>${payload.message.replace(/\n/g, '<br/>')}</p>`)

  htmlLines.push(`<h3>Discovery Answers</h3>`)
  if (payload.hoursFocus) htmlLines.push(`<p><strong>Hours Focus:</strong> ${payload.hoursFocus}</p>`)
  if (payload.followupPain && Array.isArray(payload.followupPain)) htmlLines.push(`<p><strong>Follow-up Pain:</strong> ${(payload.followupPain || []).join(', ')}</p>`)
  if (payload.repeatedLookups) htmlLines.push(`<p><strong>Repeated Lookups:</strong><br/>${payload.repeatedLookups.replace(/\n/g, '<br/>')}</p>`)
  if (payload.singlePointProcess) htmlLines.push(`<p><strong>Single Point Process:</strong><br/>${payload.singlePointProcess.replace(/\n/g, '<br/>')}</p>`)
  if (payload.morningKPIs) htmlLines.push(`<p><strong>Morning KPIs:</strong><br/>${payload.morningKPIs.replace(/\n/g, '<br/>')}</p>`)
  if (payload.integrations && Array.isArray(payload.integrations)) htmlLines.push(`<p><strong>Integrations:</strong> ${(payload.integrations || []).join(', ')}</p>`)

  const html = htmlLines.join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Resend API error ${res.status}: ${text}`)
  }

  const data = await res.json().catch(() => ({}))
  return data
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               req.headers.get('x-real-ip') ||
               '0.0.0.0'

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again in 10 seconds.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await req.json()

    // Honeypot check - silently accept if trap field is filled
    if (typeof body?.trap === 'string' && body.trap.length > 0) {
      return NextResponse.json({ ok: true })
    }

    // Validate payload
    const validatedFields = contactPayloadSchema.safeParse(body)
    if (!validatedFields.success) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Contact validation failed:', validatedFields.error)
      }
      return NextResponse.json(
        { ok: false, error: 'Invalid form data' },
        { status: 400 }
      )
    }

    // Build payload with metadata
    const payload: ContactPayload = {
      ...validatedFields.data,
      page: 'contact',
      userAgent: req.headers.get('user-agent') ?? '',
      ip,
    }

    // Preferred path: use Resend to send email directly if configured
    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmailWithResend(payload)
        return NextResponse.json({ ok: true })
      } catch (err) {
        // Log error server-side only
        if (process.env.NODE_ENV === 'development') {
          console.error('Resend error:', err)
        }
        return NextResponse.json(
          { ok: false, error: 'Failed to send email' },
          { status: 502 }
        )
      }
    }

    // Secondary path: Send to n8n webhook if configured
    const n8nUrl = process.env.N8N_CONTACT_WEBHOOK_URL
    if (n8nUrl) {
      try {
        const response = await fetch(n8nUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-contact-destination': process.env.CONTACT_TO_EMAIL ?? 'barrautomations@gmail.com',
          },
          body: JSON.stringify(payload),
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Webhook request failed: ${response.status}`)
        }

        return NextResponse.json({ ok: true })
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('n8n webhook error:', error)
        }
        return NextResponse.json({ ok: false, error: 'Failed to deliver contact submission' }, { status: 502 })
      }
    }

    // If we reach here and neither Resend nor n8n succeeded/configured, return an error
    if (process.env.NODE_ENV === 'development') {
      console.error('No delivery method configured (RESEND_API_KEY or N8N_CONTACT_WEBHOOK_URL)')
    }
    return NextResponse.json(
      { ok: false, error: 'Service temporarily unavailable' },
      { status: 503 }
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Contact submission error:', error)
    }

    return NextResponse.json(
      { ok: false, error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
