'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, Smartphone, Gauge, ShoppingCart, Warehouse, Check } from 'lucide-react'

export default function WebDevelopmentPage() {
  const services = [
    {
      icon: Globe,
      title: "Custom Web Applications",
      description: "Full-stack web apps built with modern frameworks like Next.js, React, and Node.js",
      features: ["Responsive Design", "Cloud Deployment", "API Integration", "Real-time Features"],
      badge: "Web Apps",
      stat: "Modern Stack"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Beautiful, fast websites optimized for every device and screen size",
      features: ["Progressive Web Apps", "Touch-Optimized", "Offline Support", "App-Like Experience"],
      badge: "Mobile",
      stat: "100% Responsive"
    },
    {
      icon: Gauge,
      title: "Performance Optimization",
      description: "Lightning-fast load times and seamless user experiences that convert",
      features: ["Core Web Vitals", "SEO Optimized", "CDN Integration", "Image Optimization"],
      badge: "Performance",
      stat: "<1s Load Time"
    }
  ]

  const packages = [
    {
      icon: Globe,
      name: "Business Website",
      description: "Perfect for restaurants, local businesses, and informational sites",
      basePrice: "$750",
      monthlyPrice: "$20/month",
      badge: "Small Business",
      badgeColor: "bg-red-dark/20 text-red-light border-red-dark/30",
      features: [
        "Up to 5 custom pages",
        "Contact form integration",
        "Mobile-responsive design",
        "SEO optimization",
        "Google Maps integration",
        "Social media links"
      ],
      upgrade: {
        title: "Reservation System Upgrade",
        price: "$1,000 + $100/month",
        features: ["Online booking system", "Calendar integration", "Email notifications", "Customer management"]
      }
    },
    {
      icon: ShoppingCart,
      name: "E-Commerce Platform",
      description: "Full-featured online store with product and order management",
      basePrice: "$2,500",
      monthlyPrice: "$100/month",
      badge: "Most Popular",
      badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
      highlight: true,
      features: [
        "Product catalog & inventory",
        "Shopping cart & checkout",
        "Payment processing integration",
        "Order management dashboard",
        "Customer accounts",
        "Analytics & reporting"
      ],
      alternative: {
        title: "Revenue Share Model",
        price: "$500 upfront + $20/month",
        note: "Plus royalties on sales (pricing negotiated per deal)",
        features: ["Lower upfront cost", "We share your success", "Custom terms available"]
      }
    },
    {
      icon: Warehouse,
      name: "Enterprise Management",
      description: "Complete business solution with inventory, warehouse, and multi-site management",
      basePrice: "Custom Pricing",
      monthlyPrice: "Per Deal Basis",
      badge: "Enterprise",
      badgeColor: "bg-red-dark/20 text-red-light border-red-dark/30",
      features: [
        "Warehouse management system",
        "Inventory tracking & forecasting",
        "Internal employee portal",
        "Public-facing website",
        "Custom integrations",
        "End-to-end business automation"
      ],
      note: "Tailored solutions combining all our custom development capabilities. Pricing varies based on your specific needs and complexity."
    }
  ]

  const processSteps = [
    { number: "01", title: "Discovery & Planning", desc: "We learn your business goals and map out the perfect solution" },
    { number: "02", title: "Design & Prototype", desc: "Custom designs tailored to your brand and tested with real users" },
    { number: "03", title: "Development & Testing", desc: "Clean code, rigorous testing, and continuous communication" },
    { number: "04", title: "Launch & Support", desc: "Smooth deployment with ongoing maintenance and updates" }
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
            Web Development
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
            Custom websites and web applications built from scratch to drive real results for your business
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors"
              >
                Start Your Project
              </motion.button>
            </Link>
            <Link href="/demos">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/15 transition-colors"
              >
                View Our Work
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
              { value: "Fast", label: "Development Speed" },
              { value: "99.9%", label: "Uptime Guarantee" },
              { value: "<1s", label: "Page Load Time" },
              { value: "100%", label: "Custom Solutions" }
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

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">What We Build</h2>
          <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
            Every solution is custom-built from scratch to match your exact requirements
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group bg-[#0A0A0A] backdrop-blur-sm border border-white/10 hover:border-red-medium/30 transition-all duration-500 h-full p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold bg-red-dark/20 text-red-light px-3 py-1 rounded-full border border-red-dark/30">
                    {service.badge}
                  </span>
                </div>
                
                <div className="w-12 h-12 bg-red-dark/20 border border-red-dark/30 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-red-medium" />
                </div>
                <h3 className="text-white text-2xl mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                
                <p className="text-red-medium font-semibold text-sm mb-6">{service.stat}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-white/80">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            Solution Packages
          </h2>
          <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
            Flexible pricing options designed to fit your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-[#0A0A0A] border rounded-3xl p-8 ${
                pkg.highlight 
                  ? 'border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${pkg.badgeColor}`}>
                  {pkg.badge}
                </span>
              </div>

              <div className="mb-8">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  <pkg.icon className="w-6 h-6 text-white/90" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                  {pkg.name}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {pkg.description}
                </p>
                <div className="space-y-1">
                  <div className="text-4xl font-semibold text-red-medium">{pkg.basePrice}</div>
                  <div className="text-sm text-white/60">{pkg.monthlyPrice}</div>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-white/80">
                    <Check className="w-5 h-5 text-white/60 mr-3 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {pkg.upgrade && (
                <div className="pt-6 border-t border-white/10 mb-6">
                  <div className="text-sm font-semibold text-white mb-2">{pkg.upgrade.title}</div>
                  <div className="text-lg font-semibold text-red-medium mb-3">{pkg.upgrade.price}</div>
                  <ul className="space-y-2">
                    {pkg.upgrade.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-xs text-white/70">
                        <Check className="w-4 h-4 text-white/60 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.alternative && (
                <div className="pt-6 border-t border-white/10 mb-6">
                  <div className="text-sm font-semibold text-white mb-2">{pkg.alternative.title}</div>
                  <div className="text-lg font-semibold text-red-medium mb-1">{pkg.alternative.price}</div>
                  <div className="text-xs text-white/50 mb-3">{pkg.alternative.note}</div>
                  <ul className="space-y-2">
                    {pkg.alternative.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-xs text-white/70">
                        <Check className="w-4 h-4 text-white/60 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.note && (
                <p className="text-xs text-white/50 italic mb-6">{pkg.note}</p>
              )}

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
                >
                  Discuss This Package
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Our Process</h2>
            <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
              Transparent, collaborative, and designed for success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-accent/20 font-mono mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-subtle-gray">{step.desc}</p>
              </motion.div>
            ))}
          </div>
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
            Ready to build something amazing?
          </h2>
          <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto">
            Let's turn your vision into a powerful web application
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
