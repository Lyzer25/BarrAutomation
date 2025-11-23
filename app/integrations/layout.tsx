import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Integrations | Connect with 100+ AI-Powered Tools",
  description:
    "Connect with hundreds of AI-powered tools and services. Explore our ecosystem of intelligent integrations for CRM, analytics, communication, and automation.",
  keywords: [
    "AI integrations",
    "API integrations",
    "automation tools",
    "third-party integrations",
    "business software integrations",
    "CRM integration",
    "analytics integration",
  ],
  openGraph: {
    title: "AI Integrations | Connect with 100+ AI-Powered Tools",
    description: "Connect with hundreds of AI-powered tools to automate every corner of your business.",
    url: "https://www.barrautomations.com/integrations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Integrations | Barr Automations",
    description: "Connect with hundreds of AI-powered tools to automate every corner of your business.",
  },
  alternates: {
    canonical: "https://www.barrautomations.com/integrations",
  },
}

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
