import { NextResponse } from "next/server"
import { n8nWebhookUrl } from "@/lib/config"

export async function POST(request: Request) {
  try {
    const bodyText = await request.text() // Read as text for logging
    console.log("🔄 Proxy forwarding to n8n:", n8nWebhookUrl)
    console.log("📤 Request body:", bodyText)
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
    console.log("📥 Response from n8n:", JSON.stringify(responseData, null, 2))

    if (!response.ok) {
      console.error("❌ n8n webhook failed:", response.status, responseData)
      return NextResponse.json(responseData, { status: response.status })
    }

    console.log("✅ Successfully forwarded to n8n")
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("❌ Proxy webhook error:", error)
    console.error("🔧 n8n URL being used:", n8nWebhookUrl)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ 
      error: "Proxy error", 
      details: errorMessage,
      n8nUrl: n8nWebhookUrl 
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}
