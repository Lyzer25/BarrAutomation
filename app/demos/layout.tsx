import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Live Demos | See Our Automation Solutions in Action",
  description:
    "Experience our AI-powered automation solutions in action. Explore live demos of lead generation, customer support, data entry automation, and revenue recovery systems.",
  keywords: [
    "automation demos",
    "AI demos",
    "live product demos",
    "automation examples",
    "business automation showcase",
  ],
  openGraph: {
    title: "Live Demos | See Our Automation Solutions in Action",
    description: "Experience our AI-powered automation solutions in action with interactive live demos.",
    url: "https://www.barrautomations.com/demos",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Demos | Barr Automations",
    description: "Experience our AI-powered automation solutions in action with interactive live demos.",
  },
  alternates: {
    canonical: "https://www.barrautomations.com/demos",
  },
}

export default function DemosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
