"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from "next/link"
import { Code, Wrench, Zap, Brain, ArrowRight, Check, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="font-mono text-5xl font-thin tracking-tighter text-white md:text-7xl lg:text-8xl">
              Custom Development{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
          </motion.div>
          
          <p className="mt-8 max-w-3xl mx-auto text-xl text-subtle-gray md:text-2xl leading-relaxed">
            We build websites, software, scripts, and AI solutions tailored specifically to your business needs. No templates. No shortcuts. Just custom development that works.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="animate-pulse-glow text-lg px-8 py-6">
              <Link href="/contact">Start Your Project</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/products">Explore Services</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl font-thin text-white md:text-5xl">What We Build</h2>
          <p className="mt-4 text-lg text-subtle-gray max-w-2xl mx-auto">
            Four core services, infinite custom possibilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Code,
              title: "Web Development",
              desc: "Custom websites and e-commerce platforms built from scratch",
              features: ["Business websites", "E-commerce stores", "Enterprise management"],
              link: "/products/web-development",
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              icon: Wrench,
              title: "Software & Tools",
              desc: "Internal business tools and custom software platforms",
              features: ["Dashboards & CRMs", "Internal workflows", "Custom applications"],
              link: "/products/software-tools",
              gradient: "from-purple-500 to-pink-500"
            },
            {
              icon: Zap,
              title: "Scripts & Automation",
              desc: "Quick scripts and process automations to save time",
              features: ["Data processing", "Task automation", "Report generation"],
              link: "/products/scripts-automation",
              gradient: "from-green-500 to-emerald-500"
            },
            {
              icon: Brain,
              title: "AI Solutions",
              desc: "Custom AI models, chatbots, and intelligent systems",
              features: ["Custom AI models", "Chatbots & assistants", "Predictive analytics"],
              link: "/products/ai-automations",
              gradient: "from-red-500 to-orange-500"
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link href={service.link}>
                <Card className="group bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-accent/20 cursor-pointer">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white group-hover:text-accent transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-subtle-gray group-hover:text-white/80 transition-colors text-base">
                      {service.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-white/80">
                          <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center text-accent group-hover:gap-2 transition-all">
                      <span className="text-sm font-semibold">Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Custom Section */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-mono text-3xl font-thin text-white md:text-5xl mb-6">
                Why Custom Development?
              </h2>
              <p className="text-lg text-subtle-gray">
                Off-the-shelf solutions force you to adapt your business to their limitations. Custom development adapts to you.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Built for You",
                  desc: "Every feature designed specifically for your workflow, not generic templates"
                },
                {
                  title: "Scale with Growth",
                  desc: "Solutions that grow with your business, not software subscriptions that hold you hostage"
                },
                {
                  title: "Own Your Tech",
                  desc: "Full ownership of your code and data, no vendor lock-in or platform dependencies"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-subtle-gray">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl font-thin text-white md:text-5xl">Simple Process</h2>
            <p className="mt-4 text-lg text-subtle-gray">From idea to deployed solution</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Discuss", desc: "Tell us what you need" },
              { number: "02", title: "Plan", desc: "We design the solution" },
              { number: "03", title: "Build", desc: "Custom development begins" },
              { number: "04", title: "Launch", desc: "Deploy and iterate" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-7xl font-bold text-accent/20 font-mono mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-subtle-gray">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12 md:p-16 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Build Something Custom?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
            Whether it's a website, software tool, automation script, or AI solution — let's discuss what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6">
              <Link href="/contact">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              <Link href="/demos">
                View Demos
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  )
}
