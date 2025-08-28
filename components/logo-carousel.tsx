"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const logos = [
  { name: "OpenAI", domain: "openai.com" },
  { name: "Stripe", domain: "stripe.com" },
  { name: "Shopify", domain: "shopify.com" },
  { name: "Slack", domain: "slack.com" },
  { name: "Discord", domain: "discord.com" },
  { name: "Gmail", domain: "gmail.com" },
  { name: "HubSpot", domain: "hubspot.com" },
  { name: "Salesforce", domain: "salesforce.com" },
  { name: "Zapier", domain: "zapier.com" },
  { name: "Airtable", domain: "airtable.com" },
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
          <div
            key={index}
            className="h-8 w-24 bg-muted rounded flex items-center justify-center"
          >
            <span className="text-xs text-muted-foreground font-medium">
              {logo.name}
            </span>
          </div>
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
          <div key={index} className="h-8 w-24 flex-shrink-0 flex items-center justify-center">
            <Image
              src={`https://logo.clearbit.com/${logo.domain}`}
              alt={`${logo.name} Logo`}
              width={96}
              height={32}
              className="h-8 w-auto transition-all duration-300"
              onError={(e) => {
                // Fallback to text if logo fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            <div 
              className="h-8 w-24 bg-muted rounded flex items-center justify-center hidden"
              style={{ display: 'none' }}
            >
              <span className="text-xs text-muted-foreground font-medium">
                {logo.name}
              </span>
            </div>
          </div>
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
