"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import LogoCarousel from "@/components/logo-carousel"
import Link from "next/link"
import { Brain, MessageSquare, Workflow, Bot, Sparkles, Check } from 'lucide-react'

const stats = [
  { icon: Bot, value: "24/7", label: "AI Availability" },
  { icon: Sparkles, value: "10x", label: "Potential Efficiency" },
]

export default function AIAutomationsPage() {
  const [activeCase, setActiveCase] = useState(0)

  return (
    <div className="min-h-screen bg-black">
      <section className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1 className="font-sans text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
            AI Automations
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
            Custom AI solutions built specifically for your business needs
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
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
                className="bg-white/10 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/15 transition-colors"
              >
                View AI Demos
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <section className="py-12 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <stat.icon className="h-10 w-10 text-accent mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-subtle-gray">{stat.label}</p>
              </motion.div>
            ))}
          </div>
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

      <section className="container mx-auto px-4 py-20 bg-black/20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Custom AI Capabilities</h2>
          <p className="mt-4 text-subtle-gray max-w-2xl mx-auto">
            Every AI solution is custom-built for your specific use case
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: "Custom AI Models", desc: "Tailored machine learning solutions for your specific needs", features: ["Model training", "Fine-tuning", "Data analysis"] },
            { icon: MessageSquare, title: "Conversational AI", desc: "Intelligent chatbots and virtual assistants", features: ["NLP processing", "Multi-language", "Context awareness"] },
            { icon: Workflow, title: "AI Workflow Automation", desc: "Automate complex business processes with AI", features: ["Document processing", "Data extraction", "Smart routing"] },
            { icon: Bot, title: "Computer Vision", desc: "Image and video analysis for your applications", features: ["Object detection", "Face recognition", "Quality inspection"] },
            { icon: Brain, title: "Predictive Analytics", desc: "Forecast trends and make data-driven decisions", features: ["Sales forecasting", "Risk assessment", "Anomaly detection"] },
            { icon: Sparkles, title: "Document Intelligence", desc: "Extract insights from documents automatically", features: ["OCR processing", "Data extraction", "Summarization"] }
          ].map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-8 text-center max-w-4xl mx-auto">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <solution.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white text-2xl font-semibold mb-4">
                  {solution.title}
                </h3>
                <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                  {solution.desc}
                </p>
                <ul className="space-y-2">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-white/80">
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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            Example AI Use Cases
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            See how custom AI solutions could transform businesses across industries
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {[
              { industry: "E-Commerce Example", challenge: "Manual product categorization taking hours", solution: "Custom AI model for automatic product classification and tagging", results: ["Target 95% accuracy", "10x faster processing", "Save 40 hours/week"] },
              { industry: "Healthcare Example", challenge: "Medical document processing bottleneck", solution: "Custom AI document intelligence system with HIPAA compliance", results: ["90% time reduction goal", "Target 99.8% accuracy", "Fully HIPAA compliant"] },
              { industry: "Finance Example", challenge: "Fraud detection taking too long", solution: "Custom real-time AI fraud detection system", results: ["Real-time detection", "Reduce false positives", "Significant cost savings"] }
            ].map((useCase, index) => (
              <button
                key={index}
                onClick={() => setActiveCase(index)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeCase === index
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {useCase.industry}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <motion.div
            key={activeCase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">THE CHALLENGE</h4>
                <p className="text-gray-300">{[
                  { industry: "E-Commerce Example", challenge: "Manual product categorization taking hours", solution: "Custom AI model for automatic product classification and tagging", results: ["Target 95% accuracy", "10x faster processing", "Save 40 hours/week"] },
                  { industry: "Healthcare Example", challenge: "Medical document processing bottleneck", solution: "Custom AI document intelligence system with HIPAA compliance", results: ["90% time reduction goal", "Target 99.8% accuracy", "Fully HIPAA compliant"] },
                  { industry: "Finance Example", challenge: "Fraud detection taking too long", solution: "Custom real-time AI fraud detection system", results: ["Real-time detection", "Reduce false positives", "Significant cost savings"] }
                ][activeCase].challenge}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">CUSTOM SOLUTION APPROACH</h4>
                <p className="text-gray-300">{[
                  { industry: "E-Commerce Example", challenge: "Manual product categorization taking hours", solution: "Custom AI model for automatic product classification and tagging", results: ["Target 95% accuracy", "10x faster processing", "Save 40 hours/week"] },
                  { industry: "Healthcare Example", challenge: "Medical document processing bottleneck", solution: "Custom AI document intelligence system with HIPAA compliance", results: ["90% time reduction goal", "Target 99.8% accuracy", "Fully HIPAA compliant"] },
                  { industry: "Finance Example", challenge: "Fraud detection taking too long", solution: "Custom real-time AI fraud detection system", results: ["Real-time detection", "Reduce false positives", "Significant cost savings"] }
                ][activeCase].solution}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">POTENTIAL RESULTS</h4>
                <ul className="space-y-2">
                  {[
                    { industry: "E-Commerce Example", challenge: "Manual product categorization taking hours", solution: "Custom AI model for automatic product classification and tagging", results: ["Target 95% accuracy", "10x faster processing", "Save 40 hours/week"] },
                    { industry: "Healthcare Example", challenge: "Medical document processing bottleneck", solution: "Custom AI document intelligence system with HIPAA compliance", results: ["90% time reduction goal", "Target 99.8% accuracy", "Fully HIPAA compliant"] },
                    { industry: "Finance Example", challenge: "Fraud detection taking too long", solution: "Custom real-time AI fraud detection system", results: ["Real-time detection", "Reduce false positives", "Significant cost savings"] }
                  ][activeCase].results.map((result, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
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
              { number: "04", title: "Deploy", desc: "Integration and ongoing optimization" }
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
          <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto">
            Let's discuss how AI can transform your business
          </p>
          <Link href="/contact">
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
