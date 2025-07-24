"use client"

import React from "react"
import { motion } from "framer-motion"
import StarBorder from "@/components/bits/Animations/StarBorder/StarBorder"
import IntegrationCard from "@/components/smart-lead-machine/integration-card"

interface IntegrationGridProps {
  integrations: any[]
  selectedIds: Set<string>
  onSelectionChange: (id: string) => void
}

export default function IntegrationGrid({
  integrations,
  selectedIds,
  onSelectionChange,
}: IntegrationGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.05 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {integrations.map((integration) => (
        <StarBorder key={integration.id} className="w-full" as="div" thickness={1} color="cyan">
          <IntegrationCard
            {...integration}
            isSelected={selectedIds.has(integration.id)}
            onSelectionChange={onSelectionChange}
          />
        </StarBorder>
      ))}
    </motion.div>
  )
}
