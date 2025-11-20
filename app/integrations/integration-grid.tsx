"use client"
import { motion } from "framer-motion"
import StarBorder from "@/components/bits/Animations/StarBorder/StarBorder"
import IntegrationCard from "@/components/smart-lead-machine/integration-card"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

interface IntegrationGridProps {
  integrations: any[]
  selectedIds: Set<string>
  onSelectionChange: (id: string) => void
}

export default function IntegrationGrid({ integrations, selectedIds, onSelectionChange }: IntegrationGridProps) {
  return (
    <StaggerContainer
      staggerDelay={0.05}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12"
    >
      {integrations.map((integration, index) => (
        <StaggerItem key={integration.id}>
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}
