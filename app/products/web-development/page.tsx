'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, Smartphone, Gauge, ShoppingCart, Warehouse, Check, Code2, Palette, Zap } from 'lucide-react'

export default function WebDevelopmentPage() {
  const browserMockups = [
    { title: 'E-Commerce', color: 'from-red-500/20 to-orange-500/20', delay: 0 },
    { title: 'Dashboard', color: 'from-red-500/20 to-pink-500/20', delay: 0.2 },
    { title: 'Landing Page', color: 'from-red-500/20 to-purple-500/20', delay: 0.4 }
  ]

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
      <section className="relative container mx-auto px-4 pt-32 pb-20 overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-6xl mx-auto mb-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="text-xs font-semibold bg-red-500/10 text-red-400 px-4 py-2 rounded-full border border-red-500/20">
                Web Development Excellence
              </span>
            </motion.div>

            {/* Main Heading with gradient glow */}
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-none">
              Beautiful websites.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600" style={{
                textShadow: '0 0 80px rgba(239, 68, 68, 0.5)'
              }}>
                Built for results.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto mb-10">
              Custom web applications and stunning websites that combine exceptional design with powerful functionality
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative bg-white text-black px-8 py-4 rounded-full text-base font-semibold overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                >
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">Start Your Project</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>
              <Link href="/demos">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/10 hover:border-red-500/30 transition-all"
                >
                  View Our Work
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* Main featured browser mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              {/* Browser window */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-black/40 border-b border-white/10 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="bg-black/40 rounded-lg px-4 py-1.5 text-xs text-white/60 border border-white/10 max-w-md w-full">
                      your-business.com
                    </div>
                  </div>
                </div>

                {/* Browser content - visual showcase */}
                <div className="relative bg-gradient-to-br from-black via-gray-900 to-black p-8 md:p-12 min-h-[400px]">
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }} />

                  {/* Animated floating cards showcasing design elements */}
                  <div className="relative grid md:grid-cols-3 gap-6">
                    {/* Design card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all group"
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Palette className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Stunning Design</h3>
                      <p className="text-white/60 text-sm">Pixel-perfect interfaces that captivate users</p>
                      <div className="mt-4 flex gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-red-400 to-red-600" />
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-red-500" />
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-pink-400 to-red-500" />
                      </div>
                    </motion.div>

                    {/* Performance card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all group"
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
                      <p className="text-white/60 text-sm">Optimized for speed and performance</p>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-white/40 mb-2">
                          <span>Load Time</span>
                          <span>0.8s</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '95%' }}
                            transition={{ delay: 1, duration: 1 }}
                            className="h-full bg-gradient-to-r from-red-500 to-red-400"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Code quality card */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-gradient-to-br from-red-500/10 to-purple-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all group"
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Code2 className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Clean Code</h3>
                      <p className="text-white/60 text-sm">Built with best practices and standards</p>
                      <div className="mt-4 bg-black/40 rounded-lg p-3 font-mono text-xs text-green-400">
                        <div className="text-red-400">{'<YourBusiness />'}</div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Floating decorative elements */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl backdrop-blur-sm border border-red-500/30"
                  />
                  <motion.div
                    animate={{
                      y: [0, 10, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full backdrop-blur-sm border border-pink-500/30"
                  />
                </div>
              </div>
            </motion.div>

            {/* Feature pills floating around */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -left-4 top-1/4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 shadow-xl hidden md:block"
            >
              <p className="text-sm text-white font-semibold">Responsive Design</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute -right-4 top-1/3 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 shadow-xl hidden md:block"
            >
              <p className="text-sm text-white font-semibold">SEO Optimized</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              className="absolute left-1/4 -bottom-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 shadow-xl hidden md:block"
            >
              <p className="text-sm text-white font-semibold">Modern Stack</p>
            </motion.div>
          </div>
        </div>
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
                <p className="text-white/75 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                
                <p className="text-red-medium font-semibold text-sm mb-6">{service.stat}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-white/85">
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
          <p className="text-xl text-white/75 leading-relaxed max-w-2xl mx-auto">
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
                <p className="text-white/75 text-sm leading-relaxed mb-6">
                  {pkg.description}
                </p>
                <div className="space-y-1">
                  <div className="text-4xl font-semibold text-red-medium">{pkg.basePrice}</div>
                  <div className="text-sm text-white/60">{pkg.monthlyPrice}</div>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-white/85">
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
          <p className="text-xl text-white/75 mb-10 leading-relaxed max-w-2xl mx-auto">
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
