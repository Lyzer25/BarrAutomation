import type { Metadata } from "next"
import HomePage from "./home-page"

export const metadata: Metadata = {
  title: "Barr Automations | Custom Business Automation & Development Solutions",
  description:
    "Transform your business with custom automation solutions. Expert web development, AI-powered automations, workflow optimization, and internal software. Built specifically for your business needs in Dallas, Texas.",
  keywords: [
    "custom business automation",
    "web development Dallas",
    "AI automation solutions",
    "workflow automation",
    "custom software development",
    "process automation",
  ],
  openGraph: {
    title: "Barr Automations | Custom Business Automation & Development Solutions",
    description:
      "Transform your business with custom automation solutions. Expert web development, AI-powered automations, workflow optimization, and internal software.",
    url: "https://www.barrautomations.com",
    type: "website",
    images: [
      {
        url: "/barrautomationslogo.png",
        width: 1200,
        height: 630,
        alt: "Barr Automations - Business Automation Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barr Automations | Custom Business Automation Solutions",
    description:
      "Transform your business with custom automation solutions. Web development, AI automations, and workflow optimization.",
    images: ["/barrautomationslogo.png"],
  },
  alternates: {
    canonical: "https://www.barrautomations.com",
  },
}

export default function Page() {
  return <HomePage />
}
