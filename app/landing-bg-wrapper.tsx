"use client"

import React from "react"
import dynamic from "next/dynamic"
import { AmbientBackground } from "@/components/ambient-background"

// Dynamically import PixelBlast to avoid SSR issues (WebGL/window access)
const PixelBlast = dynamic(() => import("@/components/ui/PixelBlast"), { ssr: false })

type LandingBackgroundWrapperProps = {
  children: React.ReactNode
}

export function LandingBackgroundWrapper({ children }: LandingBackgroundWrapperProps) {
  return (
    <div className="relative w-full min-h-screen">
      <AmbientBackground />
      <div className="relative z-0">{children}</div>
    </div>
  )
}
