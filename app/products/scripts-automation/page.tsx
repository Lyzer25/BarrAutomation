"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Terminal, Bot, Zap, Clock, Check, Play, Code, Workflow, Activity, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ScriptsAutomationPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const scriptTypes = [
    {
      category: "automation",
      icon: Bot,
      title: "Web Scraping",
      description: "Extract data from any website",
      time: "24 hours",
      price: "$250",
      examples: ["Price monitoring", "Lead generation", "Content aggregation"],
    },
    {
      category: "automation",
      icon: Zap,
      title: "Task Automation",
      description: "Automate repetitive daily tasks",
      time: "48 hours",
      price: "$350",
      examples: ["File processing", "Email automation", "Report generation"],
    },
    {
      category: "data",
      icon: Terminal,
      title: "Data Processing",
      description: "Transform and clean your data",
      time: "24 hours",
      price: "$200",
      examples: ["CSV manipulation", "Data migration", "Format conversion"],
    },
    {
      category: "integration",
      icon: Clock,
      title: "API Integration",
      description: "Connect any two services",
      time: "72 hours",
      price: "$500",
      examples: ["Webhook setup", "Third-party APIs", "Custom connectors"],
    },
    {
      category: "monitoring",
      icon: Bot,
      title: "Monitoring Scripts",
      description: "Keep an eye on your systems",
      time: "48 hours",
      price: "$400",
      examples: ["Uptime monitoring", "Performance alerts", "Log analysis"],
    },
    {
      category: "fix",
      icon: Zap,
      title: "Bug Fixes",
      description: "Quick fixes for existing code",
      time: "Same day",
      price: "$150/hr",
      examples: ["Debug scripts", "Performance fixes", "Error resolution"],
    },
  ]

  const popularScripts = [
    { name: "Google Sheets Automation", category: "automation", rating: null },
    { name: "System Monitor", category: "monitoring", rating: null },
    { name: "Inventory Sync Script", category: "integration", rating: null },
    { name: "PDF Report Generator", category: "data", rating: null },
    { name: "Slack Notification Bot", category: "automation", rating: null },
  ]

  const testimonials = [
    {
      text: "A custom monitoring script could save thousands in prevented downtime, delivered in days not weeks.",
      author: "Example Use Case",
      company: "Operations Manager",
      rating: 5,
    },
    {
      text: "Data migration scripts can be delivered same day and work seamlessly with your existing systems.",
      author: "Example Use Case",
      company: "Technology Team",
      rating: 5,
    },
    {
      text: "Automation scripts can cut manual work by up to 90%, providing excellent ROI.",
      author: "Example Use Case",
      company: "Business Operations",
      rating: 5,
    },
  ]

  const categories = [
    { id: "all", label: "All Scripts" },
    { id: "automation", label: "Automation" },
    { id: "data", label: "Data Processing" },
    { id: "integration", label: "Integration" },
    { id: "monitoring", label: "Monitoring" },
    { id: "fix", label: "Bug Fixes" },
  ]

  const filteredScripts =
    selectedCategory === "all" ? scriptTypes : scriptTypes.filter((s) => s.category === selectedCategory)

  return (
    <div className="min-h-screen bg-black">
      <section className="relative container mx-auto px-4 py-32 overflow-hidden">
        {/* Animated workflow lines background */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {/* Horizontal workflow lines */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
              style={{ top: `${20 + i * 20}%`, left: 0, right: 0 }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
            />
          ))}

          {/* Vertical workflow lines */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-red-500/40 to-transparent"
              style={{ left: `${20 + i * 20}%`, top: 0, bottom: 0 }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.2 }}
              transition={{ duration: 1.5, delay: i * 0.15 }}
            />
          ))}

          {/* Flowing data particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-red-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Floating workflow icons */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { Icon: Terminal, pos: { top: "15%", left: "10%" }, delay: 0 },
            { Icon: Code, pos: { top: "25%", right: "15%" }, delay: 0.3 },
            { Icon: Workflow, pos: { bottom: "30%", left: "12%" }, delay: 0.6 },
            { Icon: Activity, pos: { bottom: "20%", right: "18%" }, delay: 0.9 },
            { Icon: Play, pos: { top: "60%", left: "8%" }, delay: 1.2 },
          ].map(({ Icon, pos, delay }, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={pos}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 0.8, delay }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Icon className="w-16 h-16 text-red-500" strokeWidth={1} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-8"
          >
            <div className="px-6 py-2 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-sm">
              <span className="text-red-400 text-sm font-semibold tracking-wide">Automation Excellence</span>
            </div>
          </motion.div>

          {/* Main heading with gradient */}
          <h1 className="font-sans text-6xl md:text-8xl font-bold tracking-tight mb-6">
            <span className="block text-white">Automate</span>
            <span
              className="block bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-transparent bg-clip-text"
              style={{
                textShadow: "0 0 60px rgba(239, 68, 68, 0.3)",
              }}
            >
              everything.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto mb-12">
            Custom scripts and workflow automation delivered in hours.
            <br />
            Turn repetitive tasks into automated solutions.
          </p>

          {/* Code snippet visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="bg-black/60 backdrop-blur-md border border-red-500/20 rounded-2xl p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-red-300"></div>
                <span className="ml-auto text-xs text-red-400 font-mono">automation.py</span>
              </div>
              <div className="font-mono text-sm space-y-2">
                <div className="text-red-400">
                  <span className="text-red-300">def</span> automate_workflow():
                </div>
                <div className="pl-6 text-white/60">
                  <span className="text-red-300">with</span> TaskRunner() <span className="text-red-300">as</span>{" "}
                  runner:
                </div>
                <div className="pl-12 text-white/60">
                  runner.execute(<span className="text-red-400">"process_data"</span>)
                </div>
                <div className="pl-12 text-white/60">
                  runner.notify(<span className="text-red-400">"complete"</span>)
                </div>
                <motion.div
                  className="pl-6 text-white/80"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  # <span className="text-red-400">Fast. Reliable. Automated.</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-full text-base font-semibold overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-400"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>

            <Link href="#examples">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/10 hover:border-red-500/30 transition-all"
              >
                View Examples
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
              { value: "Custom", label: "Tailored Solutions" },
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
                  ? "bg-red-medium text-white"
                  : "bg-[#1c1c1e] text-white/60 hover:text-white hover:bg-[#2c2c2e] border border-white/10"
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
          <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">Custom scripts and automations delivered fast</p>
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
              <div className="group bg-[#0A0A0A] border border-white/10 hover:border-red-medium/40 transition-all duration-500 h-full hover:shadow-xl rounded-3xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-red-dark/20 border border-red-dark/30 rounded-xl flex items-center justify-center">
                    <script.icon className="w-6 h-6 text-red-medium" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-medium">{script.price}</div>
                    <div className="text-xs text-subtle-gray">{script.time}</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-red-light transition-colors mb-3">
                  {script.title}
                </h3>
                <div className="space-y-2 mb-6">
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
                    className="w-full bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    Discuss This Package
                  </motion.button>
                </Link>
              </div>
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
              { number: "04", title: "Deploy & Support", desc: "Working solution + 30 days support" },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-6xl font-bold text-red-medium/20 font-mono mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-subtle-gray">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">What We Can Build For You</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0A0A] border border-white/10 hover:border-red-medium/30 rounded-2xl p-6 transition-all duration-300"
            >
              <p className="text-gray-300 mb-4">{testimonial.text}</p>
              <div className="border-t border-white/10 pt-4">
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
