import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Custom Automation Products & Services",
  description:
    "Explore our custom automation solutions: web development, internal software, process automation, and AI-powered tools built for your business.",
  keywords: ["automation services", "web development", "custom software", "AI automation", "workflow optimization"],
  openGraph: {
    title: "Custom Automation Products & Services | Barr Automations",
    description:
      "Explore our custom automation solutions: web development, internal software, process automation, and AI-powered tools.",
    url: "https://www.barrautomations.com/products",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Automation Products & Services | Barr Automations",
    description: "Explore our custom automation solutions including web development, internal software, and AI tools.",
  },
  alternates: {
    canonical: "https://www.barrautomations.com/products",
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
