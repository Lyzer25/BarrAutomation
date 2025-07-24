"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"

interface IntegrationLogoProps {
  domain: string
  name: string
  size?: number
}

const IntegrationLogo = ({ domain, name, size = 24 }: IntegrationLogoProps) => {
  const { theme } = useTheme()
  const [error, setError] = useState(false)

  const logoUrl = `https://logo.clearbit.com/${domain}`

  if (error) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-muted"
        style={{ width: size, height: size }}
      >
        <span className="font-bold text-xs text-muted-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={logoUrl}
      alt={`${name} Logo`}
      width={size}
      height={size}
      onError={() => setError(true)}
      className="transition-transform group-hover:scale-110"
    />
  )
}

export default IntegrationLogo
