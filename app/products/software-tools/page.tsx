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
      industry: "SaaS Platform",
      challenge: "Need for scalable multi-tenant architecture",
      solution: "Custom SaaS platform with user management and billing",
      results: ["100+ active customers", "99.9% uptime", "$500K ARR in year 1"]
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
            <Server className="w-4 h-4" />
            Software & Internal Tools
          </div>
          
          <h1 className="font-mono text-4xl font-thin text-white md:text-6xl lg:text-7xl">
            Custom Software That{' '}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Powers Growth
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-subtle-gray max-w-3xl mx-auto">
            From custom CRMs to enterprise automation systems, we build the internal tools that transform your operations. Scalable, secure, and designed for your exact needs.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="animate-pulse-glow">
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demos">View Case Studies</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "100+", label: "Tools Delivered" },
              { value: "75%", label: "Time Saved" },
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Support" }
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
          {[
            { icon: Workflow, title: "Process Automation", desc: "Eliminate repetitive tasks and streamline workflows", stat: "75% time saved" },
            { icon: Database, title: "Data Integration", desc: "Connect all your systems and unify your data", stat: "100+ integrations" },
            { icon: BarChart3, title: "Custom Dashboards", desc: "Real-time insights tailored to your business", stat: "Real-time updates" },
            { icon: Shield, title: "Enterprise Security", desc: "Bank-grade security for your internal tools", stat: "SOC2 compliant" }
          ].map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-accent/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                    <solution.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white group-hover:text-accent transition-colors">
                    {solution.title}
                  </CardTitle>
                  <CardDescription className="text-subtle-gray group-hover:text-white/80 transition-colors">
                    {solution.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-bold text-accent">{solution.stat}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SaaS Pricing Packages Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">SaaS Development Packages</h2>
          <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
            Launch your software-as-a-service platform with our comprehensive development packages
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Starter SaaS Package */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
          >
            <Card className="bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full">
              <CardHeader>
                <div className="text-xs font-mono bg-accent/20 text-accent px-3 py-1 rounded w-fit mb-4">
                  STARTER SAAS
                </div>
                <CardTitle className="text-white text-3xl">
                  <span className="text-4xl font-bold">$5,000</span>
                  <span className="text-subtle-gray text-lg ml-2">upfront</span>
                </CardTitle>
                <CardDescription className="text-accent font-mono text-sm">
                  + $150/month hosting & support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-subtle-gray text-sm">
                  Perfect for MVPs and validating your SaaS idea with core functionality
                </p>
                
                <ul className="space-y-3">
                  {[
                    "User authentication & management",
                    "Subscription billing integration",
                    "Admin dashboard",
                    "Basic API endpoints",
                    "Database setup & hosting",
                    "SSL & domain configuration",
                    "Email notifications",
                    "Mobile responsive design"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full animate-pulse-glow">
                  <Link href="/contact">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Professional SaaS Package */}
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
                  PROFESSIONAL SAAS
                </div>
                <CardTitle className="text-white text-3xl">
                  <span className="text-4xl font-bold">$15,000</span>
                  <span className="text-subtle-gray text-lg ml-2">upfront</span>
                </CardTitle>
                <CardDescription className="text-accent font-mono text-sm">
                  + $300/month hosting & support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-subtle-gray text-sm">
                  Production-ready SaaS with advanced features and scalability built-in
                </p>
                
                <ul className="space-y-3">
                  {[
                    "Everything in Starter, plus:",
                    "Multi-tenant architecture",
                    "Advanced user roles & permissions",
                    "Custom integrations (Stripe, etc.)",
                    "Real-time features (WebSockets)",
                    "Analytics dashboard",
                    "Automated backups & monitoring",
                    "API rate limiting & caching",
                    "Custom reporting tools",
                    "Priority support & maintenance"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-white/80 font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full bg-accent hover:bg-accent/90">
                  <Link href="/contact">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enterprise SaaS Package */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full">
              <CardHeader>
                <div className="text-xs font-mono bg-accent/20 text-accent px-3 py-1 rounded w-fit mb-4">
                  ENTERPRISE SAAS
                </div>
                <CardTitle className="text-white text-3xl">
                  <span className="text-4xl font-bold">Custom</span>
                </CardTitle>
                <CardDescription className="text-accent font-mono text-sm">
                  Pricing based on scope
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-subtle-gray text-sm">
                  Enterprise-grade solutions with unlimited customization and dedicated support
                </p>
                
                <ul className="space-y-3">
                  {[
                    "Everything in Professional, plus:",
                    "White-label solutions",
                    "Custom workflow automation",
                    "Advanced security (SSO, 2FA)",
                    "Microservices architecture",
                    "Load balancing & auto-scaling",
                    "Dedicated infrastructure",
                    "24/7 premium support",
                    "SLA guarantees",
                    "Ongoing feature development"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
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
          <Card className="bg-gradient-to-r from-accent/20 to-orange-500/20 backdrop-blur-sm border-2 border-accent/50">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
                <CardTitle className="text-white text-2xl">Revenue Share Partnership</CardTitle>
              </div>
              <CardDescription className="text-white/80 text-base">
                Limited funding? We believe in your vision. Let's grow together.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="text-accent font-bold mb-2">What You Pay:</h4>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      Minimal upfront costs
                    </li>
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      Monthly hosting fee
                    </li>
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      Revenue share on your success
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-accent font-bold mb-2">What You Get:</h4>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      Full SaaS platform development
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      Ongoing feature development
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      Dedicated partnership support
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-4">
                Revenue share terms are negotiated on a per-deal basis. Contact us to discuss your project.
              </p>
              <Button asChild size="lg" className="animate-pulse-glow">
                <Link href="/contact">Discuss Partnership</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Proven Results */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Proven Results</h2>
            <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
              See how custom software has transformed businesses across industries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                industry: "SaaS Platform",
                result: "99.9% uptime achieved",
                description: "Scalable multi-tenant architecture with user management and billing"
              },
              {
                industry: "E-Commerce",
                result: "35% reduction in costs",
                description: "Real-time inventory sync across 5 warehouses with automated reordering"
              },
              {
                industry: "Financial Services",
                result: "From 3 weeks to 30 minutes",
                description: "Automated compliance reporting dashboard with audit trails"
              }
            ].map((study, index) => (
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
                    <CardTitle className="text-white text-2xl">{study.result}</CardTitle>
                    <CardDescription className="text-subtle-gray">
                      {study.description}
                    </CardDescription>
                  </CardHeader>
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let's build the custom software solution that takes your business to the next level
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-black hover:bg-gray-100">
            <Link href="/contact">
              Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  )
}
