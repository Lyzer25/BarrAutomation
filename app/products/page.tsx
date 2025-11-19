'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, Server, Terminal, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeInView } from '@/components/animations/fade-in-view'
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger-container'

export default function ProductsPage() {
  const products = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Professional websites and web applications that drive results",
      href: "/products/web-development",
    },
    {
      icon: Server,
      title: "Software & Internal Tools",
      description: "Enterprise solutions that transform your operations",
      href: "/products/software-tools",
    },
    {
      icon: Terminal,
      title: "Scripts & Automations",
      description: "Quick solutions for repetitive tasks and workflows",
      href: "/products/scripts-automation",
    },
    {
      icon: Sparkles,
      title: "AI Automations",
      description: "Custom AI solutions tailored to your business needs",
      href: "/products/ai-automations",
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <section className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="font-sans text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
            Our Products
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
            Custom solutions for web, software, automation, and AI
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 pb-32">
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <Link key={index} href={product.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-[#1c1c1e] border border-white/10 hover:border-white/20 rounded-3xl p-10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <product.icon className="w-7 h-7 text-white/90" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                  {product.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {product.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/60 mb-10 leading-relaxed">
            Let's discuss your project and find the perfect solution
          </p>
          
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors"
            >
              Contact Us Today
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
