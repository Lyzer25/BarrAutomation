'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Bot, Zap, Clock, ArrowRight, Check, Star } from 'lucide-react'
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
    { name: "Google Sheets Automation", downloads: 1420, rating: 4.9 },
    { name: "Bitcoin Miner Monitor", downloads: 890, rating: 5.0 },
    { name: "Inventory Sync Script", downloads: 756, rating: 4.8 },
    { name: "PDF Report Generator", downloads: 623, rating: 4.9 },
    { name: "Slack Notification Bot", downloads: 512, rating: 4.7 }
  ]

  const testimonials = [
    {
      text: "Barr built us a custom mining monitoring script that saved us $50k in prevented downtime. Delivered in 2 days!",
      author: "Mining Operations Manager",
      company: "CryptoMine Inc.",
      rating: 5
    },
    {
      text: "Needed a quick data migration script. Got it same day, worked perfectly. Will definitely use again.",
      author: "CTO",
      company: "TechStartup",
      rating: 5
    },
    {
      text: "The automation scripts cut our manual work by 90%. Best ROI we've seen from such a small investment.",
      author: "Operations Director",
      company: "E-Commerce Co.",
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6 text-sm font-mono">
            <Terminal className="w-4 h-4" />
            Scripts & Automations
          </div>
          
          <h1 className="font-mono text-4xl font-thin text-white md:text-6xl lg:text-7xl">
            Quick Scripts &{' '}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Fast Solutions
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-subtle-gray max-w-3xl mx-auto">
            Need something automated fast? From simple scripts to complex workflows, we deliver custom working solutions in hours, not weeks. Fixed prices, rapid delivery.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="animate-pulse-glow">
              <Link href="/contact">Get Instant Quote</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demos">View Script Gallery</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "24hr", label: "Average Delivery" },
              { value: "$250", label: "Starting Price" },
              { value: "500+", label: "Scripts Delivered" },
              { value: "4.9★", label: "Client Rating" }
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
                  ? 'bg-red-500 text-white'
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
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <script.icon className="w-6 h-6 text-white" />
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
                  <Button asChild className="w-full mt-4" variant="secondary">
                    <Link href="/contact">Get Started</Link>
                  </Button>
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
          What Clients Say
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
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
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
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Got Something to Automate?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Describe your task and get a quote in minutes. Most custom scripts delivered within 24-48 hours.
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-black hover:bg-gray-100">
            <Link href="/contact">
              Get Instant Quote <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  )
}
