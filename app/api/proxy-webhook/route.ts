import { NextResponse } from "next/server"
import { n8nWebhookUrl, appUrl } from "@/lib/config"

const ALLOWED_ORIGINS = [appUrl, "http://localhost:3000"]

export async function POST(request: Request) {
  try {
    const bodyText = await request.text()
    const body = JSON.parse(bodyText)

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    const responseData = await response.json()

    if (!response.ok) {
      // Log error server-side without exposing details to client
      if (process.env.NODE_ENV === "development") {
        console.error("n8n webhook failed:", response.status)
      }
      return NextResponse.json({ error: "Webhook request failed" }, { status: response.status })
    }

    const origin = request.headers.get("origin") || ""
    const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    // Log error server-side only
    if (process.env.NODE_ENV === "development") {
      console.error("Proxy webhook error:", error)
    }

    return NextResponse.json({
      error: "Internal server error"
    }, { status: 500 })
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || ""
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]

  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}
