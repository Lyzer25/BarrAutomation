"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Code, Wrench, Zap, Brain, ArrowRight, Cpu, Database, Network, Workflow, Server, Terminal } from 'lucide-react'
import { FadeInView } from "@/components/animations/fade-in-view"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

export default function HomePage() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.08),transparent_50%)]" />
        
        {/* Circuit grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Animated connecting lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <motion.line
            x1="10%" y1="20%" x2="30%" y2="40%"
            stroke="rgb(239, 68, 68)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.line
            x1="70%" y1="30%" x2="90%" y2="50%"
            stroke="rgb(239, 68, 68)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.line
            x1="15%" y1="70%" x2="40%" y2="85%"
            stroke="rgb(239, 68, 68)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.line
            x1="60%" y1="75%" x2="85%" y2="90%"
            stroke="rgb(239, 68, 68)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </svg>

        {/* Scattered tech icons */}
        {[
          { Icon: Cpu, x: "12%", y: "18%", delay: 0.3 },
          { Icon: Database, x: "85%", y: "25%", delay: 0.6 },
          { Icon: Network, x: "20%", y: "75%", delay: 0.9 },
          { Icon: Workflow, x: "88%", y: "70%", delay: 1.2 },
          { Icon: Server, x: "8%", y: "50%", delay: 1.5 },
          { Icon: Terminal, x: "92%", y: "45%", delay: 1.8 },
        ].map(({ Icon, x, y, delay }, idx) => (
          <motion.div
            key={idx}
            className="absolute w-10 h-10 bg-[#0A0A0A]/80 border border-red-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ delay, duration: 0.8, repeat: Infinity, repeatType: "reverse", repeatDelay: 4 }}
          >
            <Icon className="w-5 h-5 text-red-400/60" />
          </motion.div>
        ))}

        {/* Node connection points */}
        {[
          { x: "30%", y: "40%" },
          { x: "70%", y: "30%" },
          { x: "15%", y: "70%" },
          { x: "85%", y: "90%" },
        ].map((pos, idx) => (
          <motion.div
            key={idx}
            className="absolute w-3 h-3 bg-red-500/40 rounded-full"
            style={{ left: pos.x, top: pos.y }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              delay: idx * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute left-[5%] top-[20%] w-72 h-96 rounded-[3rem] bg-gradient-to-br from-red-600/20 to-red-900/10 backdrop-blur-3xl border border-red-500/20 z-0 hidden lg:block"
          style={{
            boxShadow: "0 8px 32px 0 rgba(239, 68, 68, 0.25), inset 0 0 80px rgba(239, 68, 68, 0.08)",
          }}
        />

        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute right-[5%] top-[15%] w-80 h-80 rounded-full bg-gradient-to-br from-red-500/15 to-red-700/10 backdrop-blur-3xl border border-red-500/20 z-0 hidden lg:block"
          style={{
            boxShadow: "0 8px 32px 0 rgba(239, 68, 68, 0.2), inset 0 0 80px rgba(239, 68, 68, 0.08)",
          }}
        />

        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute left-[15%] bottom-[20%] w-64 h-72 rounded-[2.5rem] bg-gradient-to-br from-red-600/15 to-red-900/20 backdrop-blur-3xl border border-red-500/20 z-0 hidden lg:block"
          style={{
            boxShadow: "0 8px 32px 0 rgba(239, 68, 68, 0.2), inset 0 0 80px rgba(239, 68, 68, 0.08)",
          }}
        />

        {/* Code snippet - left side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute left-[8%] top-[35%] w-80 bg-[#0A0A0A]/90 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 font-mono text-sm text-left z-10 hidden xl:block"
          style={{
            boxShadow: "0 8px 32px 0 rgba(239, 68, 68, 0.15), 0 0 0 1px rgba(239, 68, 68, 0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="text-white/70 leading-relaxed space-y-1">
            <div>
              <span className="text-red-400">const</span> <span className="text-blue-300">solution</span> = {"{"}
            </div>
            <div className="pl-4">
              client: <span className="text-green-300">Your Business</span>,
            </div>
            <div className="pl-4">
              type: <span className="text-green-300">Custom Built</span>,
            </div>
            <div className="pl-4">features: [</div>
            <div className="pl-8">
              <span className="text-green-300">AI Automation</span>,
            </div>
            <div className="pl-8">
              <span className="text-green-300">Web Apps</span>,
            </div>
            <div className="pl-8">
              <span className="text-green-300">Process Tools</span>
            </div>
            <div className="pl-4">]</div>
            <div>{"};"}</div>
          </div>
        </motion.div>

        {/* UI Components preview - right side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute right-[8%] bottom-[25%] w-72 bg-[#0A0A0A]/90 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 z-10 hidden xl:block"
          style={{
            boxShadow: "0 8px 32px 0 rgba(239, 68, 68, 0.15), 0 0 0 1px rgba(239, 68, 68, 0.1)",
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm font-medium">Deploy Status</span>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                Live
              </span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "95%" }}
                  transition={{ delay: 1.2, duration: 1.5 }}
                  className="h-full bg-gradient-to-r from-red-500 to-red-600"
                />
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>Automation Active</span>
                <span className="font-medium">95%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium"
              >
                Configure
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 text-sm font-medium"
              >
                Monitor
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div style={{ opacity, scale }} className="max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 mt-20"
          >
            <h1 className="font-mono text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-white leading-[1.1]">
              <motion.span
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="block bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
                style={{
                  textShadow: "0 0 80px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)",
                }}
              >
                Automate your business.
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 max-w-3xl mx-auto text-base md:text-lg text-white/70 leading-relaxed font-light"
          >
            Barr Automations builds custom web applications, AI chatbots, internal tools, and process automation.
            Trusted by businesses who need solutions that actually fit their workflow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
              <Button
                size="lg"
                asChild
                className="relative bg-white text-black hover:bg-white/90 text-base px-10 py-7 rounded-full font-medium"
              >
                <Link href="/contact">
                  <span className="flex items-center gap-2">
                    Schedule Consultation
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20 text-base px-10 py-7 rounded-full font-medium"
              >
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
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-6 h-10 border-2 border-white/20 rounded-full p-1"
          >
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-1 h-2 bg-red-500 rounded-full mx-auto"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-32 relative">
        <FadeInView className="text-center mb-20 relative z-10">
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
              link: "/products/web-development",
            },
            {
              icon: Wrench,
              title: "Software & Tools",
              desc: "Internal business tools and custom software platforms",
              features: ["Dashboards & CRMs", "Internal workflows", "Custom applications"],
              link: "/products/software-tools",
            },
            {
              icon: Zap,
              title: "Scripts & Automation",
              desc: "Quick scripts and process automations to save time",
              features: ["Data processing", "Task automation", "Report generation"],
              link: "/products/scripts-automation",
            },
            {
              icon: Brain,
              title: "AI Solutions",
              desc: "Custom AI models, chatbots, and intelligent systems",
              features: ["Custom AI models", "Chatbots & assistants", "Predictive analytics"],
              link: "/products/ai-automations",
            },
          ].map((service, index) => (
            <StaggerItem key={index}>
              <Link href={service.link}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative group h-full"
                >
                  <Card className="group bg-[#0A0A0A] border border-white/5 hover:border-red-medium/20 transition-all duration-500 h-full cursor-pointer overflow-hidden relative rounded-3xl">
                    <CardHeader className="pb-4 relative z-10 pt-8 px-8">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-medium/10 group-hover:border-red-medium/30 transition-all duration-300"
                      >
                        <service.icon className="w-6 h-6 text-white group-hover:text-red-light transition-colors" />
                      </motion.div>
                      <CardTitle className="text-2xl text-white font-medium tracking-tight">{service.title}</CardTitle>
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
              <h2 className="text-4xl font-thin text-white md:text-6xl mb-6 tracking-tight">Why Custom Development?</h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                Off-the-shelf solutions force you to adapt your business to their limitations.
                <br className="hidden md:block" />
                Custom development adapts to you.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Built for You",
                  desc: "Every feature designed specifically for your workflow, not generic templates that require compromise",
                },
                {
                  title: "Scale with Growth",
                  desc: "Solutions that grow with your business without platform limitations or subscription increases",
                },
                {
                  title: "Own Your Tech",
                  desc: "Full ownership of your code and data with no vendor lock-in or platform dependencies",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-10 rounded-3xl border border-white/5 bg-[#0A0A0A] hover:bg-white/[0.02] hover:border-red-medium/20 transition-all duration-500 group relative"
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-red-medium/10 transition-transform duration-500">
                      <div className="w-2 h-2 bg-red-medium rounded-full"></div>
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
            <h2 className="text-4xl font-thin text-white md:text-6xl mb-6 tracking-tight">Simple Process</h2>
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
              { number: "05", title: "Launch", desc: "Deploy and iterate" },
            ].map((step, index) => (
              <FadeInView key={index} delay={index * 0.15} className="text-center relative z-10">
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-24 h-24 mx-auto bg-[#050505] border border-white/10 rounded-full flex items-center justify-center mb-8 relative group"
                >
                  <span className="text-2xl font-mono text-white/80 group-hover:text-accent transition-colors duration-300">
                    {step.number}
                  </span>
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                <Button
                  size="lg"
                  asChild
                  className="relative bg-white text-black hover:bg-white/90 text-base px-10 py-7 rounded-full font-medium"
                >
                  <Link href="/contact">
                    <span className="flex items-center gap-2">
                      Schedule Consultation
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20 text-base px-10 py-7 rounded-full font-medium"
                >
                  <Link href="/demos">View Demos</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
