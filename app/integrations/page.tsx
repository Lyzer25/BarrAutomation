import React from "react"
import { integrationData } from "@/lib/integrations"
import IntegrationCard from "@/components/smart-lead-machine/integration-card"
import { StarBorder } from "@/components/bits/star-border"
import { motion } from "framer-motion"

export const metadata = {
  title: "Integrations | Barri.ai",
  description: "Browse the full list of services and platforms we can automate.",
}

export default function IntegrationsPage() {
  const allIntegrations = Object.entries(integrationData).map(([id, data]) => ({ id, ...data }))

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white">Integration Ecosystem</h1>
        <p className="mt-4 text-lg text-subtle-gray max-w-2xl mx-auto">
          We connect with hundreds of tools to automate every corner of your business. Explore our most popular integrations below.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allIntegrations.map((integration) => (
          <StarBorder key={integration.id}>
            <IntegrationCard
              name={integration.name}
              description={integration.description}
              slug={integration.slug}
            />
          </StarBorder>
        ))}
      </div>
    </div>
  )
}
