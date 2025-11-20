"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Globe, Server, Terminal, Sparkles, ArrowRight, Code2, Zap, Brain, Layers } from "lucide-react"

export default function ProductsPage() {
  const products = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Beautiful, responsive websites and web applications built for results and user experience",
      href: "/products/web-development",
      gradient: "from-red-500/20 to-orange-500/20",
      features: ["Custom Design", "Mobile First", "SEO Optimized"],
    },
    {
      icon: Server,
      title: "Software & Internal Tools",
      description: "Enterprise-grade custom software solutions that streamline operations and scale with your business",
      href: "/products/software-tools",
      gradient: "from-red-500/20 to-pink-500/20",
      features: ["Scalable", "Secure", "Cloud Ready"],
    },
    {
      icon: Terminal,
      title: "Scripts & Automations",
      description: "Intelligent automation scripts that eliminate repetitive tasks and boost productivity",
      href: "/products/scripts-automation",
      gradient: "from-orange-500/20 to-red-500/20",
      features: ["Time Saving", "Error Free", "Customizable"],
    },
    {
      icon: Sparkles,
      title: "AI Automations",
      description: "Cutting-edge AI solutions powered by the latest models to transform your business processes",
      href: "/products/ai-automations",
      gradient: "from-pink-500/20 to-red-500/20",
      features: ["Smart AI", "Custom Models", "24/7 Available"],
    },
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-40 right-20 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-40 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"
        />

        {/* Tech grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

        {/* Floating tech icons */}
        {[Code2, Zap, Brain, Layers].map((Icon, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 2,
            }}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + i * 15}%`,
            }}
          >
            <Icon className="w-12 h-12 text-red-500/20" />
          </motion.div>
        ))}
      </div>
      {/* </CHANGE> */}

      <section className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold tracking-tight mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-white">Transform Your </span>
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Business
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-12"
          >
            From stunning websites to intelligent AI automations, we build custom solutions that drive real results
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-semibold text-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-shadow"
              >
                Start Your Project
              </motion.button>
            </Link>
            <Link href="/demos">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-full font-semibold text-lg hover:bg-white/10 hover:border-red-500/50 transition-all"
              >
                View Demos
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
      {/* </CHANGE> */}

      <section className="container mx-auto px-4 pb-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link href={product.href}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/10 hover:border-red-500/50 rounded-3xl p-8 md:p-10 transition-all duration-500 cursor-pointer overflow-hidden h-full"
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <motion.div
                        className="w-16 h-16 bg-red-500/10 group-hover:bg-red-500/20 rounded-2xl flex items-center justify-center transition-all duration-300 border border-red-500/20"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <product.icon className="w-8 h-8 text-red-500" />
                      </motion.div>
                      <ArrowRight className="w-6 h-6 text-white/40 group-hover:text-red-500 group-hover:translate-x-2 transition-all duration-300" />
                    </div>

                    <h3 className="text-3xl font-bold text-white group-hover:text-red-400 mb-4 tracking-tight transition-colors duration-300">
                      {product.title}
                    </h3>

                    <p className="text-white/70 leading-relaxed mb-6 text-lg">{product.description}</p>

                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/60 group-hover:border-red-500/30 group-hover:text-white/80 transition-all"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-red-500/20 blur-3xl rounded-full" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      {/* </CHANGE> */}

      <section className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-50" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Ready to{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                innovate
              </span>
              ?
            </h2>
            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto">
              Let's discuss your project and create something extraordinary together
            </p>

            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-lg font-bold shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-shadow"
              >
                Get Started Today
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
      {/* </CHANGE> */}
    </div>
  )
}
