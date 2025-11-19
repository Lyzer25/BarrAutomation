'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, Server, Terminal, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeInView } from '@/components/animations/fade-in-view'
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger-container'

export default function ProductsPage() {
  const products = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Professional websites and web applications that drive results",
      href: "/products/web-development",
      features: ["Custom Design", "SEO Optimized", "Mobile Responsive", "Fast Performance"],
    },
    {
      icon: Server,
      title: "Software & Internal Tools",
      description: "Enterprise solutions that transform your operations",
      href: "/products/software-tools",
      features: ["Custom CRM", "API Integration", "Data Analytics", "Cloud Infrastructure"],
    },
    {
      icon: Terminal,
      title: "Scripts & Automations",
      description: "Quick solutions for repetitive tasks and workflows",
      href: "/products/scripts-automation",
      features: ["Fast Delivery", "Fixed Pricing", "Web Scraping", "Task Automation"],
    },
    {
      icon: Sparkles,
      title: "AI Automations",
      description: "Custom AI solutions tailored to your business needs",
      href: "/products/ai-automations",
      features: ["Custom Models", "Smart Integrations", "Workflow AI", "Data Processing"],
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <FadeInView className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-4xl font-thin text-white md:text-6xl lg:text-7xl"
          >
            Our{' '}
            <span className="text-accent">
              Products
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg text-white/60 max-w-3xl mx-auto font-light leading-relaxed"
          >
            From stunning websites to enterprise software and AI-powered automations, we build custom solutions that transform your business. Choose the service that fits your needs.
          </motion.p>
        </FadeInView>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <StaggerContainer className="grid md:grid-cols-2 gap-8" staggerDelay={0.15}>
          {products.map((product, index) => (
            <StaggerItem key={index}>
              <Link href={product.href}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <Card className="group bg-black/40 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                      }}
                    />
                    
                    <CardHeader className="relative z-10">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:border-accent/50 transition-all duration-300"
                      >
                        <product.icon className="w-8 h-8 text-accent" />
                      </motion.div>
                      <CardTitle className="text-3xl text-white group-hover:text-accent transition-colors font-mono font-thin">
                        {product.title}
                      </CardTitle>
                      <CardDescription className="text-white/60 group-hover:text-white/80 transition-colors text-lg font-light leading-relaxed">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-center text-accent group-hover:gap-2 transition-all font-semibold">
                        <span>Learn More</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-20">
        <FadeInView className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-5xl">
            Why Choose <span className="text-accent">Barr Automations</span>
          </h2>
        </FadeInView>
        
        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {[
            { number: "01", title: "Custom Solutions", desc: "Every project is tailored to your specific needs and goals" },
            { number: "02", title: "Fast Delivery", desc: "We work efficiently to get your solution deployed quickly" },
            { number: "03", title: "Ongoing Support", desc: "We're here to help even after your project launches" }
          ].map((item, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -5 }}
                className="text-center p-8 rounded-xl border border-white/5 bg-white/[0.02] hover:border-accent/20 hover:bg-white/[0.04] transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-6xl font-bold text-accent/20 font-mono mb-4"
                >
                  {item.number}
                </motion.div>
                <h3 className="text-xl font-mono font-thin text-white mb-2">{item.title}</h3>
                <p className="text-white/60 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 pb-32">
        <FadeInView>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative bg-gradient-to-br from-accent/90 via-accent to-accent/80 rounded-2xl p-12 md:p-16 text-center overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                backgroundSize: '200% 200%',
              }}
            />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-mono font-thin text-white mb-6 leading-tight">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                Let's discuss your project and find the perfect solution for your needs
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button size="lg" variant="secondary" asChild className="bg-white text-black hover:bg-white/90 text-base px-10 py-7 rounded-lg font-semibold">
                  <Link href="/contact">
                    Contact Us Today <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </FadeInView>
      </section>
    </div>
  )
}
