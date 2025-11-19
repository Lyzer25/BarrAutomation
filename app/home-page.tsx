"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from "next/link"
import { Code, Wrench, Zap, Brain, ArrowRight, Check } from 'lucide-react'
import { FadeInView } from '@/components/animations/fade-in-view'
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger-container'

export default function HomePage() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        
        <motion.div
          style={{ opacity, scale }}
          className="max-w-6xl relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h1 className="font-mono text-6xl font-thin tracking-tighter text-white md:text-7xl lg:text-8xl leading-[1.05]">
              <motion.span
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="block"
              >
                Transform Your Business
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="block text-accent mt-2"
              >
                With Custom Solutions
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 max-w-3xl mx-auto text-lg text-white/70 md:text-xl leading-relaxed font-light"
          >
            Specialized custom development for web applications, internal software, process automation, and AI solutions. Built specifically for your business needs.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="relative"
            >
              <Button size="lg" asChild className="relative bg-white text-black hover:bg-white/90 text-base px-10 py-7 rounded-full font-medium">
                <Link href="/contact">
                  <span className="flex items-center gap-2">
                    Schedule Consultation
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" asChild className="border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20 text-base px-10 py-7 rounded-full font-medium">
                <Link href="/products">Explore Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full p-1"
          >
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-accent rounded-full mx-auto"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-32 relative">
        <FadeInView className="text-center mb-20 relative z-10">
          <div className="inline-block mb-4 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="text-white/60 font-mono text-xs tracking-widest uppercase">Our Services</span>
          </div>
          <h2 className="font-mono text-4xl font-thin text-white md:text-6xl mb-6">What We Build</h2>
          <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Four specialized services delivering custom solutions for modern businesses
          </p>
        </FadeInView>

        <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto relative z-10" staggerDelay={0.15}>
          {[
            {
              icon: Code,
              title: "Web Development",
              desc: "Custom websites and e-commerce platforms built from scratch",
              features: ["Business websites", "E-commerce stores", "Enterprise management"],
              link: "/products/web-development"
            },
            {
              icon: Wrench,
              title: "Software & Tools",
              desc: "Internal business tools and custom software platforms",
              features: ["Dashboards & CRMs", "Internal workflows", "Custom applications"],
              link: "/products/software-tools"
            },
            {
              icon: Zap,
              title: "Scripts & Automation",
              desc: "Quick scripts and process automations to save time",
              features: ["Data processing", "Task automation", "Report generation"],
              link: "/products/scripts-automation"
            },
            {
              icon: Brain,
              title: "AI Solutions",
              desc: "Custom AI models, chatbots, and intelligent systems",
              features: ["Custom AI models", "Chatbots & assistants", "Predictive analytics"],
              link: "/products/ai-automations"
            }
          ].map((service, index) => (
            <StaggerItem key={index}>
              <Link href={service.link}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative group h-full"
                >
                  <Card className="group bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all duration-500 h-full cursor-pointer overflow-hidden relative rounded-3xl">
                    <CardHeader className="pb-4 relative z-10 pt-8 px-8">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:border-accent transition-all duration-300"
                      >
                        <service.icon className="w-6 h-6 text-white group-hover:text-white transition-colors" />
                      </motion.div>
                      <CardTitle className="text-2xl text-white font-medium tracking-tight">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-white/50 group-hover:text-white/70 transition-colors text-base font-light leading-relaxed mt-2">
                        {service.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 px-8 pb-8">
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center text-sm text-white/60 font-light"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-accent/50 mr-3 flex-shrink-0" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <div className="flex items-center text-white/40 group-hover:text-white transition-all text-sm font-medium">
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Why Custom Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-block mb-4 px-4 py-1.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
                <span className="text-white/60 font-mono text-[10px] tracking-[0.2em] uppercase">Our Approach</span>
              </div>
              <h2 className="text-4xl font-thin text-white md:text-6xl mb-6 tracking-tight">
                Why Custom Development?
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                Off-the-shelf solutions force you to adapt your business to their limitations.<br className="hidden md:block" /> 
                Custom development adapts to you.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Built for You",
                  desc: "Every feature designed specifically for your workflow, not generic templates that require compromise"
                },
                {
                  title: "Scale with Growth",
                  desc: "Solutions that grow with your business without platform limitations or subscription increases"
                },
                {
                  title: "Own Your Tech",
                  desc: "Full ownership of your code and data with no vendor lock-in or platform dependencies"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-10 rounded-3xl border border-white/5 bg-[#0A0A0A] hover:bg-white/[0.02] transition-all duration-500 group relative"
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-4 tracking-tight">{benefit.title}</h3>
                    <p className="text-white/50 font-light leading-relaxed">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-black relative">
        <div className="container mx-auto px-4 relative z-10">
          <FadeInView className="text-center mb-24">
            <div className="inline-block mb-4 px-4 py-1.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
              <span className="text-white/60 font-mono text-[10px] tracking-[0.2em] uppercase">Process</span>
            </div>
            <h2 className="text-4xl font-thin text-white md:text-6xl mb-6 tracking-tight">
              Simple Process
            </h2>
            <p className="mt-4 text-lg text-white/60 font-light">From idea to deployed solution</p>
          </FadeInView>

          <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px]">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            
            {[
              { number: "01", title: "Discuss", desc: "Tell us what you need" },
              { number: "02", title: "Plan", desc: "We design the solution" },
              { number: "03", title: "Build", desc: "Custom development begins" },
              { number: "04", title: "Fine tune", desc: "Refine and optimize" },
              { number: "05", title: "Launch", desc: "Deploy and iterate" }
            ].map((step, index) => (
              <FadeInView
                key={index}
                delay={index * 0.15}
                className="text-center relative z-10"
              >
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-24 h-24 mx-auto bg-[#050505] border border-white/10 rounded-full flex items-center justify-center mb-8 relative group"
                >
                  <span className="text-2xl font-mono text-white/80 group-hover:text-accent transition-colors duration-300">{step.number}</span>
                </motion.div>
                <h3 className="text-xl font-medium text-white mb-3 tracking-tight">{step.title}</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">{step.desc}</p>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-12 md:p-24 text-center overflow-hidden"
        >
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-thin text-white mb-6 tracking-tight">
              Ready to Build Something Custom?
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Let's discuss your project and create a solution built specifically for your business
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button size="lg" asChild className="relative bg-white text-black hover:bg-white/90 text-base px-10 py-7 rounded-full font-medium">
                  <Link href="/contact">
                    <span className="relative z-10 flex items-center gap-2">
                      Schedule Consultation
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" asChild className="border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20 text-base px-10 py-7 rounded-full font-medium">
                  <Link href="/demos">
                    View Demos
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
