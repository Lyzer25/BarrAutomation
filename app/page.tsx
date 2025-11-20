import type { Metadata } from 'next'
import HomePage from './home-page'

<<<<<<< Refactoring
export const metadata: Metadata = {
  title: 'Custom Development Solutions | Barr Automation',
  description: 'Specialized custom development for web applications, internal software, process automation, and AI solutions. Built specifically for your business needs.',
}
=======
import { Button } from "@/components/ui/button"
import LogoCarousel from "@/components/logo-carousel"
import Link from "next/link"
import { Zap, BrainCircuit, Bot, BarChart } from "lucide-react"

// Static generation with 1-hour revalidation
export const dynamic = 'force-static'
export const revalidate = 3600

const stats = [
  { icon: Zap, value: "30-Second", label: "Workflow Execution" },
  { icon: BrainCircuit, value: "All the most modern AI's", label: "Powered Logic" },
  { icon: Bot, value: "Fully Custom", label: "AI Agents" },
  { icon: BarChart, value: "240%+", label: "Increase in Efficiency" },
]

const whatWeBuild = [
  "Custom chatbot logic & handoff",
  "Lead capture with OpenAI scoring",
  "Follow-up logic (text, drip, CRM)",
  "Fully managed ecommerce pipelines",
  "Cross-platform VA automations",
  "AI-based reporting agents",
  "Regulatory data automation (SOC2/GDPR)",
  "Bespoke n8n / Make.com systems",
  "Autonomous GPT agents",
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="font-mono text-4xl font-thin tracking-tighter text-white md:text-6xl lg:text-7xl">
          Real-Time AI Automation for Business. Workflows That Execute in Seconds.
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-subtle-gray md:text-xl">
          From 45 minutes to 30 seconds — automate your sales, service, onboarding, reporting, Inventory, logistics, workflows or anything else.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/demos">Explore Demos</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Build My Custom Solution</Link>
          </Button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-12 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <stat.icon className="h-10 w-10 text-accent mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-subtle-gray">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Carousel Section */}
      <section className="py-12 bg-black/20">
        <div className="container mx-auto px-4">
          <h3 className="text-center font-mono text-2xl text-white mb-8">
            Integrating With The Tools You Already Love
          </h3>
          <LogoCarousel />
        </div>
      </section>
>>>>>>> main

export default function Page() {
  return <HomePage />
}
