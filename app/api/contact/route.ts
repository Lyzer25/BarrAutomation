import { NextRequest, NextResponse } from 'next/server'
import { contactPayloadSchema } from '@/lib/validators/contact'
import { checkRateLimit } from '@/lib/utils/rateLimit'
import type { ContactPayload } from '@/types/automation-types'

const RATE_MS = 60_000 // 1 minute

export async function POST(req: NextRequest) {
  try {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               '0.0.0.0'

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again in a minute.' },
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

    // Primary path: Send to n8n webhook
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
          throw new Error(`n8n webhook error: ${response.status}`)
        }

        // Log success in development
        if (process.env.NODE_ENV === 'development') {
          console.log('contact_submit_success:', { 
            fullName: payload.fullName, 
            email: payload.email,
            ip 
          })
        }

        return NextResponse.json({ ok: true })
      } catch (error) {
        console.error('n8n webhook error:', error)
        
        // Fallback to basic acknowledgment if n8n fails
        if (process.env.NODE_ENV === 'development') {
          console.log('contact_submit_fallback:', { 
            fullName: payload.fullName, 
            email: payload.email,
            ip 
          })
        }
        
        return NextResponse.json({ ok: true })
      }
    }

    // Fallback: No n8n configured, just acknowledge
    if (process.env.NODE_ENV === 'development') {
      console.log('contact_submit_no_n8n:', { 
        fullName: payload.fullName, 
        email: payload.email,
        ip 
      })
    }

    return NextResponse.json({ ok: true })

  } catch (error: any) {
    console.error('contact_submit_error:', error)
    
    return NextResponse.json(
      { ok: false, error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
