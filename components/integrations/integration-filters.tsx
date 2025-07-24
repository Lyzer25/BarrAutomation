"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface IntegrationFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeCategory: string
  setActiveCategory: (category: string) => void
}

const categories = ["All", "Most Common", "New", "Marketing", "Sales"]

export default function IntegrationFilters({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: IntegrationFiltersProps) {
  return (
    <div className="flex flex-col items-center gap-4 my-8">
      <div className="w-full max-w-md">
        <Input
          type="text"
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
