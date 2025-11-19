"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Globe,
  Smartphone,
  Gauge,
  ShoppingCart,
  Warehouse,
  Check,
  Package,
  DollarSign,
  CreditCard,
  Mail,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function WebDevelopmentPage() {
  const [activeDashboard, setActiveDashboard] = useState(0)

  const dashboards = [
    {
      title: "Analytics Dashboard",
      subtitle: "Real-time business metrics",
      type: "analytics",
      graphs: [
        { label: "Jan", value: 45 },
        { label: "Feb", value: 52 },
        { label: "Mar", value: 48 },
        { label: "Apr", value: 65 },
        { label: "May", value: 72 },
        { label: "Jun", value: 85 },
      ],
      stats: [
        { label: "Revenue", value: "$127,420", change: "+24%", color: "green" },
        { label: "Orders", value: "3,847", change: "+12%", color: "blue" },
        { label: "Conversion", value: "3.2%", change: "+0.8%", color: "purple" },
      ],
    },
    {
      title: "E-Commerce Store",
      subtitle: "Product showcase",
      type: "ecommerce",
      products: [
        { name: "Premium Headphones", price: "$299", image: "🎧", rating: 4.8, sales: 234 },
        { name: "Smart Watch Pro", price: "$449", image: "⌚", rating: 4.9, sales: 189 },
        { name: "Wireless Earbuds", price: "$159", image: "🎵", rating: 4.7, sales: 456 },
      ],
    },
    {
      title: "Admin Dashboard",
      subtitle: "Team management portal",
      type: "admin",
      team: [
        { name: "Sarah Chen", role: "Admin", avatar: "👩‍💼", status: "online", tasks: 24 },
        { name: "Mike Johnson", role: "Manager", avatar: "👨‍💻", status: "away", tasks: 18 },
        { name: "Emily Davis", role: "Support", avatar: "👩‍💻", status: "online", tasks: 31 },
      ],
    },
    {
      title: "Customer Portal",
      subtitle: "Account management",
      type: "customer",
      account: {
        name: "John Smith",
        email: "john@company.com",
        plan: "Business Pro",
        usage: 68,
        renewDate: "Dec 15, 2024",
      },
    },
    {
      title: "Inventory System",
      subtitle: "Stock tracking",
      type: "inventory",
      items: [
        { name: "Product A", stock: 847, status: "In Stock", trend: "up" },
        { name: "Product B", stock: 34, status: "Low Stock", trend: "down" },
        { name: "Product C", stock: 0, status: "Out of Stock", trend: "flat" },
      ],
    },
    {
      title: "Payment Processing",
      subtitle: "Transaction overview",
      type: "payments",
      transactions: [
        { id: "#TXN-4829", amount: "$1,245", status: "Completed", method: "Credit Card" },
        { id: "#TXN-4828", amount: "$892", status: "Pending", method: "PayPal" },
        { id: "#TXN-4827", amount: "$2,150", status: "Completed", method: "Bank Transfer" },
      ],
    },
  ]

  // Auto-scroll through dashboards
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDashboard((prev) => (prev + 1) % dashboards.length)
    }, 5000) // Increased to 5s for more complex views
    return () => clearInterval(interval)
  }, [])

  const browserMockups = [
    { title: "E-Commerce", color: "from-red-500/20 to-orange-500/20", delay: 0 },
    { title: "Dashboard", color: "from-red-500/20 to-pink-500/20", delay: 0.2 },
    { title: "Landing Page", color: "from-red-500/20 to-purple-500/20", delay: 0.4 },
  ]

  const services = [
    {
      icon: Globe,
      title: "Custom Web Applications",
      description: "Full-stack web apps built with modern frameworks like Next.js, React, and Node.js",
      features: ["Responsive Design", "Cloud Deployment", "API Integration", "Real-time Features"],
      badge: "Web Apps",
      stat: "Modern Stack",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Beautiful, fast websites optimized for every device and screen size",
      features: ["Progressive Web Apps", "Touch-Optimized", "Offline Support", "App-Like Experience"],
      badge: "Mobile",
      stat: "100% Responsive",
    },
    {
      icon: Gauge,
      title: "Performance Optimization",
      description: "Lightning-fast load times and seamless user experiences that convert",
      features: ["Core Web Vitals", "SEO Optimized", "CDN Integration", "Image Optimization"],
      badge: "Performance",
      stat: "<1s Load Time",
    },
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
        "Social media links",
      ],
      upgrade: {
        title: "Reservation System Upgrade",
        price: "$1,000 + $100/month",
        features: ["Online booking system", "Calendar integration", "Email notifications", "Customer management"],
      },
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
        "Analytics & reporting",
      ],
      alternative: {
        title: "Revenue Share Model",
        price: "$500 upfront + $20/month",
        note: "Plus royalties on sales (pricing negotiated per deal)",
        features: ["Lower upfront cost", "We share your success", "Custom terms available"],
      },
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
        "End-to-end business automation",
      ],
      note: "Tailored solutions combining all our custom development capabilities. Pricing varies based on your specific needs and complexity.",
    },
  ]

  const processSteps = [
    {
      number: "01",
      title: "Discovery & Planning",
      desc: "We learn your business goals and map out the perfect solution",
    },
    {
      number: "02",
      title: "Design & Prototype",
      desc: "Custom designs tailored to your brand and tested with real users",
    },
    {
      number: "03",
      title: "Development & Testing",
      desc: "Clean code, rigorous testing, and continuous communication",
    },
    { number: "04", title: "Launch & Support", desc: "Smooth deployment with ongoing maintenance and updates" },
  ]

  return (
    <div className="min-h-screen bg-black">
      <section className="relative container mx-auto px-4 pt-32 pb-20 overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
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
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600"
                style={{
                  textShadow: "0 0 80px rgba(239, 68, 68, 0.5)",
                }}
              >
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
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                    Start Your Project
                  </span>
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
                      your-business.com/admin
                    </div>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 md:p-12 min-h-[500px] overflow-hidden">
                  {/* Grid pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />

                  {/* Dashboard content with smooth transitions */}
                  <div className="relative">
                    <motion.div
                      key={`dashboard-${activeDashboard}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      {/* Dashboard header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{dashboards[activeDashboard].title}</h3>
                          <p className="text-white/50 text-sm">{dashboards[activeDashboard].subtitle}</p>
                        </div>
                        <div className="flex gap-2">
                          {dashboards.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveDashboard(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === activeDashboard ? "bg-red-500 w-6" : "bg-white/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Analytics Dashboard with Bar Chart */}
                      {activeDashboard === 0 && (
                        <div className="space-y-4">
                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-3 mb-6">
                            {dashboards[0].stats.map((stat, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
                              >
                                <p className="text-white/50 text-xs mb-1">{stat.label}</p>
                                <p className="text-white font-bold text-xl mb-1">{stat.value}</p>
                                <p
                                  className={`text-xs font-semibold ${
                                    stat.color === "green"
                                      ? "text-green-400"
                                      : stat.color === "blue"
                                        ? "text-blue-400"
                                        : "text-purple-400"
                                  }`}
                                >
                                  {stat.change}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                          {/* Bar Chart */}
                          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                            <p className="text-white/70 text-sm mb-4">Revenue Trend</p>
                            <div className="flex items-end justify-between h-40 gap-2">
                              {dashboards[0].graphs.map((point, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${point.value}%` }}
                                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                                  className="flex-1 bg-gradient-to-t from-red-500 to-orange-400 rounded-t relative group"
                                >
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                                    ${point.value}k
                                  </div>
                                  <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs">
                                    {point.label}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* E-Commerce Store View */}
                      {activeDashboard === 1 && (
                        <div className="grid grid-cols-3 gap-4">
                          {dashboards[1].products.map((product, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-red-500/30 transition-all cursor-pointer"
                            >
                              <div className="text-5xl mb-3 text-center">{product.image}</div>
                              <p className="text-white font-semibold text-sm mb-1">{product.name}</p>
                              <p className="text-red-400 font-bold text-lg mb-2">{product.price}</p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-yellow-400">★ {product.rating}</span>
                                <span className="text-white/50">{product.sales} sold</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Admin Portal View */}
                      {activeDashboard === 2 && (
                        <div className="space-y-3">
                          {dashboards[2].team.map((member, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-red-500/30 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="text-4xl">{member.avatar}</div>
                                  <div>
                                    <p className="text-white font-semibold">{member.name}</p>
                                    <p className="text-white/50 text-xs">{member.role}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      member.status === "online"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-yellow-500/20 text-yellow-400"
                                    }`}
                                  >
                                    {member.status}
                                  </span>
                                  <p className="text-white/50 text-xs mt-2">{member.tasks} tasks</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Customer Portal View */}
                      {activeDashboard === 3 && (
                        <div className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg p-6"
                          >
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-2xl">
                                👤
                              </div>
                              <div>
                                <p className="text-white font-bold text-lg">{dashboards[3].account.name}</p>
                                <p className="text-white/50 text-sm">{dashboards[3].account.email}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-white/50 text-xs mb-1">Current Plan</p>
                                <p className="text-white font-semibold">{dashboards[3].account.plan}</p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-white/50 text-xs mb-1">Renewal Date</p>
                                <p className="text-white font-semibold">{dashboards[3].account.renewDate}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-white/70">Storage Used</span>
                                <span className="text-white font-semibold">{dashboards[3].account.usage}%</span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${dashboards[3].account.usage}%` }}
                                  transition={{ delay: 0.3, duration: 0.8 }}
                                  className="bg-gradient-to-r from-red-500 to-orange-400 h-2 rounded-full"
                                />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}

                      {/* Inventory System View */}
                      {activeDashboard === 4 && (
                        <div className="space-y-3">
                          {dashboards[4].items.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-red-500/30 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-white font-semibold">{item.name}</p>
                                    <p className="text-white/50 text-xs">Stock: {item.stock} units</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      item.status === "In Stock"
                                        ? "bg-green-500/20 text-green-400"
                                        : item.status === "Low Stock"
                                          ? "bg-yellow-500/20 text-yellow-400"
                                          : "bg-red-500/20 text-red-400"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                  <p className="text-white/50 text-xs mt-2">
                                    {item.trend === "up" ? "↗" : item.trend === "down" ? "↘" : "→"} Trend
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Payment Processing View */}
                      {activeDashboard === 5 && (
                        <div className="space-y-3">
                          {dashboards[5].transactions.map((txn, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-red-500/30 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                                    {txn.method === "Credit Card" ? (
                                      <CreditCard className="w-6 h-6 text-green-400" />
                                    ) : txn.method === "PayPal" ? (
                                      <DollarSign className="w-6 h-6 text-blue-400" />
                                    ) : (
                                      <Mail className="w-6 h-6 text-purple-400" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-white font-semibold text-sm">{txn.id}</p>
                                    <p className="text-white/50 text-xs">{txn.method}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-bold text-lg">{txn.amount}</p>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      txn.status === "Completed"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-yellow-500/20 text-yellow-400"
                                    }`}
                                  >
                                    {txn.status}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
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
              { value: "100%", label: "Custom Solutions" },
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
                <h3 className="text-white text-2xl mb-2 tracking-tight">{service.title}</h3>
                <p className="text-white/75 text-sm leading-relaxed mb-4">{service.description}</p>

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
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">Solution Packages</h2>
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
                pkg.highlight ? "border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]" : "border-white/10"
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
                <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">{pkg.name}</h3>
                <p className="text-white/75 text-sm leading-relaxed mb-6">{pkg.description}</p>
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

              {pkg.note && <p className="text-xs text-white/50 italic mb-6">{pkg.note}</p>}

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
