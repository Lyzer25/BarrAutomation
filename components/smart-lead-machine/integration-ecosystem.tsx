"use client"

import React, { useState, ChangeEvent } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { integrationCategories, integrationData } from "@/lib/integrations"
import { cn } from "@/lib/utils"
import IntegrationCard from "./integration-card"

export default function IntegrationEcosystem() {
  const [activeTab, setActiveTab] = useState<keyof typeof integrationCategories>("crm-sales")
  const [searchTerm, setSearchTerm] = useState("")

  const allIntegrations = Object.entries(integrationData).map(([id, data]) => ({ id, ...data }))

  const filteredIntegrations = allIntegrations.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const displayedIntegrations = searchTerm
    ? filteredIntegrations
    : integrationCategories[activeTab].integrations.map((id) => ({ id, ...integrationData[id] }))

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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {!searchTerm && (
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {Object.entries(integrationCategories).map(([key, { label, integrations }]) => (
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
              {label} <span className="opacity-70">{integrations.length}</span>
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedIntegrations.map(({ id, name, description, domain }) => (
          <IntegrationCard key={id} name={name} description={description} domain={domain} />
        ))}
      </motion.div>
    </section>
  )
}
