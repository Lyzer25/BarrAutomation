import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Custom Automation Scripts & Workflow Optimization Services",
  description:
    "Intelligent automation scripts that eliminate repetitive tasks and boost productivity. Custom workflow automation solutions delivered in hours, not weeks.",
  keywords: [
    "automation scripts",
    "workflow automation",
    "process automation",
    "task automation",
    "RPA",
    "business process automation",
    "Python automation",
    "custom scripting",
  ],
  openGraph: {
    title: "Custom Automation Scripts & Workflow Optimization | Barr Automations",
    description: "Intelligent automation scripts that eliminate repetitive tasks and boost productivity.",
    url: "https://www.barrautomations.com/products/scripts-automation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Automation Scripts & Workflow Optimization | Barr Automations",
    description: "Intelligent automation scripts that eliminate repetitive tasks and boost productivity.",
  },
  alternates: {
    canonical: "https://www.barrautomations.com/products/scripts-automation",
  },
}

export default function ScriptsAutomationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
