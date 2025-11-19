"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from "next/link"
import { Code, Wrench, Zap, Brain, ArrowRight, Check } from 'lucide-react'
import { FadeInView } from '@/components/animations/fade-in-view'
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger-container'
import { MagneticButton } from '@/components/animations/magnetic-button'

export default function HomePage() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          style={{ opacity, scale }}
          className="max-w-6xl relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h1 className="font-mono text-6xl font-thin tracking-tighter text-white md:text-7xl lg:text-8xl leading-[1.05]">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="block"
              >
                Transform Your Business
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="block text-accent mt-2"
              >
                With Custom Solutions
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 max-w-3xl mx-auto text-lg text-white/70 md:text-xl leading-relaxed font-light"
          >
            Specialized custom development for web applications, internal software, process automation, and AI solutions. Built specifically for your business needs.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
          >
            <MagneticButton strength={0.2}>
              <Button size="lg" asChild className="relative bg-accent hover:bg-accent/90 text-white text-base px-10 py-7 rounded-lg font-semibold overflow-hidden group">
                <Link href="/contact">
                  <span className="relative z-10">Schedule Consultation</span>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/5 hover:border-accent/40 text-base px-10 py-7 rounded-lg font-semibold transition-all duration-300">
                <Link href="/products">Explore Services</Link>
              </Button>
            </MagneticButton>
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
      <section className="container mx-auto px-4 py-32">
        <FadeInView className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="text-white/60 font-mono text-xs tracking-widest uppercase">Our Services</span>
          </div>
          <h2 className="font-mono text-4xl font-thin text-white md:text-6xl mb-6">What We Build</h2>
          <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Four specialized services delivering custom solutions for modern businesses
          </p>
        </FadeInView>

        <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto" staggerDelay={0.15}>
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
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Card className="group bg-black/40 backdrop-blur-sm border border-white/10 hover:border-accent/40 transition-all duration-500 h-full cursor-pointer overflow-hidden relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                      animate={{
                        background: [
                          'linear-gradient(135deg, rgba(239, 68, 68, 0) 0%, rgba(239, 68, 68, 0) 100%)',
                          'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0) 100%)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                    />
                    
                    <CardHeader className="pb-4 relative z-10">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:border-accent/30 transition-all duration-300"
                      >
                        <service.icon className="w-7 h-7 text-accent" />
                      </motion.div>
                      <CardTitle className="text-2xl text-white group-hover:text-accent transition-colors font-mono font-thin">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-white/60 group-hover:text-white/80 transition-colors text-base font-light leading-relaxed">
                        {service.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-3 mb-6">
                        {service.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center text-sm text-white/70 font-light"
                          >
                            <Check className="w-4 h-4 text-accent mr-3 flex-shrink-0" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <div className="flex items-center text-accent group-hover:gap-2 transition-all text-sm font-semibold">
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-32 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-block mb-4 px-4 py-2 border border-white/10 rounded-full bg-white/5">
                <span className="text-white/60 font-mono text-xs tracking-widest uppercase">Our Approach</span>
              </div>
              <h2 className="font-mono text-4xl font-thin text-white md:text-6xl mb-6">
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
                  className="text-center p-8 rounded-xl border border-white/5 bg-white/[0.02] hover:border-accent/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-mono font-thin text-white mb-4">{benefit.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <FadeInView className="text-center mb-20">
            <div className="inline-block mb-4 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
              <span className="text-white/60 font-mono text-xs tracking-widest uppercase">Process</span>
            </div>
            <h2 className="font-mono text-4xl font-thin text-white md:text-6xl mb-6">Simple Process</h2>
            <p className="mt-4 text-lg text-white/60 font-light">From idea to deployed solution</p>
          </FadeInView>

          <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Discuss", desc: "Tell us what you need" },
              { number: "02", title: "Plan", desc: "We design the solution" },
              { number: "03", title: "Build", desc: "Custom development begins" },
              { number: "04", title: "Launch", desc: "Deploy and iterate" }
            ].map((step, index) => (
              <FadeInView
                key={index}
                delay={index * 0.15}
                className="text-center relative"
              >
                {index < 3 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
                    className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-accent/40 to-transparent origin-left"
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-6xl font-bold text-accent/20 font-mono mb-4 relative"
                >
                  {step.number}
                  <motion.div
                    className="absolute inset-0 text-accent/40 blur-xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {step.number}
                  </motion.div>
                </motion.div>
                <h3 className="text-xl font-mono font-thin text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/60 font-light">{step.desc}</p>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-accent/90 via-accent to-accent/80 rounded-2xl p-12 md:p-20 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-mono font-thin text-white mb-6 leading-tight">
              Ready to Build Something Custom?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              Whether it's a website, software tool, automation script, or AI solution — let's discuss what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button size="lg" variant="secondary" asChild className="bg-white text-black hover:bg-white/90 text-base px-10 py-7 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/contact">
                  Schedule Consultation <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2 border-white text-white hover:bg-white/10 text-base px-10 py-7 rounded-lg font-semibold transition-all duration-300">
                <Link href="/demos">
                  View Demos
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
