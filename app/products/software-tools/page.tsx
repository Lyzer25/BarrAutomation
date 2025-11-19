'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Server, Database, Workflow, Shield, BarChart3, ArrowRight, Check, Zap, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SoftwareToolingPage() {
  const [activeTab, setActiveTab] = useState(0)

  const solutions = [
    {
      icon: Workflow,
      title: "Process Automation",
      description: "Eliminate repetitive tasks and streamline workflows",
      stats: "75% time saved",
      color: "red"
    },
    {
      icon: Database,
      title: "Data Integration",
      description: "Connect all your systems and unify your data",
      stats: "100+ integrations",
      color: "red"
    },
    {
      icon: BarChart3,
      title: "Custom Dashboards",
      description: "Real-time insights tailored to your business",
      stats: "Real-time updates",
      color: "red"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security for your internal tools",
      stats: "SOC2 compliant",
      color: "red"
    }
  ]

  const caseStudies = [
    {
      industry: "Healthcare Platform Example",
      challenge: "Need for HIPAA compliance and real-time scheduling",
      solution: "Custom patient management system with HIPAA compliance and real-time scheduling",
      results: ["Target 99.9% uptime", "Enhanced patient care", "Efficient scheduling"]
    },
    {
      industry: "Warehouse Management Example",
      challenge: "Disconnected inventory across multiple locations",
      solution: "Real-time inventory tracking with automated reordering and multi-location sync",
      results: ["Reduce inventory costs", "Prevent stockouts", "Improve efficiency"]
    },
    {
      industry: "Financial Services Example",
      challenge: "Manual compliance reporting taking weeks",
      solution: "Automated compliance reporting dashboard with audit trails and real-time alerts",
      results: ["Reduce reporting time", "Ensure compliance", "Audit-ready 24/7"]
    }
  ]

  const capabilities = [
    "Custom CRM Systems", "ERP Integration", "API Development", "Microservices",
    "Cloud Migration", "DevOps Pipelines", "Data Analytics", "Machine Learning",
    "IoT Solutions", "Blockchain", "Real-time Systems", "Legacy Modernization"
  ]

  return (
    <div className="min-h-screen bg-black">
      <section className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1 className="font-sans text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
            Software & Internal Tools
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
            Custom software solutions tailored to your exact business needs
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors"
              >
                Schedule Consultation
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
              { value: "Custom", label: "Built For You" },
              { value: "75%+", label: "Time Savings" },
              { value: "99.9%", label: "Uptime Target" },
              { value: "24/7", label: "Support Available" }
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
              <Card className="group bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-accent/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-dark/20 border border-red-dark/30 rounded-xl flex items-center justify-center mb-4">
                    <solution.icon className="w-6 h-6 text-red-medium" />
                  </div>
                  <CardTitle className="text-white group-hover:text-accent transition-colors">
                    {solution.title}
                  </CardTitle>
                  <CardDescription className="text-subtle-gray group-hover:text-white/80 transition-colors">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-bold text-accent">{solution.stats}</p>
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
            <Card className="bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full">
              <CardHeader>
                <div className="text-xs font-mono bg-accent/20 text-accent px-3 py-1 rounded w-fit mb-4">
                  SMALL TOOL
                </div>
                <CardTitle className="text-white text-3xl">
                  <span className="text-4xl font-bold">$2,500</span>
                  <span className="text-subtle-gray text-lg ml-2">- $7,500</span>
                </CardTitle>
                <CardDescription className="text-accent font-mono text-sm">
                  + $50-$150/month hosting & support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-subtle-gray text-sm">
                  Perfect for single-purpose tools and simple internal applications
                </p>
                
                <ul className="space-y-3">
                  {[
                    "Custom dashboards",
                    "Data entry forms",
                    "Simple CRM systems",
                    "Reporting tools",
                    "Basic API integrations",
                    "User authentication",
                    "Database setup",
                    "Mobile responsive design",
                    "Basic support included"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors w-full mt-8"
                  >
                    Discuss This Package
                  </motion.button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Medium Platform Package */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-b from-accent/10 to-black/80 backdrop-blur-sm border-2 border-accent hover:border-accent/80 transition-all duration-500 h-full relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-black px-4 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
              <CardHeader>
                <div className="text-xs font-mono bg-accent/20 text-accent px-3 py-1 rounded w-fit mb-4">
                  MEDIUM PLATFORM
                </div>
                <CardTitle className="text-white text-3xl">
                  <span className="text-4xl font-bold">$10,000</span>
                  <span className="text-subtle-gray text-lg ml-2">- $25,000</span>
                </CardTitle>
                <CardDescription className="text-accent font-mono text-sm">
                  + $200-$400/month hosting & support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-subtle-gray text-sm">
                  Comprehensive solutions with multiple integrated features and workflows
                </p>
                
                <ul className="space-y-3">
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
                    "Priority support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-white/80 font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors w-full mt-8"
                  >
                    Discuss This Package
                  </motion.button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enterprise Solution Package */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full">
              <CardHeader>
                <div className="text-xs font-mono bg-accent/20 text-accent px-3 py-1 rounded w-fit mb-4">
                  ENTERPRISE SOLUTION
                </div>
                <CardTitle className="text-white text-3xl">
                  <span className="text-4xl font-bold">$25,000+</span>
                </CardTitle>
                <CardDescription className="text-accent font-mono text-sm">
                  Custom pricing per project scope
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-subtle-gray text-sm">
                  Full-scale enterprise systems with unlimited complexity and customization
                </p>
                
                <ul className="space-y-3">
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
                    "Ongoing development & updates"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors w-full mt-8"
                  >
                    Discuss This Package
                  </motion.button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Revenue Share Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-red-dark/20 to-red-deep/20 backdrop-blur-sm border-2 border-accent/50">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
                <CardTitle className="text-white text-2xl">Partnership & Revenue Share</CardTitle>
              </div>
              <CardDescription className="text-white/80 text-base">
                Have a great idea but limited funding? We can work out flexible payment structures.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="text-accent font-bold mb-2">Flexible Options:</h4>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      Reduced upfront costs
                    </li>
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      Revenue share agreements
                    </li>
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      Deferred payment plans
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-accent font-bold mb-2">What You Get:</h4>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      Full custom development
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      Ongoing feature support
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      True partnership approach
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-4">
                All terms are negotiated on a per-deal basis based on project scope and business model. Let's discuss what works for you.
              </p>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors w-full mt-8"
                >
                  Discuss Your Project
                </motion.button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
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
                    <CardDescription className="text-subtle-gray">
                      {study.challenge}
                    </CardDescription>
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
          <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
            A proven methodology that ensures on-time delivery
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { number: "01", title: "Discovery", desc: "Deep dive into requirements and system design" },
            { number: "02", title: "Prototyping", desc: "Build MVP to validate approach" },
            { number: "03", title: "Development", desc: "Custom solution with continuous updates" },
            { number: "04", title: "Deployment", desc: "Production deployment and training" }
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
