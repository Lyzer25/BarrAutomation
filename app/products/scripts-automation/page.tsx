'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Bot, Zap, Clock, Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ScriptsAutomationPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const scriptTypes = [
    {
      category: 'automation',
      icon: Bot,
      title: "Web Scraping",
      description: "Extract data from any website",
      time: "24 hours",
      price: "$250",
      examples: ["Price monitoring", "Lead generation", "Content aggregation"]
    },
    {
      category: 'automation',
      icon: Zap,
      title: "Task Automation",
      description: "Automate repetitive daily tasks",
      time: "48 hours",
      price: "$350",
      examples: ["File processing", "Email automation", "Report generation"]
    },
    {
      category: 'data',
      icon: Terminal,
      title: "Data Processing",
      description: "Transform and clean your data",
      time: "24 hours",
      price: "$200",
      examples: ["CSV manipulation", "Data migration", "Format conversion"]
    },
    {
      category: 'integration',
      icon: Clock,
      title: "API Integration",
      description: "Connect any two services",
      time: "72 hours",
      price: "$500",
      examples: ["Webhook setup", "Third-party APIs", "Custom connectors"]
    },
    {
      category: 'monitoring',
      icon: Bot,
      title: "Monitoring Scripts",
      description: "Keep an eye on your systems",
      time: "48 hours",
      price: "$400",
      examples: ["Uptime monitoring", "Performance alerts", "Log analysis"]
    },
    {
      category: 'fix',
      icon: Zap,
      title: "Bug Fixes",
      description: "Quick fixes for existing code",
      time: "Same day",
      price: "$150/hr",
      examples: ["Debug scripts", "Performance fixes", "Error resolution"]
    }
  ]

  const popularScripts = [
    { name: "Google Sheets Automation", category: "automation", rating: null },
    { name: "System Monitor", category: "monitoring", rating: null },
    { name: "Inventory Sync Script", category: "integration", rating: null },
    { name: "PDF Report Generator", category: "data", rating: null },
    { name: "Slack Notification Bot", category: "automation", rating: null }
  ]

  const testimonials = [
    {
      text: "A custom monitoring script could save thousands in prevented downtime, delivered in days not weeks.",
      author: "Example Use Case",
      company: "Operations Manager",
      rating: 5
    },
    {
      text: "Data migration scripts can be delivered same day and work seamlessly with your existing systems.",
      author: "Example Use Case",
      company: "Technology Team",
      rating: 5
    },
    {
      text: "Automation scripts can cut manual work by up to 90%, providing excellent ROI.",
      author: "Example Use Case",
      company: "Business Operations",
      rating: 5
    }
  ]

  const categories = [
    { id: 'all', label: 'All Scripts' },
    { id: 'automation', label: 'Automation' },
    { id: 'data', label: 'Data Processing' },
    { id: 'integration', label: 'Integration' },
    { id: 'monitoring', label: 'Monitoring' },
    { id: 'fix', label: 'Bug Fixes' }
  ]

  const filteredScripts = selectedCategory === 'all' 
    ? scriptTypes 
    : scriptTypes.filter(s => s.category === selectedCategory)

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1 className="font-sans text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
            Scripts & Automation
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
            Quick scripts and fast solutions delivered in hours, not weeks
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors"
              >
                Get Instant Quote
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "24hr", label: "Target Delivery" },
              { value: "$250", label: "Starting Price" },
              { value: "Fast", label: "Quick Turnaround" },
              { value: "Custom", label: "Tailored Solutions" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-subtle-gray mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 mx-auto max-w-7xl">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-red-medium text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Script Types Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">What We Build</h2>
          <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
            Custom scripts and automations delivered fast
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScripts.map((script, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-accent/20">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-red-dark/20 border border-red-dark/30 rounded-xl flex items-center justify-center">
                      <script.icon className="w-6 h-6 text-red-medium" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">{script.price}</div>
                      <div className="text-xs text-subtle-gray">{script.time}</div>
                    </div>
                  </div>
                  <CardTitle className="text-white group-hover:text-accent transition-colors">
                    {script.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {script.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center text-sm text-white/80">
                        <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {example}
                      </div>
                    ))}
                  </div>
                  <Link href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full mt-4 bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors"
                    >
                      Discuss This Package
                    </motion.button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Simple Process, Fast Results</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: "01", title: "Describe Your Need", desc: "Tell us what you need automated" },
              { number: "02", title: "Get Instant Quote", desc: "Fixed price, no surprises" },
              { number: "03", title: "Rapid Development", desc: "We start on your solution immediately" },
              { number: "04", title: "Deploy & Support", desc: "Working solution + 30 days support" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-6xl font-bold text-accent/20 font-mono mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-subtle-gray">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">
          What We Can Build For You
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6"
            >
              <p className="text-gray-300 mb-4">{testimonial.text}</p>
              <div className="border-t border-gray-800 pt-4">
                <div className="font-semibold text-white">{testimonial.author}</div>
                <div className="text-sm text-gray-400">{testimonial.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-16 text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            Got something to automate?
          </h2>
          <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto">
            Most custom scripts delivered within 24-48 hours
          </p>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors"
            >
              Get Instant Quote
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
