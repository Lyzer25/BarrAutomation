import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"

// Lazy load heavy components for better performance
const ChromaGrid = dynamic(() => import("@/components/bits/Components/ChromaGrid/ChromaGrid"), {
  ssr: false,
  loading: () => <div className="min-h-[400px] animate-pulse bg-white/5 rounded-xl" />,
})

const IntegrationEcosystem = dynamic(() => import("@/components/smart-lead-machine/integration-ecosystem"), {
  ssr: false,
  loading: () => <div className="min-h-[300px] animate-pulse bg-white/5 rounded-xl" />,
})

// Static generation with 1-hour revalidation
export const dynamic = 'force-static'
export const revalidate = 3600

const demos = [
  {
    title: "Smart Lead Machine",
    industry: "Real Estate",
    useCase: "Webhook ingestion, GPT-4 lead scoring, CRM updates, and notifications.",
    roi: "Saves 18+ hours/week",
    description:
      "Transforms raw leads from 5+ sources into qualified, prioritized prospects in your CRM within seconds. Never miss a hot lead again.",
    link: "/demos/smart-lead-machine",
    status: "Live",
  },
  {
    title: "Revenue Recovery Robot",
    industry: "Ecommerce",
    useCase: "Ecommerce abandoned cart detection with personalized AI reactivation.",
    roi: "Recovers 15-25% of lost carts",
    description:
      "Automatically detects abandoned carts, analyzes customer history, and sends hyper-personalized SMS/email campaigns to win back sales.",
    link: "/demos/revenue-recovery",
    status: "Live",
  },
  {
    title: "Client Success Engine",
    industry: "Agencies & Consulting",
    useCase: "Automated client onboarding, project setup, and progress updates.",
    roi: "Reduces onboarding time by 85%",
    description:
      "From signed contract to project kickoff in minutes. Automates DocuSign, Asana/Monday setup, and keeps clients informed with progress reports.",
    link: "/demos/client-success-engine",
    status: "Live",
  },
  {
    title: "AI Receptionist",
    industry: "Hospitality & Services",
    useCase: "Answers calls, books appointments, and manages Google Calendar.",
    roi: "24/7 availability, zero missed calls",
    description:
      "Your always-on virtual front desk. Handles incoming calls, schedules appointments directly in Google Calendar, and provides instant responses. Perfect for restaurants, salons, and busy entrepreneurs.",
    status: "In Development",
  },
  {
    title: "Customer Happiness Hub",
    industry: "Service Businesses",
    useCase: "Monitors reviews, classifies sentiment, and drafts auto-responses.",
    roi: "98% faster response time",
    description:
      "Aggregates customer feedback from all channels, uses AI to understand sentiment, and routes issues to the right team member with a suggested response.",
    link: "/demos/customer-happiness-hub",
    status: "Live",
  },
  {
    title: "Data-Entry Automation Studio",
    industry: "Operations",
    useCase: "Watch AI convert messy inputs into clean, mapped records.",
    roi: "Saves 20+ hours/week",
    description:
      "Replace repetitive data-entry tasks across finance, sales, and support. Try sample invoices, messy leads CSVs, and real support emails.",
    link: "/demos/data-entry-automation",
    status: "Live",
    // static stat chips displayed in card UI below
    stats: {
      timeSavedPerDay: "13 hrs",
      errorReduction: "85%",
      firstPassYield: "95%",
    },
  },
]

export default function DemosPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-mono text-4xl font-thin text-white md:text-5xl">Live Automation Demos</h1>
        <p className="mt-4 text-lg text-subtle-gray">
          These are real automations we've already built — but they're just a starting point. Barri.ai specializes in
          custom-built workflows powered by the best AI available.
        </p>
      </div>

      <div className="mt-12">
        <ChromaGrid items={demos} />
      </div>

      <Card className="bg-accent/5 border-2 border-accent/50 flex flex-col justify-between md:col-span-2 lg:col-span-1 p-6 rounded-xl mt-8">
        <div>
          <h3 className="text-white font-bold text-lg">Looking for Something Custom?</h3>
          <p className="text-white/60 mt-2 text-sm">
            We design bespoke automations tailored to your exact needs. Typical builds take 2-4 weeks. From Zapier
            migrations to autonomous GPT agents, we can build it.
          </p>
        </div>
        <Button asChild className="mt-4 w-full">
          <Link href="/contact">
            Start a Custom Build <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </Card>

      <div className="mt-16">
        <IntegrationEcosystem />
      </div>
    </div>
  )
}
