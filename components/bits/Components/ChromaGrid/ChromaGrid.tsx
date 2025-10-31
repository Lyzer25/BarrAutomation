"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface DemoItem {
  title: string
  industry: string
  useCase: string
  roi: string
  description: string
  link?: string
  status: string
  stats?: {
    timeSavedPerDay: string
    errorReduction: string
    firstPassYield: string
  }
}

interface ChromaGridProps {
  items: DemoItem[]
}

export default function ChromaGrid({ items }: ChromaGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
          className="relative group"
        >
          {/* Chroma Grid Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Animated Border */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/30 via-transparent to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

          <Card className="relative bg-black/80 backdrop-blur-sm border border-white/10 flex flex-col h-full transition-all duration-500 group-hover:border-accent/50 group-hover:shadow-2xl group-hover:shadow-accent/20 overflow-hidden">
            {/* Chroma Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="relative z-10">
              <div className="flex justify-between items-start">
                <CardTitle className="text-white group-hover:text-accent transition-colors duration-300">
                  {item.title}
                </CardTitle>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs font-mono bg-accent/20 text-accent px-2 py-1 rounded group-hover:bg-accent/30 transition-colors duration-300">
                    {item.industry}
                  </span>
                  <Badge
                    variant={item.status === "Live" ? "default" : "secondary"}
                    className={
                      item.status === "Live"
                        ? "bg-green-500/20 text-green-300 border-green-500/30 group-hover:bg-green-500/30 transition-colors duration-300"
                        : item.status === "In Development"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 group-hover:bg-yellow-500/30 transition-colors duration-300"
                          : "bg-gray-500/20 text-gray-300 border-gray-500/30 group-hover:bg-gray-500/30 transition-colors duration-300"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-subtle-gray pt-2 group-hover:text-white/80 transition-colors duration-300">
                {item.useCase}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow relative z-10">
              <p className="text-sm text-white/80 mb-4 group-hover:text-white transition-colors duration-300">
                {item.description}
              </p>
              <p className="text-sm font-bold text-accent group-hover:text-accent/80 transition-colors duration-300">
                {item.roi}
              </p>

              {item.stats && (
                <motion.div
                  className="mt-4 flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0.8, y: hoveredIndex === index ? 0 : 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-xs bg-white/5 px-2 py-1 rounded group-hover:bg-accent/10 transition-colors duration-300">
                    <div className="text-muted-foreground group-hover:text-accent/70 transition-colors duration-300">
                      Time saved/day
                    </div>
                    <div className="font-mono text-white group-hover:text-accent transition-colors duration-300">
                      {item.stats.timeSavedPerDay}
                    </div>
                  </div>
                  <div className="text-xs bg-white/5 px-2 py-1 rounded group-hover:bg-accent/10 transition-colors duration-300">
                    <div className="text-muted-foreground group-hover:text-accent/70 transition-colors duration-300">
                      Error reduction
                    </div>
                    <div className="font-mono text-white group-hover:text-accent transition-colors duration-300">
                      {item.stats.errorReduction}
                    </div>
                  </div>
                  <div className="text-xs bg-white/5 px-2 py-1 rounded group-hover:bg-accent/10 transition-colors duration-300">
                    <div className="text-muted-foreground group-hover:text-accent/70 transition-colors duration-300">
                      First‑pass yield
                    </div>
                    <div className="font-mono text-white group-hover:text-accent transition-colors duration-300">
                      {item.stats.firstPassYield}
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>

            <CardFooter className="relative z-10">
              {item.link && item.status === "Live" ? (
                <Button
                  asChild
                  variant="secondary"
                  className="w-full group-hover:bg-accent group-hover:text-white hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  <Link href={item.link}>
                    Try Live Demo{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              ) : item.link && item.status === "In Development" ? (
                <Button
                  asChild
                  variant="secondary"
                  className="w-full group-hover:bg-accent group-hover:text-white hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  <Link href={item.link}>
                    Try Demo{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              ) : (
                <Button variant="secondary" className="w-full" disabled>
                  {item.status === "In Development" ? "In Development" : "Coming Soon"}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
