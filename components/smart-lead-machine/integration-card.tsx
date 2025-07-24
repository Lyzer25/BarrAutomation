"use client"

import React from "react"
import { motion } from "framer-motion"
import IntegrationLogo from "./integration-logo"
import { Checkbox } from "@/components/ui/checkbox"

interface IntegrationCardProps {
  id: string
  name: string
  description: string
  domain: string
  isSelected: boolean
  onSelectionChange: (id: string) => void
}

const IntegrationCard = React.memo(
  ({ id, name, description, domain, isSelected, onSelectionChange }: IntegrationCardProps) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`relative p-4 rounded-lg transition-all group ${
          isSelected ? "ring-2 ring-cyan-400" : ""
        }`}
        onClick={() => onSelectionChange(id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <IntegrationLogo domain={domain} name={name} />
            <h4 className="font-bold text-white">{name}</h4>
          </div>
          <Checkbox checked={isSelected} className="mt-1" />
        </div>
        <p className="text-xs text-subtle-gray mt-2">{description}</p>
      </motion.div>
    )
  }
)

IntegrationCard.displayName = "IntegrationCard"

export default IntegrationCard
