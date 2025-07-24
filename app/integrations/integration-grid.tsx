"use client"

import React from "react"
import { motion } from "framer-motion"
import StarBorder from "@/components/bits/Animations/StarBorder/StarBorder"
import IntegrationCard from "@/components/smart-lead-machine/integration-card"
import { integrationData } from "@/lib/integrations"

export default function IntegrationGrid() {
  const allIntegrations = Object.entries(integrationData).map(([id, data]) => ({ id, ...data }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.05 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {allIntegrations.map((integration) => (
        <StarBorder key={integration.id} className="w-full" thickness={1} color="cyan">
            <IntegrationCard
              name={integration.name}
              description={integration.description}
              domain={integration.domain}
            />
        </StarBorder>
      ))}
    </motion.div>
  )
}
