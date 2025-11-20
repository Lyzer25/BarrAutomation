"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import LogoCarousel from "@/components/logo-carousel"
import Link from "next/link"
import {
  Brain,
  MessageSquare,
  Workflow,
  Bot,
  Sparkles,
  Check,
  Clock,
  TrendingUp,
  Users,
  Zap,
  DollarSign,
  Target,
} from "lucide-react"

const stats = [
  { icon: Bot, value: "24/7", label: "AI Availability" },
  { icon: Sparkles, value: "10x", label: "Potential Efficiency" },
]

export default function AIAutomationsPage() {
  const [activeCase, setActiveCase] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-black">
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Heading and Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tight text-white mb-12 leading-tight">
              Built to automate together <span className="block mt-2">as one.</span>
            </h1>

            {/* Abstract AI Workflow Illustration */}
            <div className="relative h-[300px] md:h-[400px] mt-12">
              {/* Dotted background pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
              </svg>

              {/* Workflow Loop */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 600 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Main workflow path - rounded rectangle */}
                <path
                  d="M 150 200 L 150 120 Q 150 100 170 100 L 430 100 Q 450 100 450 120 L 450 280 Q 450 300 430 300 L 170 300 Q 150 300 150 280 Z"
                  stroke="#ffffff"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.6"
                />

                {/* Dotted connecting arcs */}
                <path
                  d="M 100 200 Q 100 150 150 150"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M 450 150 Q 500 150 500 200"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                  opacity="0.3"
                />
              </svg>

              {/* Icons on the path */}
              {/* Left Icon - Brain/AI */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute left-[15%] top-1/2 -translate-y-1/2 w-16 h-16 bg-black border-2 border-white/80 rounded-2xl flex items-center justify-center"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>

              {/* Right Icon - Workflow */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute right-[15%] top-1/2 -translate-y-1/2 w-16 h-16 bg-black border-2 border-white/80 rounded-2xl flex items-center justify-center"
              >
                <Workflow className="w-8 h-8 text-white" />
              </motion.div>

              {/* Top Center - Red Accent Node */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="absolute left-1/2 -translate-x-1/2 top-[25%] w-14 h-14 bg-red-medium rounded-full flex items-center justify-center shadow-lg shadow-red-medium/30"
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {[
              {
                icon: MessageSquare,
                iconBg: "bg-red-medium",
                title: "Chatbots trained on your documentation.",
                desc: "Custom AI chatbots learn your internal processes, company knowledge, and workflows to handle tasks exactly as your team would.",
              },
              {
                icon: Bot,
                iconBg: "bg-red-dark",
                title: "Replace repetitive employee tasks.",
                desc: "Deploy AI agents that handle customer support, data entry, scheduling, and internal inquiries 24/7 with responses trained on your specific business operations.",
              },
              {
                icon: Sparkles,
                iconBg: "bg-red-light",
                title: "Generate and qualify leads automatically.",
                desc: "AI-powered chatbots engage website visitors, qualify leads through intelligent conversations, and integrate with your CRM to capture high-quality prospects 24/7.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-red-medium/30 transition-all duration-300 rounded-2xl p-6"
              >
                <div className={`w-10 h-10 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/75 text-base leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA Buttons Below Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/contact?type=ai-automations">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors"
            >
              Discuss Your AI Project
            </motion.button>
          </Link>
          <Link href="/demos">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/15 transition-colors border border-white/20"
            >
              View AI Demos
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <section className="py-24 bg-gradient-to-b from-black via-black/95 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-sans text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              What You Could Do With Us
            </h2>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">
              Transform your business with custom AI solutions that work 24/7
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "24/7 Customer Support",
                description: "AI chatbots handle customer inquiries around the clock, trained on your knowledge base",
                stat: "24/7",
                statLabel: "Always Available",
                color: "red-medium",
                features: ["Instant responses", "No wait times", "Scale infinitely"],
              },
              {
                icon: TrendingUp,
                title: "10x Efficiency Gains",
                description: "Automate repetitive tasks and free your team to focus on high-value work",
                stat: "10x",
                statLabel: "Faster Processing",
                color: "red-light",
                features: ["Eliminate bottlenecks", "Reduce manual work", "Speed up operations"],
              },
              {
                icon: Users,
                title: "Lead Generation & Qualification",
                description: "AI agents engage visitors, qualify leads, and schedule meetings automatically",
                stat: "3x",
                statLabel: "More Qualified Leads",
                color: "red-dark",
                features: ["Engage every visitor", "Smart qualification", "CRM integration"],
              },
              {
                icon: Zap,
                title: "Instant Knowledge Access",
                description: "Employees get instant answers from your internal documentation and processes",
                stat: "90%",
                statLabel: "Time Saved",
                color: "red-medium",
                features: ["Search all docs instantly", "No manual lookup", "Always up-to-date"],
              },
              {
                icon: DollarSign,
                title: "Reduce Operating Costs",
                description: "Lower support costs and scale operations without proportional headcount increases",
                stat: "60%",
                statLabel: "Cost Reduction",
                color: "red-light",
                features: ["Lower overhead", "Scale efficiently", "Predictable costs"],
              },
              {
                icon: Target,
                title: "Personalized Experiences",
                description: "AI delivers tailored responses based on customer history and context",
                stat: "85%",
                statLabel: "Satisfaction Rate",
                color: "red-dark",
                features: ["Context-aware", "Personalized responses", "Better engagement"],
              },
            ].map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-[#0A0A0A] border border-white/10 hover:border-red-medium/40 transition-all duration-500 rounded-3xl p-8 h-full relative overflow-hidden group"
                >
                  {/* Animated background gradient on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === index ? 0.05 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-red-medium to-transparent"
                  />

                  {/* Icon with animated background */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`w-16 h-16 bg-${capability.color}/20 border border-${capability.color}/30 rounded-2xl flex items-center justify-center mb-6 relative z-10`}
                  >
                    <capability.icon className={`w-8 h-8 text-${capability.color}`} />
                  </motion.div>

                  {/* Stat Badge */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <motion.span
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-4xl font-bold text-white"
                    >
                      {capability.stat}
                    </motion.span>
                    <span className="text-sm text-white/60 font-medium">{capability.statLabel}</span>
                  </div>

                  <h3 className="text-white text-2xl font-bold mb-3 tracking-tight">{capability.title}</h3>

                  <p className="text-white/75 text-base mb-6 leading-relaxed">{capability.description}</p>

                  {/* Feature list with animated checkmarks */}
                  <ul className="space-y-2">
                    {capability.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-center text-sm text-white/80"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mr-3 flex-shrink-0"
                        >
                          <Check className="w-3 h-3 text-green-400" />
                        </motion.div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Hover indicator */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: hoveredCard === index ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-medium to-red-light"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* CTA below cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <Link href="/contact?type=ai-automations">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-10 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors shadow-lg shadow-white/10"
              >
                Build Your Custom AI Solution
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Logo Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-xl text-white/60 mb-12 font-light">
            AI integrations with the tools you already use
          </h3>
          <LogoCarousel />
        </div>
      </section>

      {/* Custom AI Capabilities */}
      <section className="container mx-auto px-4 py-20 bg-black/20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Custom AI Capabilities</h2>
          <p className="text-center text-white/75 mb-12 max-w-2xl mx-auto">
            Every AI solution is custom-built for your specific use case
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: "Custom AI Models",
              desc: "Tailored machine learning solutions for your specific needs",
              features: ["Model training", "Fine-tuning", "Data analysis"],
              badge: "ML/AI",
              stat: "Custom Trained",
            },
            {
              icon: MessageSquare,
              title: "Conversational AI",
              desc: "Intelligent chatbots and virtual assistants",
              features: ["NLP processing", "Multi-language", "Context awareness"],
              badge: "Chatbots",
              stat: "24/7 Available",
            },
            {
              icon: Workflow,
              title: "AI Workflow Automation",
              desc: "Automate complex business processes with AI",
              features: ["Document processing", "Data extraction", "Smart routing"],
              badge: "Automation",
              stat: "10x Faster",
            },
            {
              icon: Bot,
              title: "Computer Vision",
              desc: "Image and video analysis for your applications",
              features: ["Object detection", "Face recognition", "Quality inspection"],
              badge: "Vision",
              stat: "Real-time",
            },
            {
              icon: Brain,
              title: "Predictive Analytics",
              desc: "Forecast trends and make data-driven decisions",
              features: ["Sales forecasting", "Risk assessment", "Anomaly detection"],
              badge: "Analytics",
              stat: "Data-Driven",
            },
            {
              icon: Sparkles,
              title: "Document Intelligence",
              desc: "Extract insights from documents automatically",
              features: ["OCR processing", "Data extraction", "Summarization"],
              badge: "Documents",
              stat: "99% Accuracy",
            },
          ].map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-[#0A0A0A] border border-white/10 hover:border-red-medium/30 transition-all duration-500 rounded-3xl p-8 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold bg-red-dark/20 text-red-light px-3 py-1 rounded-full border border-red-dark/30">
                    {solution.badge}
                  </span>
                </div>

                <div className="w-12 h-12 bg-red-dark/20 border border-red-dark/30 rounded-xl flex items-center justify-center mb-4">
                  <solution.icon className="w-6 h-6 text-red-medium" />
                </div>
                <h3 className="text-white text-2xl font-semibold mb-4">{solution.title}</h3>
                <p className="text-white/75 text-base mb-4 leading-relaxed">{solution.desc}</p>

                <p className="text-red-medium font-semibold text-sm mb-6">{solution.stat}</p>

                <ul className="space-y-2">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-white/85">
                      <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Example AI Use Cases</h2>
          <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
            See how custom AI solutions could transform businesses across industries
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {[
              {
                industry: "E-Commerce Example",
                challenge: "Manual product categorization taking hours",
                solution: "Custom AI model for automatic product classification and tagging",
                results: ["Target 95% accuracy", "10x faster processing", "Save 40 hours/week"],
              },
              {
                industry: "Healthcare Example",
                challenge: "Medical document processing bottleneck",
                solution: "Custom AI document intelligence system with HIPAA compliance",
                results: ["90% time reduction goal", "Target 99.8% accuracy", "Fully HIPAA compliant"],
              },
              {
                industry: "Finance Example",
                challenge: "Fraud detection taking too long",
                solution: "Custom real-time AI fraud detection system",
                results: ["Real-time detection", "Reduce false positives", "Significant cost savings"],
              },
            ].map((useCase, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveCase(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-full font-semibold transition-all backdrop-blur-sm ${
                  activeCase === index
                    ? "bg-red-medium text-white shadow-lg shadow-red-medium/20"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {useCase.industry}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xs font-bold text-red-medium mb-3 uppercase tracking-wider">THE CHALLENGE</h4>
                <p className="text-white/80 leading-relaxed">
                  {
                    [
                      {
                        industry: "E-Commerce Example",
                        challenge: "Manual product categorization taking hours",
                        solution: "Custom AI model for automatic product classification and tagging",
                        results: ["Target 95% accuracy", "10x faster processing", "Save 40 hours/week"],
                      },
                      {
                        industry: "Healthcare Example",
                        challenge: "Medical document processing bottleneck",
                        solution: "Custom AI document intelligence system with HIPAA compliance",
                        results: ["90% time reduction goal", "Target 99.8% accuracy", "Fully HIPAA compliant"],
                      },
                      {
                        industry: "Finance Example",
                        challenge: "Fraud detection taking too long",
                        solution: "Custom real-time AI fraud detection system",
                        results: ["Real-time detection", "Reduce false positives", "Significant cost savings"],
                      },
                    ][activeCase].challenge
                  }
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-red-medium mb-3 uppercase tracking-wider">
                  CUSTOM SOLUTION APPROACH
                </h4>
                <p className="text-white/80 leading-relaxed">
                  {
                    [
                      {
                        industry: "E-Commerce Example",
                        challenge: "Manual product categorization taking hours",
                        solution: "Custom AI model for automatic product classification and tagging",
                        results: ["Target 95% accuracy", "10x faster processing", "Save 40 hours/week"],
                      },
                      {
                        industry: "Healthcare Example",
                        challenge: "Medical document processing bottleneck",
                        solution: "Custom AI document intelligence system with HIPAA compliance",
                        results: ["90% time reduction goal", "Target 99.8% accuracy", "Fully HIPAA compliant"],
                      },
                      {
                        industry: "Finance Example",
                        challenge: "Fraud detection taking too long",
                        solution: "Custom real-time AI fraud detection system",
                        results: ["Real-time detection", "Reduce false positives", "Significant cost savings"],
                      },
                    ][activeCase].solution
                  }
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-red-medium mb-3 uppercase tracking-wider">POTENTIAL RESULTS</h4>
                <ul className="space-y-3">
                  {[
                    {
                      industry: "E-Commerce Example",
                      challenge: "Manual product categorization taking hours",
                      solution: "Custom AI model for automatic product classification and tagging",
                      results: ["Target 95% accuracy", "10x faster processing", "Save 40 hours/week"],
                    },
                    {
                      industry: "Healthcare Example",
                      challenge: "Medical document processing bottleneck",
                      solution: "Custom AI document intelligence system with HIPAA compliance",
                      results: ["90% time reduction goal", "Target 99.8% accuracy", "Fully HIPAA compliant"],
                    },
                    {
                      industry: "Finance Example",
                      challenge: "Fraud detection taking too long",
                      solution: "Custom real-time AI fraud detection system",
                      results: ["Real-time detection", "Reduce false positives", "Significant cost savings"],
                    },
                  ][activeCase].results.map((result, idx) => (
                    <li key={idx} className="flex items-center text-white/80">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">From Concept to Custom AI</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: "01", title: "Discovery", desc: "Understanding your data and business goals" },
              { number: "02", title: "Design", desc: "Custom AI architecture planning" },
              { number: "03", title: "Development", desc: "Model training and fine-tuning" },
              { number: "04", title: "Deploy", desc: "Integration and ongoing optimization" },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
            Ready to build your custom AI solution?
          </h2>
          <p className="text-xl text-white/75 mb-10 leading-relaxed max-w-2xl mx-auto">
            Let's discuss how AI can transform your business
          </p>
          <Link href="/contact?type=ai-automations">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:bg-white/90 transition-colors"
            >
              Start Your AI Project
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
