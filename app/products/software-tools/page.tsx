'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Server, Database, Workflow, Shield, BarChart3, ArrowRight, Check, Zap } from 'lucide-react'
import Link from 'next/link'

export default function SoftwareToolingPage() {
  const [activeTab, setActiveTab] = useState(0)

  const solutions = [
    {
      icon: Workflow,
      title: "Process Automation",
      description: "Eliminate repetitive tasks and streamline workflows",
      stats: "75% time saved",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Database,
      title: "Data Integration",
      description: "Connect all your systems and unify your data",
      stats: "100+ integrations",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: BarChart3,
      title: "Custom Dashboards",
      description: "Real-time insights tailored to your business",
      stats: "Real-time updates",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security for your internal tools",
      stats: "SOC2 compliant",
      color: "from-red-500 to-orange-500"
    }
  ]

  const caseStudies = [
    {
      industry: "Mining Operations",
      challenge: "Manual monitoring of 500+ ASIC miners",
      solution: "Custom automated diagnostic system with predictive maintenance",
      results: ["90% reduction in downtime", "240% increase in efficiency", "$2M annual savings"]
    },
    {
      industry: "E-Commerce",
      challenge: "Disconnected inventory across 5 warehouses",
      solution: "Custom real-time sync system with automated reordering",
      results: ["Zero stockouts", "35% reduction in inventory costs", "3x faster fulfillment"]
    },
    {
      industry: "Financial Services",
      challenge: "Manual compliance reporting taking weeks",
      solution: "Custom automated reporting dashboard with audit trails",
      results: ["From 3 weeks to 30 minutes", "100% compliance rate", "Audit-ready 24/7"]
    }
  ]

  const capabilities = [
    "Custom CRM Systems", "ERP Integration", "API Development", "Microservices",
    "Cloud Migration", "DevOps Pipelines", "Data Analytics", "Machine Learning",
    "IoT Solutions", "Blockchain", "Real-time Systems", "Legacy Modernization"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative px-6 py-24 mx-auto max-w-7xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-red-900/30 border border-red-500/30 rounded-full text-red-400 text-sm font-semibold mb-8">
            <Zap className="w-4 h-4 mr-2" />
            CUSTOM SOFTWARE SOLUTIONS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Internal Tools That
            </span>
            <br />
            <span className="text-white">Transform Operations</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            From custom business software to enterprise automation systems, we build the tools 
            that power your business. Scalable, secure, and designed for your exact needs.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-red-500/25 transition-all">
                Schedule Consultation
              </button>
            </Link>
            <Link href="/demos">
              <button className="px-8 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-all">
                View Case Studies
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Solutions Grid */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16"
        >
          <span className="text-white">Solutions That </span>
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Scale With You</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-red-500/50 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${solution.color} p-3 mb-4`}>
                <solution.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{solution.title}</h3>
              <p className="text-gray-400 mb-4">{solution.description}</p>
              <div className="text-sm font-semibold text-red-400">{solution.stats}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            Proven Results Across Industries
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            See how we've helped businesses transform their operations with custom software solutions
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center flex-wrap space-x-4 mb-12">
            {caseStudies.map((study, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === index
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {study.industry}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">THE CHALLENGE</h4>
                <p className="text-gray-300">{caseStudies[activeTab].challenge}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">OUR SOLUTION</h4>
                <p className="text-gray-300">{caseStudies[activeTab].solution}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">THE RESULTS</h4>
                <ul className="space-y-2">
                  {caseStudies[activeTab].results.map((result, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Development Process */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            Our Development Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A proven methodology that ensures on-time delivery and exceeds expectations
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-red-500 to-orange-500 hidden md:block" />
          
          {[
            { phase: "Discovery & Architecture", time: "Week 1-2", desc: "Deep dive into requirements, system design, and technical planning" },
            { phase: "Rapid Prototyping", time: "Week 3-4", desc: "Build MVP to validate approach and gather feedback" },
            { phase: "Custom Development", time: "Week 5-12", desc: "Build your custom solution with continuous updates" },
            { phase: "Testing & Optimization", time: "Week 13-14", desc: "Comprehensive testing, performance optimization, security audits" },
            { phase: "Deployment & Training", time: "Week 15-16", desc: "Production deployment, team training, and documentation" }
          ].map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} justify-center mb-12`}
            >
              <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} text-center`}>
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                  <div className="text-red-400 font-semibold mb-2">{phase.time}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{phase.phase}</h3>
                  <p className="text-gray-400">{phase.desc}</p>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-4 border-black hidden md:block" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-3xl p-12 border border-red-500/20"
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Full-Stack Capabilities
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="px-5 py-2.5 bg-black/50 border border-red-500/30 rounded-full text-gray-300 hover:border-red-400 hover:text-red-400 transition-all"
              >
                {capability}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Investment Tiers */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">
          Investment <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Options</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Rapid MVP",
              timeline: "4-6 weeks",
              price: "$15,000",
              description: "Validate your idea fast",
              features: ["Core functionality", "Basic UI/UX", "Cloud deployment", "API integration", "Documentation"]
            },
            {
              name: "Full Platform",
              timeline: "3-4 months",
              price: "$45,000",
              description: "Production-ready solution",
              features: ["Complete feature set", "Custom design", "Advanced integrations", "Testing suite", "6-month support", "Training included"],
              popular: true
            },
            {
              name: "Enterprise",
              timeline: "6+ months",
              price: "Custom",
              description: "Complex system integration",
              features: ["Unlimited features", "Multi-tenant architecture", "24/7 support", "SLA guarantee", "Dedicated team", "Ongoing development"]
            }
          ].map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                tier.popular 
                  ? 'bg-gradient-to-br from-red-900/30 to-orange-900/30 border-2 border-red-500' 
                  : 'bg-gray-900/50 border border-gray-800'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-full">
                  RECOMMENDED
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="text-sm text-gray-400 mb-2">{tier.timeline}</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
                {tier.price}
              </div>
              <p className="text-gray-400 mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/25'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}>
                  Start Building
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-3xl p-12 text-center"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Let's Build Your Custom Solution
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of companies that have transformed their operations with our custom software solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <button className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Schedule Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="/demos">
                <button className="px-8 py-4 bg-black/30 text-white font-bold rounded-lg hover:bg-black/40 transition-colors border border-white/20">
                  View Our Work
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
