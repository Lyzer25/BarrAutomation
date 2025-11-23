import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Custom Web Development Services | Beautiful, Responsive Websites",
  description:
    "Professional custom web development services in Dallas. We build stunning, responsive websites and web applications optimized for performance, SEO, and user experience.",
  keywords: [
    "custom web development",
    "responsive web design",
    "web application development",
    "SEO optimization",
    "Dallas web design",
  ],
  openGraph: {
    title: "Custom Web Development Services | Barr Automations",
    description:
      "Professional custom web development. Beautiful, responsive websites and applications built for results.",
    url: "https://www.barrautomations.com/products/web-development",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Web Development Services | Barr Automations",
    description: "Beautiful, responsive websites and web applications built for results and user experience.",
  },
  alternates: {
    canonical: "https://www.barrautomations.com/products/web-development",
  },
}

export default function WebDevelopmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
