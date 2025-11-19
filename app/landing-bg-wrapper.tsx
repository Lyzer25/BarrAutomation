"use client"

import React from "react"

type LandingBackgroundWrapperProps = {
  children: React.ReactNode
}

export function LandingBackgroundWrapper({ children }: LandingBackgroundWrapperProps) {
  return (
    <div className="relative w-full min-h-screen">
      <div className="relative z-0">{children}</div>
    </div>
  )
}
