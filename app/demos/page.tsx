"use client"

import Link from "next/link"
<<<<<<< Refactoring
import { motion } from "framer-motion"
import { ArrowRight, Zap, MessageSquare, Database, Target } from "lucide-react"
=======
import { ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"

// Lazy load heavy components for better performance
const ChromaGrid = dynamic(() => import("@/components/bits/Components/ChromaGrid/ChromaGrid"), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-white/5 rounded-xl" />,
})

const IntegrationEcosystem = dynamic(() => import("@/components/smart-lead-machine/integration-ecosystem"), {
  loading: () => <div className="min-h-[300px] animate-pulse bg-white/5 rounded-xl" />,
})

// Static generation with 1-hour revalidation
export const dynamic = 'force-static'
export const revalidate = 3600
>>>>>>> main

const demos = [
  {
    title: "Smart Lead Machine",
    description: "AI-powered lead generation and qualification system",
    icon: Target,
    href: "/demos/smart-lead-machine",
    color: "from-red-500 to-orange-500",
  },
  {
    title: "Customer Happiness Hub",
    description: "Intelligent customer support automation",
    icon: MessageSquare,
    href: "/demos/customer-happiness-hub",
    color: "from-red-500 to-pink-500",
  },
  {
    title: "Data Entry Automation",
    description: "Automated data extraction and processing",
    icon: Database,
    href: "/demos/data-entry-automation",
    color: "from-red-500 to-purple-500",
  },
  {
    title: "Revenue Recovery",
    description: "Automated payment recovery system",
    icon: Zap,
    href: "/demos/revenue-recovery",
    color: "from-red-500 to-rose-500",
  },
]

export default function DemosPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Live</span>
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"> Demos</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience our AI-powered automation solutions in action. Click on any demo to see how we can transform your
            business.
          </p>
        </motion.div>

        {/* Demos Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={demo.href}>
                <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-[1.02]">
                  {/* Gradient Overlay on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <demo.icon className="w-6 h-6 text-red-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">{demo.title}</h3>

                    <p className="text-white/60 leading-relaxed">{demo.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-white/70 mb-6">Want to build a custom solution for your business?</p>
          <Link href="/contact">
            <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300">
              Get Started
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
