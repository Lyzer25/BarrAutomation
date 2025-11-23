import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono, Chakra_Petch } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { LandingBackgroundWrapper } from "./landing-bg-wrapper"
import { PageTransition } from "@/components/page-transition"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-roboto-mono",
})
const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-chakra-petch",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.barrautomations.com"),
  title: {
    default: "Barr Automations | Custom Business Automation Solutions",
    template: "%s | Barr Automations",
  },
  description:
    "Transform your business with custom automation solutions. Web development, AI automations, workflow optimization, and internal software built specifically for your needs. Based in Dallas, Texas.",
  keywords: [
    "business automation",
    "custom automation solutions",
    "workflow automation",
    "AI automation",
    "custom web development",
    "internal software",
    "process automation",
    "Dallas automation company",
  ],
  authors: [{ name: "Barr Automations" }],
  creator: "Barr Automations",
  publisher: "Barr Automations",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/barrautomationslogo.png",
    shortcut: "/barrautomationslogo.png",
    apple: "/barrautomationslogo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.barrautomations.com",
    title: "Barr Automations | Custom Business Automation Solutions",
    description:
      "Transform your business with custom automation solutions. Web development, AI automations, workflow optimization, and internal software built for your specific needs.",
    siteName: "Barr Automations",
    images: [
      {
        url: "/barrautomationslogo.png",
        width: 1200,
        height: 630,
        alt: "Barr Automations Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barr Automations | Custom Business Automation Solutions",
    description:
      "Transform your business with custom automation solutions. Web development, AI automations, workflow optimization, and internal software.",
    images: ["/barrautomationslogo.png"],
    creator: "@barrautomations",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code-here", // User should add their verification code
  },
    generator: 'v0.app'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#000000" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Barr Automations",
              url: "https://www.barrautomations.com",
              logo: "https://www.barrautomations.com/barrautomationslogo.png",
              description:
                "Custom business automation solutions including web development, AI automations, and workflow optimization.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dallas",
                addressRegion: "TX",
                addressCountry: "US",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-0123",
                contactType: "Sales",
                areaServed: "US",
                availableLanguage: ["English"],
              },
              sameAs: ["https://twitter.com/barrautomations", "https://linkedin.com/company/barr-automations"],
              service: [
                {
                  "@type": "Service",
                  name: "Web Development",
                  description: "Custom web applications and websites built for your business",
                },
                {
                  "@type": "Service",
                  name: "AI Automation",
                  description: "Intelligent automation solutions powered by AI",
                },
                {
                  "@type": "Service",
                  name: "Workflow Automation",
                  description: "Custom scripts and automation to streamline business processes",
                },
                {
                  "@type": "Service",
                  name: "Internal Software",
                  description: "Custom internal tools and software solutions",
                },
              ],
            }),
          }}
        />
        <link rel="canonical" href="https://www.barrautomations.com" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          robotoMono.variable,
          chakraPetch.variable,
        )}
      >
        <TooltipProvider>
          <LandingBackgroundWrapper>
            <Header />
            <main className="flex-grow">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <Toaster />
          </LandingBackgroundWrapper>
        </TooltipProvider>
      </body>
    </html>
  )
}
