'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Smartphone, Gauge, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

export default function WebsiteDevelopmentPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const services = [
    {
      icon: Globe,
      title: "Corporate Websites",
      description: "Professional web presence that converts visitors into customers",
      features: ["Custom design", "SEO optimized", "CMS integration", "Analytics setup"]
    },
    {
      icon: Gauge,
      title: "Web Applications",
      description: "Full-featured applications that scale with your business",
      features: ["React/Next.js", "Real-time features", "API integration", "Cloud deployment"]
    },
    {
      icon: Smartphone,
      title: "E-Commerce Solutions",
      description: "Online stores that drive revenue and delight customers",
      features: ["Payment processing", "Inventory management", "Mobile-first", "Conversion optimized"]
    }
  ]

  const techStack = [
    "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", 
    "PostgreSQL", "MongoDB", "AWS", "Vercel", "Stripe", "Shopify", "WordPress"
  ]

  const stats = [
    { number: "50ms", label: "Average Load Time" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "100%", label: "Mobile Responsive" },
    { number: "A+", label: "Security Rating" }
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
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-6">
            Custom Websites That Work
            <br />
            <span className="text-3xl md:text-5xl text-white">As Hard As You Do</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            From stunning landing pages to complex web applications, we build digital experiences 
            that captivate users and drive results. Fast, secure, and built to scale with your unique needs.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-red-400">{stat.number}</div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-white"
        >
          Built for <span className="text-red-400">Every Need</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                hoveredCard === index 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-red-400 shadow-2xl shadow-red-400/20' 
                  : 'bg-gray-900/50 border-gray-800'
              }`}
            >
              <service.icon className={`w-12 h-12 mb-6 transition-colors ${
                hoveredCard === index ? 'text-red-400' : 'text-gray-400'
              }`} />
              <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-gray-400 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12"
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            From Concept to <span className="text-red-400">Launch in Weeks</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", desc: "Understanding your goals and users" },
              { step: "02", title: "Design", desc: "Creating stunning, intuitive interfaces" },
              { step: "03", title: "Development", desc: "Building with cutting-edge tech" },
              { step: "04", title: "Launch", desc: "Deployment, monitoring & support" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-red-400 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-8 text-white">
            Powered by <span className="text-red-400">Modern Technology</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            We use the latest frameworks and tools to ensure your website is fast, 
            secure, and ready for the future.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-3 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing Tiers */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">
          Transparent <span className="text-red-400">Pricing</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: "$2,500",
              description: "Perfect for small businesses",
              features: ["5-page website", "Mobile responsive", "Basic SEO", "Contact forms", "1 month support"]
            },
            {
              name: "Professional",
              price: "$7,500",
              description: "For growing companies",
              features: ["15-page website", "Custom animations", "Advanced SEO", "CMS integration", "3 months support", "Analytics dashboard"],
              popular: true
            },
            {
              name: "Enterprise",
              price: "Custom",
              description: "Complex web applications",
              features: ["Unlimited pages", "Custom features", "API development", "Cloud infrastructure", "12 months support", "Performance optimization", "Security audit"]
            }
          ].map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                tier.popular 
                  ? 'bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-400' 
                  : 'bg-gray-900/50 border-gray-800'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-red-400 text-black text-sm font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="text-4xl font-bold text-red-400 mb-2">{tier.price}</div>
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
                    ? 'bg-red-400 text-white hover:bg-red-300'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}>
                  Get Started
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
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and see how we can transform your vision into reality.
          </p>
          <Link href="/contact">
            <button className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
