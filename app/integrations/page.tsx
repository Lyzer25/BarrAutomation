"use client"

import React, { useState, useMemo } from "react"
import IntegrationGrid from "./integration-grid"
import IntegrationFilters from "@/components/integrations/integration-filters"
import { integrationData } from "@/lib/integrations"

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("🚀 Most Common")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allIntegrations = useMemo(
    () => Object.entries(integrationData).map(([id, data]) => ({ id, ...data })),
    []
  )

  const handleSelectionChange = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filteredIntegrations = useMemo(() => {
    let integrations = allIntegrations

    if (activeCategory !== "All") {
      integrations = integrations.filter(
        (i) => i.category === activeCategory || selectedIds.has(i.id)
      )
    }

    if (searchQuery) {
      integrations = integrations.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          selectedIds.has(i.id)
      )
    }

    return integrations
  }, [allIntegrations, searchQuery, activeCategory, selectedIds])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Integration Ecosystem</h1>
        <p className="mt-4 text-lg text-subtle-gray max-w-2xl mx-auto">
          We connect with hundreds of tools to automate every corner of your business. Explore our most popular integrations below.
        </p>
      </div>
      <IntegrationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <IntegrationGrid
        integrations={filteredIntegrations}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  )
}
