'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, Smartphone, Gauge, ArrowRight, Check, Code, Palette, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function WebDevelopmentPage() {
  const services = [
    {
      icon: Globe,
      title: "Custom Web Applications",
      description: "Full-stack web apps built with modern frameworks like Next.js, React, and Node.js",
      features: ["Responsive Design", "Cloud Deployment", "API Integration", "Real-time Features"]
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Beautiful, fast websites optimized for every device and screen size",
      features: ["Progressive Web Apps", "Touch-Optimized", "Offline Support", "App-Like Experience"]
    },
    {
      icon: Gauge,
      title: "Performance Optimization",
      description: "Lightning-fast load times and seamless user experiences that convert",
      features: ["Core Web Vitals", "SEO Optimized", "CDN Integration", "Image Optimization"]
    }
  ]

  const processSteps = [
    { number: "01", title: "Discovery & Planning", desc: "We learn your business goals and map out the perfect solution" },
    { number: "02", title: "Design & Prototype", desc: "Custom designs tailored to your brand and tested with real users" },
    { number: "03", title: "Development & Testing", desc: "Clean code, rigorous testing, and continuous communication" },
    { number: "04", title: "Launch & Support", desc: "Smooth deployment with ongoing maintenance and updates" }
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
            <Globe className="w-4 h-4" />
            Web Development
          </div>
          
          <h1 className="font-mono text-4xl font-thin text-white md:text-6xl lg:text-7xl">
            Custom Web Solutions That Drive{' '}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Real Results
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-subtle-gray max-w-3xl mx-auto">
            From landing pages to complex web applications, we build fast, beautiful, and scalable websites tailored to your business needs.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="animate-pulse-glow">
              <Link href="/contact">Start Your Project</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demos">View Our Work</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: "Projects Delivered" },
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
            Every project is custom-built from scratch to match your exact requirements
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
              <Card className="group bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-accent/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white group-hover:text-accent transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-subtle-gray group-hover:text-white/80 transition-colors">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-white/80">
                        <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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

      {/* Technologies Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Modern Tech Stack</h2>
          <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
            We use the latest technologies to build fast, secure, and scalable applications
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {['Next.js', 'React', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL'].map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 rounded-lg p-4 text-center transition-all duration-300"
            >
              <p className="text-sm font-mono text-white">{tech}</p>
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
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let's turn your vision into a powerful web application that drives growth
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
