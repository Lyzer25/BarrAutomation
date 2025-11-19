"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Server,
  Database,
  Workflow,
  Shield,
  BarChart3,
  ArrowRight,
  Check,
  Code2,
  Layers,
  GitBranch,
  Network,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SoftwareToolingPage() {
  const [activeTab, setActiveTab] = useState(0)

  const TechnicalHeroBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated circuit lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M 100 200 L 300 200 L 300 400 L 500 400"
          stroke="rgba(239, 68, 68, 0.2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
        />
        <motion.path
          d="M 1000 150 L 800 150 L 800 300 L 600 300"
          stroke="rgba(220, 38, 38, 0.2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 3, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
        />
      </svg>

      {/* Floating nodes */}
      {[
        { Icon: Code2, x: "15%", y: "20%", delay: 0.5 },
        { Icon: Database, x: "85%", y: "30%", delay: 1 },
        { Icon: Layers, x: "10%", y: "70%", delay: 1.5 },
        { Icon: GitBranch, x: "90%", y: "65%", delay: 2 },
        { Icon: Network, x: "50%", y: "15%", delay: 2.5 },
      ].map(({ Icon, x, y, delay }, idx) => (
        <motion.div
          key={idx}
          className="absolute w-16 h-16 rounded-xl bg-[#0A0A0A]/80 backdrop-blur-sm border border-red-500/20 flex items-center justify-center"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.9, 1.1, 0.9],
            rotate: 0,
          }}
          transition={{
            opacity: { duration: 3, delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            scale: { duration: 3, delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            rotate: { duration: 1, delay },
          }}
        >
          <Icon className="w-7 h-7 text-red-400/60" />
        </motion.div>
      ))}

      {/* Connection nodes */}
      {[
        { x: "30%", y: "35%" },
        { x: "70%", y: "45%" },
        { x: "25%", y: "60%" },
        { x: "75%", y: "55%" },
      ].map((pos, idx) => (
        <motion.div
          key={idx}
          className="absolute w-2 h-2 rounded-full bg-red-500/50"
          style={{ left: pos.x, top: pos.y }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              "0 0 0px rgba(239, 68, 68, 0.5)",
              "0 0 20px rgba(239, 68, 68, 0.8)",
              "0 0 0px rgba(239, 68, 68, 0.5)",
            ],
          }}
          transition={{
            duration: 2,
            delay: idx * 0.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Data flow particles */}
      {[...Array(8)].map((_, idx) => (
        <motion.div
          key={idx}
          className="absolute w-1 h-1 rounded-full bg-red-400/60"
          style={{
            left: `${15 + idx * 10}%`,
            top: "30%",
          }}
          animate={{
            y: [0, 400, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            delay: idx * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}

      {/* Glowing orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          left: "10%",
          top: "20%",
          background: "radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          right: "10%",
          bottom: "20%",
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          delay: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )

  const solutions = [
    {
      icon: Workflow,
      title: "Process Automation",
      description: "Eliminate repetitive tasks and streamline workflows",
      stats: "75% time saved",
      color: "red",
      badge: "Automation",
    },
    {
      icon: Database,
      title: "Data Integration",
      description: "Connect all your systems and unify your data",
      stats: "100+ integrations",
      color: "red",
      badge: "Integration",
    },
    {
      icon: BarChart3,
      title: "Custom Dashboards",
      description: "Real-time insights tailored to your business",
      stats: "Real-time updates",
      color: "red",
      badge: "Analytics",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security for your internal tools",
      stats: "SOC2 compliant",
      color: "red",
      badge: "Security",
    },
  ]

  const caseStudies = [
    {
      industry: "Healthcare Platform Example",
      challenge: "Need for HIPAA compliance and real-time scheduling",
      solution: "Custom patient management system with HIPAA compliance and real-time scheduling",
      results: ["Target 99.9% uptime", "Enhanced patient care", "Efficient scheduling"],
    },
    {
      industry: "Warehouse Management Example",
      challenge: "Disconnected inventory across multiple locations",
      solution: "Real-time inventory tracking with automated reordering and multi-location sync",
      results: ["Reduce inventory costs", "Prevent stockouts", "Improve efficiency"],
    },
    {
      industry: "Financial Services Example",
      challenge: "Manual compliance reporting taking weeks",
      solution: "Automated compliance reporting dashboard with audit trails and real-time alerts",
      results: ["Reduce reporting time", "Ensure compliance", "Audit-ready 24/7"],
    },
  ]

  const capabilities = [
    "Custom CRM Systems",
    "ERP Integration",
    "API Development",
    "Microservices",
    "Cloud Migration",
    "DevOps Pipelines",
    "Data Analytics",
    "Machine Learning",
    "IoT Solutions",
    "Blockchain",
    "Real-time Systems",
    "Legacy Modernization",
  ]

  return (
    <div className="min-h-screen bg-black">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <TechnicalHeroBackground />

        <div className="container mx-auto px-4 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-sm mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-400">Software & Internal Tools</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-6xl md:text-8xl font-light tracking-tight text-white mb-8 leading-[1.1]"
            >
              <span className="block">Build the tools</span>
              <span
                className="block bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent"
                style={{
                  textShadow: "0 0 80px rgba(239, 68, 68, 0.3)",
                }}
              >
                your business needs.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-4xl mx-auto mb-12"
            >
              Custom software solutions tailored to your exact business needs. From dashboards to full enterprise
              systems.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black px-10 py-5 rounded-full text-base font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
                >
                  Schedule Consultation
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/demos">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-white/20 bg-white/5 backdrop-blur-md text-white px-10 py-5 rounded-full text-base font-semibold hover:bg-white/10 hover:border-white/30 transition-colors"
                >
                  View Examples
                </motion.button>
              </Link>
            </motion.div>

            {/* Tech stack indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-20 flex flex-wrap justify-center gap-6 items-center"
            >
              {[
                { icon: Database, label: "Database Design" },
                { icon: Server, label: "API Development" },
                { icon: Workflow, label: "Automation" },
                { icon: Shield, label: "Security" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + idx * 0.1 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#0A0A0A]/60 backdrop-blur-sm border border-white/10"
                >
                  <item.icon className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-white/70 font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-6 h-10 border-2 border-white/20 rounded-full p-1"
          >
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-1 h-2 bg-red-500 rounded-full mx-auto"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "Custom", label: "Built For You" },
              { value: "75%+", label: "Time Savings" },
              { value: "99.9%", label: "Uptime Target" },
              { value: "24/7", label: "Support Available" },
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

      {/* Solutions Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Custom Solutions We Build</h2>
          <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
            Every tool is custom-built from scratch to match your exact business requirements
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group bg-[#0A0A0A] backdrop-blur-sm border border-white/10 hover:border-red-medium/30 transition-all duration-500 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold bg-red-dark/20 text-red-light px-3 py-1 rounded-full border border-red-dark/30">
                      {solution.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 bg-red-dark/20 border border-red-dark/30 rounded-xl flex items-center justify-center mb-4">
                    <solution.icon className="w-6 h-6 text-red-medium" />
                  </div>
                  <CardTitle className="text-white">{solution.title}</CardTitle>
                  <CardDescription className="text-white/60">{solution.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-bold text-red-medium">{solution.stats}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Custom Software Development Packages Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Custom Software Development</h2>
          <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
            Flexible pricing for custom software solutions tailored to your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Small Tool Package */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold bg-red-dark/20 text-red-light px-3 py-1.5 rounded-full border border-red-dark/30">
                  Small Tool
                </span>
              </div>

              <div className="mb-8">
                <div className="text-4xl font-bold text-red-medium mb-1">
                  $2,500 <span className="text-2xl text-white/60">- $7,500</span>
                </div>
                <div className="text-sm text-white/60 mb-6">+ $50-$150/month hosting & support</div>

                <p className="text-white/60 text-sm mb-6">
                  Perfect for single-purpose tools and simple internal applications
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Custom dashboards",
                  "Data entry forms",
                  "Simple CRM systems",
                  "Reporting tools",
                  "Basic API integrations",
                  "User authentication",
                  "Database setup",
                  "Mobile responsive design",
                  "Basic support included",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
                >
                  Discuss This Package
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Medium Platform Package */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-[#0A0A0A] border-2 border-green-500/30 rounded-3xl p-8 h-full relative shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full border border-green-500/30">
                  Most Popular
                </span>
              </div>

              <div className="mb-8">
                <div className="text-4xl font-bold text-red-medium mb-1">
                  $10,000 <span className="text-2xl text-white/60">- $25,000</span>
                </div>
                <div className="text-sm text-white/60 mb-6">+ $200-$400/month hosting & support</div>

                <p className="text-white/60 text-sm mb-6">
                  Comprehensive solutions with multiple integrated features and workflows
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Small Tool, plus:",
                  "Complex business logic",
                  "Multi-user role systems",
                  "Advanced integrations",
                  "Real-time features",
                  "Custom workflows",
                  "Analytics & reporting",
                  "Automated notifications",
                  "Data import/export",
                  "Priority support",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-black hover:bg-white/90 px-6 py-3 rounded-full text-sm font-semibold transition-colors"
                >
                  Discuss This Package
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Enterprise Solution Package */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold bg-red-dark/20 text-red-light px-3 py-1.5 rounded-full border border-red-dark/30">
                  Enterprise
                </span>
              </div>

              <div className="mb-8">
                <div className="text-4xl font-bold text-red-medium mb-1">$25,000+</div>
                <div className="text-sm text-white/60 mb-6">Custom pricing per project scope</div>

                <p className="text-white/60 text-sm mb-6">
                  Full-scale enterprise systems with unlimited complexity and customization
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Medium, plus:",
                  "Multi-system integration",
                  "Industry-specific features",
                  "Advanced security (SSO, 2FA)",
                  "Custom architecture design",
                  "Scalability & performance",
                  "Legacy system migration",
                  "Dedicated infrastructure",
                  "24/7 premium support",
                  "Ongoing development & updates",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
                >
                  Discuss This Package
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Potential Solutions */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Potential Solutions</h2>
            <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
              Example scenarios showing how custom software can transform businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-black/80 backdrop-blur-sm border border-white/10 h-full">
                  <CardHeader>
                    <div className="text-xs font-mono bg-accent/20 text-accent px-2 py-1 rounded w-fit mb-2">
                      {study.industry}
                    </div>
                    <CardTitle className="text-white text-2xl">{study.solution}</CardTitle>
                    <CardDescription className="text-subtle-gray">{study.challenge}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-white/80 text-sm">
                      {study.results.map((result, i) => (
                        <li key={i}>{result}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Our Process</h2>
          <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">A proven methodology that ensures on-time delivery</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { number: "01", title: "Discovery", desc: "Deep dive into requirements and system design" },
            { number: "02", title: "Prototyping", desc: "Build MVP to validate approach" },
            { number: "03", title: "Development", desc: "Custom solution with continuous updates" },
            { number: "04", title: "Deployment", desc: "Production deployment and training" },
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
      </section>

      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-16 text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            Ready to transform your operations?
          </h2>
          <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto">
            Let's build custom software that drives growth
          </p>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors"
            >
              Get Started Today
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
