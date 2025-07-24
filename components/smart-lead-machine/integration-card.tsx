"use client"

import { motion } from "framer-motion"
import IntegrationLogo from "./integration-logo"

interface IntegrationCardProps {
  name: string
  description: string
  domain: string
}

const IntegrationCard = ({ name, description, domain }: IntegrationCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  >
    <div className="flex items-center gap-3">
      <IntegrationLogo domain={domain} name={name} />
      <h4 className="font-bold text-white">{name}</h4>
    </div>
    <p className="text-xs text-subtle-gray mt-2">{description}</p>
  </motion.div>
)

export default IntegrationCard
