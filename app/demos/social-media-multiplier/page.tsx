"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, CheckCircle, XCircle } from "lucide-react"

export default function SocialMediaMultiplierPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [response, setResponse] = useState<any>(null)

  const sendWebhook = async () => {
    setIsLoading(true)
    setStatus("idle")
    setResponse(null)

    try {
      const testPayload = {
        campaignType: "social-media-multiplier",
        content: {
          originalIdea: "Launch our new AI automation platform",
          targetPlatforms: ["instagram", "twitter", "facebook", "linkedin"],
          tone: "professional",
          industry: "technology",
        },
        timestamp: new Date().toISOString(),
        testMode: true,
      }

      console.log("🚀 Sending webhook to n8n:", testPayload)

      const webhookResponse = await fetch("https://lyzer25.app.n8n.cloud/webhook-test/book-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      })

      const responseData = await webhookResponse.json()
      console.log("📥 Response from n8n:", responseData)

      if (webhookResponse.ok) {
        setStatus("success")
        setResponse(responseData)
      } else {
        setStatus("error")
        setResponse(responseData)
      }
    } catch (error) {
      console.error("❌ Webhook error:", error)
      setStatus("error")
      setResponse({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">In Development</Badge>
          <h1 className="font-mono text-4xl font-thin text-white md:text-5xl mb-4">Social Media Multiplier</h1>
          <p className="text-lg text-subtle-gray">
            Development testing page for the Social Media Multiplier automation workflow.
          </p>
        </div>

        {/* Main Test Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-black border border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Webhook Test</CardTitle>
              <CardDescription className="text-subtle-gray">
                Test the n8n webhook integration for the Social Media Multiplier workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Button */}
              <div className="flex justify-center">
                <Button
                  onClick={sendWebhook}
                  disabled={isLoading}
                  size="lg"
                  className="bg-accent hover:bg-accent/80 text-black font-semibold px-8 py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Webhook...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Webhook
                    </>
                  )}
                </Button>
              </div>

              {/* Status Display */}
              {status !== "idle" && (
                <div className="mt-6">
                  <div className="flex items-center justify-center mb-4">
                    {status === "success" ? (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Webhook sent successfully!
                      </div>
                    ) : (
                      <div className="flex items-center text-red-400">
                        <XCircle className="mr-2 h-5 w-5" />
                        Webhook failed
                      </div>
                    )}
                  </div>

                  {/* Response Display */}
                  {response && (
                    <Card className="bg-gray-900 border border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white text-sm">Response Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs text-gray-300 overflow-auto max-h-64">
                          {JSON.stringify(response, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Webhook Info */}
              <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <h3 className="text-white font-semibold mb-2">Webhook Details</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>
                    <span className="font-medium">Endpoint:</span>{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded text-accent">
                      https://lyzer25.app.n8n.cloud/webhook-test/book-campaign
                    </code>
                  </div>
                  <div>
                    <span className="font-medium">Method:</span> POST
                  </div>
                  <div>
                    <span className="font-medium">Content-Type:</span> application/json
                  </div>
                </div>
              </div>

              {/* Sample Payload */}
              <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <h3 className="text-white font-semibold mb-2">Sample Payload</h3>
                <pre className="text-xs text-gray-300 overflow-auto">
                  {`{
  "campaignType": "social-media-multiplier",
  "content": {
    "originalIdea": "Launch our new AI automation platform",
    "targetPlatforms": ["instagram", "twitter", "facebook", "linkedin"],
    "tone": "professional",
    "industry": "technology"
  },
  "timestamp": "2024-01-20T10:30:00.000Z",
  "testMode": true
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Development Notes */}
        <div className="max-w-2xl mx-auto mt-8">
          <Card className="bg-accent/5 border border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent text-lg">Development Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/80 space-y-2">
              <p>• This is a development testing page for the Social Media Multiplier workflow</p>
              <p>• The webhook sends a test payload to the n8n automation</p>
              <p>• Check the browser console for detailed request/response logs</p>
              <p>• Once the workflow is complete, this will be replaced with the full demo interface</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
