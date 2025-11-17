'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, Server, Terminal, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProductsPage() {
  const products = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Professional websites and web applications that drive results",
      href: "/products/web-development",
      features: ["Custom Design", "SEO Optimized", "Mobile Responsive", "Fast Performance"],
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-900/20 to-blue-900/20",
      borderColor: "border-cyan-500/50"
    },
    {
      icon: Server,
      title: "Software & Internal Tools",
      description: "Enterprise solutions that transform your operations",
      href: "/products/software-tools",
      features: ["Custom CRM", "API Integration", "Data Analytics", "Cloud Infrastructure"],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-900/20 to-pink-900/20",
      borderColor: "border-purple-500/50"
    },
    {
      icon: Terminal,
      title: "Scripts & Automations",
      description: "Quick solutions for repetitive tasks and workflows",
      href: "/products/scripts-automation",
      features: ["Fast Delivery", "Fixed Pricing", "Web Scraping", "Task Automation"],
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-900/20 to-emerald-900/20",
      borderColor: "border-green-500/50"
    },
    {
      icon: Sparkles,
      title: "AI Automations",
      description: "Custom AI solutions tailored to your business needs",
      href: "/products/ai-automations",
      features: ["Custom Models", "Smart Integrations", "Workflow AI", "Data Processing"],
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-900/20 to-orange-900/20",
      borderColor: "border-red-500/50"
    }
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
          <h1 className="font-mono text-4xl font-thin text-white md:text-6xl lg:text-7xl">
            Our{' '}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-subtle-gray max-w-3xl mx-auto">
            From stunning websites to enterprise software and AI-powered automations, we build custom solutions that transform your business. Choose the service that fits your needs.
          </p>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={product.href}>
                <Card className="group bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-accent/20">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                      <product.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl text-white group-hover:text-accent transition-colors">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="text-subtle-gray group-hover:text-white/80 transition-colors text-lg">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-subtle-gray group-hover:text-white transition-colors">
                      <span className="font-semibold mr-2">Learn More</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">
            Why Choose <span className="text-accent">Barr Automations</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { number: "01", title: "Custom Solutions", desc: "Every project is tailored to your specific needs and goals" },
            { number: "02", title: "Fast Delivery", desc: "We work efficiently to get your solution deployed quickly" },
            { number: "03", title: "Ongoing Support", desc: "We're here to help even after your project launches" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-6xl font-bold text-accent/20 font-mono mb-4">{item.number}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-subtle-gray">{item.desc}</p>
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
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and find the perfect solution for your needs
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-black hover:bg-gray-100">
            <Link href="/contact">
              Contact Us Today <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  )
}
