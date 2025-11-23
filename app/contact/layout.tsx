import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Get a Free Consultation",
  description:
    "Ready to automate your business? Contact Barr Automations for a free consultation. We're based in Dallas, Texas and serve businesses nationwide.",
  keywords: ["contact barr automations", "free consultation", "automation quote", "Dallas automation company"],
  openGraph: {
    title: "Contact Barr Automations | Get a Free Consultation",
    description: "Ready to automate your business? Contact us for a free consultation.",
    url: "https://www.barrautomations.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Barr Automations | Get a Free Consultation",
    description: "Ready to automate your business? Contact us for a free consultation.",
  },
  alternates: {
    canonical: "https://www.barrautomations.com/contact",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
