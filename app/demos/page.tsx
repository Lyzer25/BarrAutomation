import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
    useCase: "Shopify abandoned cart detection with personalized AI reactivation.",
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
    status: "Coming Soon",
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
      firstPassYield: "95%"
    }
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {demos.map((demo, index) => (
          <Card
            key={index}
            className="bg-black border border-white/10 flex flex-col hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white">{demo.title}</CardTitle>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs font-mono bg-accent/20 text-accent px-2 py-1 rounded">{demo.industry}</span>
                  <Badge
                    variant={demo.status === "Live" ? "default" : "secondary"}
                    className={
                      demo.status === "Live"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : demo.status === "In Development"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                    }
                  >
                    {demo.status}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-subtle-gray pt-2">{demo.useCase}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-white/80 mb-4">{demo.description}</p>
              <p className="text-sm font-bold text-accent">{demo.roi}</p>

              {demo.stats && (
                <div className="mt-4 flex gap-2">
                  <div className="text-xs bg-white/5 px-2 py-1 rounded">
                    <div className="text-muted-foreground">Time saved/day</div>
                    <div className="font-mono">{demo.stats.timeSavedPerDay}</div>
                  </div>
                  <div className="text-xs bg-white/5 px-2 py-1 rounded">
                    <div className="text-muted-foreground">Error reduction</div>
                    <div className="font-mono">{demo.stats.errorReduction}</div>
                  </div>
                  <div className="text-xs bg-white/5 px-2 py-1 rounded">
                    <div className="text-muted-foreground">First‑pass yield</div>
                    <div className="font-mono">{demo.stats.firstPassYield}</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {demo.link && demo.status === "Live" ? (
                <Button asChild variant="secondary" className="w-full">
                  <Link href={demo.link}>
                    Try Live Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : demo.link && demo.status === "In Development" ? (
                <Button asChild variant="secondary" className="w-full">
                  <Link href={demo.link}>
                    Try Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button variant="secondary" className="w-full" disabled>
                  {demo.status === "In Development" ? "In Development" : "Coming Soon"}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}

        <Card className="bg-accent/5 border-2 border-accent/50 flex flex-col justify-between md:col-span-2 lg:col-span-1 p-6 rounded-xl">
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
      </div>
    </div>
  )
}
