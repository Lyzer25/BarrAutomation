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
  title: "Barri.ai — Real-Time AI Automation for Business",
  description: "From 45 minutes to 30 seconds — automate your sales, service, onboarding, reporting, or anything else.",
  icons: {
    icon: "/barrautomationslogo.png",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
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
