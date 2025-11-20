"use client"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface IntegrationFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeCategory: string
  setActiveCategory: (category: string) => void
}

import { integrationCategories } from "@/lib/integrations"

const categories = ["All", ...Object.values(integrationCategories).map((c) => c.label)]

export default function IntegrationFilters({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: IntegrationFiltersProps) {
  return (
    <div className="flex flex-col items-center gap-8 my-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Search className="w-5 h-5 text-white/40" />
        </div>
        <Input
          type="text"
          placeholder="Search AI integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 pl-12 pr-6 bg-white/5 border-red-500/20 backdrop-blur-xl rounded-2xl text-white placeholder:text-white/40 focus:border-red-500/40 focus:bg-white/10 transition-all"
        />
      </motion.div>

      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Button
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`
                px-6 py-3 rounded-full font-medium transition-all duration-300
                ${
                  activeCategory === category
                    ? "bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-red-500/20 hover:border-red-500/40 backdrop-blur-sm"
                }
              `}
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
