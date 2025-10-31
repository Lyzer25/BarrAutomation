"use client"

import React from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import PixelBlast to avoid SSR issues (WebGL/window access)
const PixelBlast = dynamic(() => import("@/components/ui/PixelBlast"), { ssr: false })

type LandingBackgroundWrapperProps = {
  children: React.ReactNode
}

export function LandingBackgroundWrapper({ children }: LandingBackgroundWrapperProps) {
  const pathname = usePathname()
  const isLanding = pathname === "/"

  if (!isLanding) return <>{children}</>

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <PixelBlast
        variant="square"
        pixelSize={2}
        color="#7C0A02"
        patternScale={3.5}
        patternDensity={1.1}
        pixelSizeJitter={0.4}
        liquid
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.8}
        edgeFade={0}
        transparent
        className="absolute inset-0 -z-10 w-full h-full"
      />
      <div className="relative z-0">{children}</div>
    </div>
  )
}


