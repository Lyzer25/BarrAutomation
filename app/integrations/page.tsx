import React from "react"
import IntegrationGrid from "./integration-grid"

export const metadata = {
  title: "Integrations | Barri.ai",
  description: "Browse the full list of services and platforms we can automate.",
}

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Integration Ecosystem</h1>
        <p className="mt-4 text-lg text-subtle-gray max-w-2xl mx-auto">
          We connect with hundreds of tools to automate every corner of your business. Explore our most popular integrations below.
        </p>
      </div>
      <IntegrationGrid />
    </div>
  )
}
