'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Bot, Zap, Clock, DollarSign, FileCode, GitMerge, Bug, Gauge, ArrowRight, Check, Star, Sparkles } from 'lucide-react'
import Link from 'next/link'

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
      icon: FileCode,
      title: "Data Processing",
      description: "Transform and clean your data",
      time: "24 hours",
      price: "$200",
      examples: ["CSV manipulation", "Data migration", "Format conversion"]
    },
    {
      category: 'integration',
      icon: GitMerge,
      title: "API Integration",
      description: "Connect any two services",
      time: "72 hours",
      price: "$500",
      examples: ["Webhook setup", "Third-party APIs", "Custom connectors"]
    },
    {
      category: 'monitoring',
      icon: Gauge,
      title: "Monitoring Scripts",
      description: "Keep an eye on your systems",
      time: "48 hours",
      price: "$400",
      examples: ["Uptime monitoring", "Performance alerts", "Log analysis"]
    },
    {
      category: 'fix',
      icon: Bug,
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 py-24 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-red-900/30 border border-red-500/30 rounded-full text-red-400 text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            FAST TURNAROUND • FIXED PRICING • NO COMPLEXITY
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Quick Scripts &</span>
            <br />
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Smart Automations
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Need something automated fast? From simple scripts to complex workflows, 
            we deliver custom working solutions in hours, not weeks. Fixed prices, rapid delivery.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-red-400">24hr</div>
              <div className="text-gray-400 mt-2">Average Delivery</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-red-400">$250</div>
              <div className="text-gray-400 mt-2">Starting Price</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-red-400">500+</div>
              <div className="text-gray-400 mt-2">Scripts Delivered</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-red-400">4.9★</div>
              <div className="text-gray-400 mt-2">Client Rating</div>
            </motion.div>
          </div>
        </motion.div>
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
      <section className="px-6 py-12 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScripts.map((script, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 p-2.5">
                  <script.icon className="w-full h-full text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">{script.price}</div>
                  <div className="text-sm text-gray-400">{script.time}</div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{script.title}</h3>
              <p className="text-gray-400 mb-4">{script.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm font-semibold text-gray-500">Common uses:</div>
                {script.examples.map((example, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    {example}
                  </div>
                ))}
              </div>
              
              <Link href="/contact">
                <button className="w-full py-2.5 bg-gray-800 text-white rounded-lg hover:bg-red-500 hover:text-white transition-all font-semibold">
                  Get Started
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Scripts Showcase */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            <Terminal className="inline w-8 h-8 mr-3 text-red-400" />
            Most Popular Custom Scripts This Month
          </h2>
          
          <div className="space-y-4">
            {popularScripts.map((script, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-gray-600">#{index + 1}</div>
                  <div>
                    <h4 className="font-semibold text-white">{script.name}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-gray-400">{script.downloads} uses</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-400 ml-1">{script.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/contact">
                  <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-semibold">
                    View Details
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">
          Simple Process, <span className="text-red-400">Fast Results</span>
        </h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: Terminal, title: "Describe Your Need", desc: "Tell us what you need automated or built" },
            { icon: DollarSign, title: "Get Instant Quote", desc: "Fixed price, no surprises" },
            { icon: Bot, title: "Rapid Development", desc: "We start immediately on your custom solution" },
            { icon: Zap, title: "Deploy & Support", desc: "Working solution + 30 days support" }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 p-4">
                <step.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
              {index < 3 && (
                <ArrowRight className="w-6 h-6 text-gray-600 mx-auto mt-4 hidden md:block" />
              )}
            </motion.div>
          ))}
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

      {/* Pricing Table */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-3xl p-12 border border-red-500/20"
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Transparent Pricing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-red-400 mb-4">$150</div>
              <h3 className="text-2xl font-bold text-white mb-2">Micro Scripts</h3>
              <p className="text-gray-400 mb-4">Simple one-file solutions</p>
              <ul className="space-y-2 text-left">
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />Under 100 lines</li>
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />Same day delivery</li>
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />Basic testing</li>
              </ul>
            </div>
            
            <div className="text-center border-2 border-red-500 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                MOST POPULAR
              </div>
              <div className="text-6xl font-bold text-red-400 mb-4">$350</div>
              <h3 className="text-2xl font-bold text-white mb-2">Standard Scripts</h3>
              <p className="text-gray-400 mb-4">Multi-file automations</p>
              <ul className="space-y-2 text-left">
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />100-500 lines</li>
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />48hr delivery</li>
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />Full testing</li>
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />Documentation</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-red-400 mb-4">$750+</div>
              <h3 className="text-2xl font-bold text-white mb-2">Complex Workflows</h3>
              <p className="text-gray-400 mb-4">Full automation systems</p>
              <ul className="space-y-2 text-left">
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />500+ lines</li>
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />3-5 day delivery</li>
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />Integration testing</li>
                <li className="text-gray-300"><Check className="inline w-4 h-4 text-green-400 mr-2" />30-day support</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-black/20 rounded-full text-white/90 text-sm font-semibold mb-6">
            <Clock className="w-4 h-4 mr-2" />
            AVERAGE RESPONSE TIME: 30 MINUTES
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Got Something to Automate?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Describe your task and get a quote in minutes. Most custom scripts delivered within 24-48 hours.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <button className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Get Instant Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
            <Link href="/demos">
              <button className="px-8 py-4 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-colors backdrop-blur">
                View Script Gallery
              </button>
            </Link>
          </div>
          
          <p className="text-sm text-white/70 mt-8">
            💡 Pro tip: Bundle multiple scripts for 20% off total price
          </p>
        </motion.div>
      </section>
    </div>
  )
}
