'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, Server, Terminal, Sparkles, ArrowRight, Check } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 py-24 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Our </span>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            From stunning websites to enterprise software and AI-powered automations, 
            we build custom solutions that transform your business. Choose the service that fits your needs.
          </p>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className="px-6 py-12 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={product.href}>
                <div className={`group relative h-full p-8 rounded-2xl border bg-gradient-to-br ${product.bgGradient} hover:${product.borderColor} border-gray-800 transition-all duration-300 hover:shadow-2xl`}>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${product.gradient} p-4 mb-6`}>
                    <product.icon className="w-full h-full text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">{product.title}</h2>
                  <p className="text-gray-300 mb-6 text-lg">{product.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-400">
                        <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                    <span className="font-semibold mr-2">Learn More</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12"
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Why Choose <span className="text-red-500">Barr Automations</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Custom Solutions", desc: "Every project is tailored to your specific needs and goals" },
              { title: "Fast Delivery", desc: "We work efficiently to get your solution deployed quickly" },
              { title: "Ongoing Support", desc: "We're here to help even after your project launches" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and find the perfect solution for your needs.
          </p>
          <Link href="/contact">
            <button className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Contact Us Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
