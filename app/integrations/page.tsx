"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Brain, Sparkles, Zap } from "lucide-react"
import IntegrationGrid from "./integration-grid"
import IntegrationFilters from "@/components/integrations/integration-filters"
import { integrationData } from "@/lib/integrations"
import { FadeInView } from "@/components/animations/fade-in-view"

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("🚀 Most Common")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allIntegrations = useMemo(() => Object.entries(integrationData).map(([id, data]) => ({ id, ...data })), [])

  const handleSelectionChange = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filteredIntegrations = useMemo(() => {
    let integrations = allIntegrations

    if (activeCategory !== "All") {
      integrations = integrations.filter((i) => i.category === activeCategory || selectedIds.has(i.id))
    }

    if (searchQuery) {
      integrations = integrations.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          selectedIds.has(i.id),
      )
    }

    return integrations
  }, [allIntegrations, searchQuery, activeCategory, selectedIds])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-gradient-to-br from-red-600/20 to-red-900/10 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-[40%] right-[8%] w-80 h-80 rounded-full bg-gradient-to-br from-red-500/15 to-red-700/10 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-[15%] left-[15%] w-72 h-72 rounded-full bg-gradient-to-br from-red-600/15 to-red-800/10 blur-3xl"
        />

        {/* Circuit grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Floating tech icons */}
        {[
          { Icon: Brain, x: "8%", y: "15%", delay: 0.2 },
          { Icon: Sparkles, x: "90%", y: "25%", delay: 0.5 },
          { Icon: Zap, x: "12%", y: "70%", delay: 0.8 },
        ].map(({ Icon, x, y, delay }, idx) => (
          <motion.div
            key={idx}
            className="absolute w-12 h-12 bg-[#0A0A0A]/60 border border-red-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{
              delay,
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              repeatDelay: 4,
            }}
          >
            <Icon className="w-6 h-6 text-red-400/60" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <FadeInView className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6"
          >
            <span className="block">AI</span>
            <span className="block bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              Integrations
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-white/75 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Connect with hundreds of AI-powered tools to automate every corner of your business. Explore our ecosystem
            of intelligent integrations.
          </motion.p>
        </FadeInView>

        <FadeInView delay={0.3}>
          <IntegrationFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </FadeInView>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <IntegrationGrid
            integrations={filteredIntegrations}
            selectedIds={selectedIds}
            onSelectionChange={handleSelectionChange}
          />
        </motion.div>
      </div>
    </div>
  )
}
