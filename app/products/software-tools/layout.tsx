import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Custom Internal Software & Business Tools Development",
  description:
    "Enterprise-grade custom software solutions and internal tools. Streamline operations, boost productivity, and scale your business with tailored software development.",
  keywords: [
    "custom software development",
    "internal business tools",
    "enterprise software",
    "business automation software",
    "custom CRM",
    "inventory management systems",
  ],
  openGraph: {
    title: "Custom Internal Software & Business Tools | Barr Automations",
    description: "Enterprise-grade custom software solutions that streamline operations and scale with your business.",
    url: "https://www.barrautomations.com/products/software-tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Internal Software & Business Tools | Barr Automations",
    description: "Enterprise-grade custom software solutions that streamline operations and scale with your business.",
  },
  alternates: {
    canonical: "https://www.barrautomations.com/products/software-tools",
  },
}

export default function SoftwareToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
