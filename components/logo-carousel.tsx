"use client"

import React from "react"
import { integrationData } from "@/lib/integrations"
import IntegrationLogo from "@/components/smart-lead-machine/integration-logo"
import { motion } from "framer-motion"

const LogoCarousel = () => {
  const logos = Object.values(integrationData).slice(0, 20) // Take the first 20 for the carousel

  return (
    <div className="relative w-full overflow-hidden py-12">
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-transparent to-background" />
      <motion.div
        className="flex"
        animate={{
          x: ["0%", "-100%"],
          transition: {
            ease: "linear",
            duration: 25,
            repeat: Infinity,
          },
        }}
      >
        {[...logos, ...logos].map((logo, index) => (
          <div key={index} className="flex-shrink-0 mx-8" style={{ width: "100px" }}>
            <IntegrationLogo slug={logo.slug} name={logo.name} size={40} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default LogoCarousel
