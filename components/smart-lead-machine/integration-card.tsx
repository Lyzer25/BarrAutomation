"use client"

import React from "react"
import { motion } from "framer-motion"
import IntegrationLogo from "./integration-logo"

interface IntegrationCardProps {
  name: string
  description: string
  domain: string
}

const IntegrationCard = React.memo(({ name, description, domain }: IntegrationCardProps) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative p-6 rounded-2xl transition-all group bg-[#0A0A0A]/80 backdrop-blur-xl border border-red-500/10 hover:border-red-500/30 hover:bg-[#0A0A0A]/90 h-full"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="flex-shrink-0">
            <IntegrationLogo domain={domain} name={name} />
          </motion.div>
          <h4 className="font-semibold text-white text-lg group-hover:text-red-400 transition-colors">{name}</h4>
        </div>
        <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  )
})

IntegrationCard.displayName = "IntegrationCard"

export default IntegrationCard
