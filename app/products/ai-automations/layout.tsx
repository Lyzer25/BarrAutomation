import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Automation Solutions | Custom AI-Powered Business Tools",
  description:
    "Cutting-edge AI automation solutions powered by GPT, Claude, and custom models. Transform your business processes with intelligent chatbots, data analysis, and predictive AI.",
  keywords: [
    "AI automation",
    "AI chatbots",
    "machine learning solutions",
    "GPT integration",
    "Claude AI",
    "custom AI models",
    "AI for business",
    "intelligent automation",
  ],
  openGraph: {
    title: "AI Automation Solutions | Custom AI-Powered Business Tools",
    description: "Cutting-edge AI solutions powered by the latest models to transform your business processes.",
    url: "https://www.barrautomations.com/products/ai-automations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation Solutions | Barr Automations",
    description: "Cutting-edge AI solutions powered by the latest models to transform your business processes.",
  },
  alternates: {
    canonical: "https://www.barrautomations.com/products/ai-automations",
  },
}

export default function AIAutomationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
