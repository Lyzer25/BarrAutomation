"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { integrationCategories, integrations } from "@/lib/integrations"
import { cn } from "@/lib/utils"

const IntegrationCard = ({ name, icon, description }: { name: string; icon: string; description: string }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent/50 transition-all group"
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <h4 className="font-bold text-white">{name}</h4>
    </div>
    <p className="text-xs text-subtle-gray mt-2">{description}</p>
  </motion.div>
)

export default function IntegrationEcosystem() {
  const [activeTab, setActiveTab] = useState<keyof typeof integrationCategories>("crm-sales")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIntegrations = Object.entries(integrations)
    .flatMap(([category, items]) =>
      items.map((item) => ({ ...item, category: category as keyof typeof integrationCategories })),
    )
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const displayedIntegrations = searchTerm ? filteredIntegrations : integrations[activeTab]

  return (
    <section className="py-20">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="font-mono text-3xl md:text-4xl font-thin text-white">Connect to Every Tool You Already Use</h2>
        <p className="mt-4 text-subtle-gray">
          Our Smart Lead Machine works with 400+ services. If you use it, we can automate it.
        </p>
        <div className="mt-6 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search your tools (e.g., QuickBooks, Shopify, Slack)..."
            className="bg-black border-white/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {!searchTerm && (
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {Object.entries(integrationCategories).map(([key, { label, count }]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as keyof typeof integrationCategories)}
              className={cn(
                "px-4 py-2 text-sm rounded-full border transition-colors",
                activeTab === key
                  ? "bg-accent text-black border-accent font-bold"
                  : "bg-white/5 border-white/10 text-subtle-gray hover:bg-white/10",
              )}
            >
              {label} <span className="opacity-70">{count}</span>
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedIntegrations.map((integration) => (
          <IntegrationCard key={integration.name} {...integration} />
        ))}
      </motion.div>
    </section>
  )
}
