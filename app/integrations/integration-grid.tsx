"use client"
import { motion, AnimatePresence } from "framer-motion"
import StarBorder from "@/components/bits/Animations/StarBorder/StarBorder"
import IntegrationCard from "@/components/smart-lead-machine/integration-card"

interface IntegrationGridProps {
  integrations: any[]
  selectedIds: Set<string>
  onSelectionChange: (id: string) => void
}

export default function IntegrationGrid({ integrations, selectedIds, onSelectionChange }: IntegrationGridProps) {
  console.log("[v0] IntegrationGrid rendering with", integrations.length, "integrations")

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
      <AnimatePresence mode="popLayout">
        {integrations.map((integration) => (
          <motion.div
            key={integration.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              opacity: { duration: 0.2 },
            }}
            whileHover={{ y: -8 }}
          >
            <StarBorder className="w-full h-full" as="div" thickness={1} color="rgb(239, 68, 68)" speed="8s">
              <IntegrationCard
                name={integration.name}
                description={integration.description}
                domain={integration.domain}
              />
            </StarBorder>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
