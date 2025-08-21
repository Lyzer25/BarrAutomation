"use client"

import { useState, useEffect } from "react"

const logos = [
  { name: "OpenAI", src: "/placeholder.svg?height=40&width=120&text=OpenAI" },
  { name: "Stripe", src: "/placeholder.svg?height=40&width=120&text=Stripe" },
  { name: "Shopify", src: "/placeholder.svg?height=40&width=120&text=Shopify" },
  { name: "Slack", src: "/placeholder.svg?height=40&width=120&text=Slack" },
  { name: "Discord", src: "/placeholder.svg?height=40&width=120&text=Discord" },
  { name: "Gmail", src: "/placeholder.svg?height=40&width=120&text=Gmail" },
  { name: "HubSpot", src: "/placeholder.svg?height=40&width=120&text=HubSpot" },
  { name: "Salesforce", src: "/placeholder.svg?height=40&width=120&text=Salesforce" },
  { name: "Zapier", src: "/placeholder.svg?height=40&width=120&text=Zapier" },
  { name: "Airtable", src: "/placeholder.svg?height=40&width=120&text=Airtable" },
]

export default function LogoCarousel() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex justify-center items-center space-x-8 opacity-50">
        {logos.slice(0, 5).map((logo, index) => (
          <img
            key={index}
            src={logo.src || "/placeholder.svg"}
            alt={logo.name}
            className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300"
          />
        ))}
      </div>
    )
  }

  // Duplicate the logos array for seamless loop
  const duplicatedLogos = [...logos, ...logos]

  return (
    <div className="relative overflow-hidden">
      <div className="flex space-x-8 animate-scroll">
        {duplicatedLogos.map((logo, index) => (
          <img
            key={index}
            src={logo.src || "/placeholder.svg"}
            alt={logo.name}
            className="h-8 w-auto flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  )
}
