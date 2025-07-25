import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  },
  {
    title: "Revenue Recovery Robot",
    industry: "Ecommerce",
    useCase: "Shopify abandoned cart detection with personalized AI reactivation.",
    roi: "Recovers 15-25% of lost carts",
    description:
      "Automatically detects abandoned carts, analyzes customer history, and sends hyper-personalized SMS/email campaigns to win back sales.",
  },
  {
    title: "Client Success Engine",
    industry: "Agencies & Consulting",
    useCase: "Automated client onboarding, project setup, and progress updates.",
    roi: "Reduces onboarding time by 85%",
    description:
      "From signed contract to project kickoff in minutes. Automates DocuSign, Asana/Monday setup, and keeps clients informed with progress reports.",
  },
  {
    title: "Social Media Multiplier",
    industry: "Marketing",
    useCase: "Generates, posts, and monitors content across multiple platforms.",
    roi: "400% increase in content output",
    description:
      "Turns a single idea into a week's worth of platform-specific content for IG, X, FB, and LinkedIn. Monitors replies and generates performance reports.",
  },
  {
    title: "Customer Happiness Hub",
    industry: "Service Businesses",
    useCase: "Monitors reviews, classifies sentiment, and drafts auto-responses.",
    roi: "98% faster response time",
    description:
      "Aggregates customer feedback from all channels, uses AI to understand sentiment, and routes issues to the right team member with a suggested response.",
  },
]

export default function DemosPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-mono text-4xl font-thin text-white md:text-5xl">Live Automation Demos</h1>
        <p className="mt-4 text-lg text-subtle-gray">
          These are real automations we’ve already built — but they’re just a starting point. Barri.ai specializes in
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
                <span className="text-xs font-mono bg-accent/20 text-accent px-2 py-1 rounded">{demo.industry}</span>
              </div>
              <CardDescription className="text-subtle-gray pt-2">{demo.useCase}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-white/80 mb-4">{demo.description}</p>
              <p className="text-sm font-bold text-accent">{demo.roi}</p>
            </CardContent>
            <CardFooter>
              {demo.link ? (
                <Button asChild variant="secondary" className="w-full">
                  <Link href={demo.link}>
                    Try Live Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button variant="secondary" className="w-full" disabled>
                  Try Live Demo <ArrowRight className="ml-2 h-4 w-4" />
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
