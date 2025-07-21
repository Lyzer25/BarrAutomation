import { NextResponse } from "next/server"

const N8N_WEBHOOK_URL = "https://lyzer25.app.n8n.cloud/webhook-test/new-lead"

export async function POST(request: Request) {
  try {
    const bodyText = await request.text() // Read as text for logging
    console.log("Proxy raw submission to n8n:", bodyText)
    const body = JSON.parse(bodyText)

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    const responseData = await response.json()
    console.log("Received raw response from n8n:", JSON.stringify(responseData, null, 2))

    if (!response.ok) {
      return NextResponse.json(responseData, { status: response.status })
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Proxy webhook error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Proxy error", details: errorMessage }, { status: 500 })
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
