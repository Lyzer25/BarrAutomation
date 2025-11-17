import { NextRequest, NextResponse } from 'next/server'
import { 
  contactPayloadSchema, 
  webDevPayloadSchema, 
  softwareToolsPayloadSchema, 
  scriptsPayloadSchema 
} from '@/lib/validators/contact'
import { checkRateLimit } from '@/lib/utils/rateLimit'

const CATEGORY_LABELS = {
  'web-dev': 'Web Development',
  'software-tools': 'Software & Tools',
  'scripts': 'Scripts & Automation',
  'ai-automations': 'AI Automations',
}

async function sendEmailWithResend(payload: any) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const to = process.env.CONTACT_TO_EMAIL ?? 'barrautomations@gmail.com'
  const from = process.env.RESEND_FROM ?? `Barr Automations <no-reply@${process.env.RESEND_DOMAIN ?? 'barrautomations.com'}>`
  
  const category = payload.category || 'ai-automations'
  const categoryLabel = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || 'General'
  const subject = `[${categoryLabel}] New Contact: ${payload.fullName} (${payload.email})`

  const htmlLines: string[] = [
    `<h2>${subject}</h2>`,
    `<p><strong>🏷️ Inquiry Type:</strong> ${categoryLabel}</p>`,
    `<p><strong>Page:</strong> ${payload.page ?? 'contact'}</p>`,
    `<p><strong>IP:</strong> ${payload.ip ?? ''}</p>`,
    `<p><strong>User Agent:</strong> ${payload.userAgent ?? ''}</p>`,
    `<h3>Contact Details</h3>`,
    `<p><strong>Name:</strong> ${payload.fullName ?? ''}</p>`,
    `<p><strong>Email:</strong> ${payload.email ?? ''}</p>`,
  ]

  if (payload.phone) htmlLines.push(`<p><strong>Phone:</strong> ${payload.phone}</p>`)
  if (payload.company) htmlLines.push(`<p><strong>Company:</strong> ${payload.company}</p>`)

  if (category === 'web-dev') {
    htmlLines.push(`<h3>Web Development Details</h3>`)
    if (payload.projectType) htmlLines.push(`<p><strong>Project Type:</strong> ${payload.projectType}</p>`)
    if (payload.timeline) htmlLines.push(`<p><strong>Timeline:</strong> ${payload.timeline}</p>`)
    if (payload.budget) htmlLines.push(`<p><strong>Budget:</strong> ${payload.budget}</p>`)
    if (payload.existingWebsite) htmlLines.push(`<p><strong>Existing Website:</strong> ${payload.existingWebsite}</p>`)
  } else if (category === 'software-tools') {
    htmlLines.push(`<h3>Software & Tools Details</h3>`)
    if (payload.softwareType) htmlLines.push(`<p><strong>Software Type:</strong> ${payload.softwareType}</p>`)
    if (payload.userCount) htmlLines.push(`<p><strong>Expected Users:</strong> ${payload.userCount}</p>`)
    if (payload.timeline) htmlLines.push(`<p><strong>Timeline:</strong> ${payload.timeline}</p>`)
    if (payload.integrations) htmlLines.push(`<p><strong>Integrations:</strong> ${payload.integrations}</p>`)
  } else if (category === 'scripts') {
    htmlLines.push(`<h3>Scripts & Automation Details</h3>`)
    if (payload.scriptType) htmlLines.push(`<p><strong>Script Type:</strong> ${payload.scriptType}</p>`)
    if (payload.frequency) htmlLines.push(`<p><strong>Frequency:</strong> ${payload.frequency}</p>`)
    if (payload.urgency) htmlLines.push(`<p><strong>Urgency:</strong> ${payload.urgency}</p>`)
    if (payload.currentProcess) htmlLines.push(`<p><strong>Current Process:</strong><br/>${payload.currentProcess.replace(/\n/g, '<br/>')}</p>`)
  } else if (category === 'ai-automations') {
    // AI Automations discovery answers
    if (payload.website) htmlLines.push(`<p><strong>Website:</strong> ${payload.website}</p>`)
    
    htmlLines.push(`<h3>Discovery Answers</h3>`)
    if (payload.hoursFocus) htmlLines.push(`<p><strong>Hours Focus:</strong> ${payload.hoursFocus}</p>`)
    if (payload.followupPain && Array.isArray(payload.followupPain)) htmlLines.push(`<p><strong>Follow-up Pain:</strong> ${(payload.followupPain || []).join(', ')}</p>`)
    if (payload.repeatedLookups) htmlLines.push(`<p><strong>Repeated Lookups:</strong><br/>${payload.repeatedLookups.replace(/\n/g, '<br/>')}</p>`)
    if (payload.singlePointProcess) htmlLines.push(`<p><strong>Single Point Process:</strong><br/>${payload.singlePointProcess.replace(/\n/g, '<br/>')}</p>`)
    if (payload.morningKPIs) htmlLines.push(`<p><strong>Morning KPIs:</strong><br/>${payload.morningKPIs.replace(/\n/g, '<br/>')}</p>`)
    if (payload.integrations && Array.isArray(payload.integrations)) htmlLines.push(`<p><strong>Integrations:</strong> ${(payload.integrations || []).join(', ')}</p>`)
  }

  if (payload.message) htmlLines.push(`<p><strong>Message/Details:</strong><br/>${payload.message.replace(/\n/g, '<br/>')}</p>`)

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
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               req.headers.get('x-real-ip') ||
               '0.0.0.0'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again in 10 seconds.' },
        { status: 429 }
      )
    }

    const body = await req.json()

    // Honeypot check
    if (typeof body?.trap === 'string' && body.trap.length > 0) {
      return NextResponse.json({ ok: true })
    }

    const category = body.category || 'ai-automations'
    let validatedFields

    if (category === 'web-dev') {
      validatedFields = webDevPayloadSchema.safeParse(body)
    } else if (category === 'software-tools') {
      validatedFields = softwareToolsPayloadSchema.safeParse(body)
    } else if (category === 'scripts') {
      validatedFields = scriptsPayloadSchema.safeParse(body)
    } else {
      validatedFields = contactPayloadSchema.safeParse(body)
    }

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
    const payload = {
      ...validatedFields.data,
      page: 'contact',
      userAgent: req.headers.get('user-agent') ?? '',
      ip,
      category,
    }

    // Send via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmailWithResend(payload)
        return NextResponse.json({ ok: true })
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Resend error:', err)
        }
        return NextResponse.json(
          { ok: false, error: 'Failed to send email' },
          { status: 502 }
        )
      }
    }

    // Fallback to n8n webhook
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

    if (process.env.NODE_ENV === 'development') {
      console.error('No delivery method configured')
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
