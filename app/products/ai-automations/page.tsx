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
              Built to automate together{' '}
              <span className="block mt-2">as one.</span>
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
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                icon: Brain,
                iconBg: "bg-green-500",
                title: "AI handles most customer queries.",
                desc: "Resolving complex queries and handing off to your team when needed."
              },
              {
                icon: MessageSquare,
                iconBg: "bg-red-medium",
                title: "Human agents focus on priority issues.",
                desc: "Using AI-powered tools to investigate and resolve them more efficiently."
              },
              {
                icon: Sparkles,
                iconBg: "bg-blue-500",
                title: "The system improves with every resolution.",
                desc: "AI gets better by learning from your best answers, and human agents get better by using AI—resulting in better service for your customers."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl p-6"
              >
                <div className={`w-10 h-10 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-base leading-relaxed">
                  {feature.desc}
                </p>
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
              className="bg-white/10 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/15 transition-colors border border-white/20"
            >
              View AI Demos
            </motion.button>
          </Link>
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
            { icon: Brain, title: "Custom AI Models", desc: "Tailored machine learning solutions for your specific needs", features: ["Model training", "Fine-tuning", "Data analysis"], badge: "ML/AI", stat: "Custom Trained" },
            { icon: MessageSquare, title: "Conversational AI", desc: "Intelligent chatbots and virtual assistants", features: ["NLP processing", "Multi-language", "Context awareness"], badge: "Chatbots", stat: "24/7 Available" },
            { icon: Workflow, title: "AI Workflow Automation", desc: "Automate complex business processes with AI", features: ["Document processing", "Data extraction", "Smart routing"], badge: "Automation", stat: "10x Faster" },
            { icon: Bot, title: "Computer Vision", desc: "Image and video analysis for your applications", features: ["Object detection", "Face recognition", "Quality inspection"], badge: "Vision", stat: "Real-time" },
            { icon: Brain, title: "Predictive Analytics", desc: "Forecast trends and make data-driven decisions", features: ["Sales forecasting", "Risk assessment", "Anomaly detection"], badge: "Analytics", stat: "Data-Driven" },
            { icon: Sparkles, title: "Document Intelligence", desc: "Extract insights from documents automatically", features: ["OCR processing", "Data extraction", "Summarization"], badge: "Documents", stat: "99% Accuracy" }
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
                <h3 className="text-white text-2xl font-semibold mb-4">
                  {solution.title}
                </h3>
                <p className="text-white/60 text-base mb-4 leading-relaxed">
                  {solution.desc}
                </p>
                
                <p className="text-red-medium font-semibold text-sm mb-6">{solution.stat}</p>
                
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
                    ? 'bg-red-medium text-white'
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
                <h4 className="text-sm font-semibold text-red-medium mb-2">THE CHALLENGE</h4>
                <p className="text-gray-300">{[
                  { industry: "E-Commerce Example", challenge: "Manual product categorization taking hours", solution: "Custom AI model for automatic product classification and tagging", results: ["Target 95% accuracy", "10x faster processing", "Save 40 hours/week"] },
                  { industry: "Healthcare Example", challenge: "Medical document processing bottleneck", solution: "Custom AI document intelligence system with HIPAA compliance", results: ["90% time reduction goal", "Target 99.8% accuracy", "Fully HIPAA compliant"] },
                  { industry: "Finance Example", challenge: "Fraud detection taking too long", solution: "Custom real-time AI fraud detection system", results: ["Real-time detection", "Reduce false positives", "Significant cost savings"] }
                ][activeCase].challenge}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-medium mb-2">CUSTOM SOLUTION APPROACH</h4>
                <p className="text-gray-300">{[
                  { industry: "E-Commerce Example", challenge: "Manual product categorization taking hours", solution: "Custom AI model for automatic product classification and tagging", results: ["Target 95% accuracy", "10x faster processing", "Save 40 hours/week"] },
                  { industry: "Healthcare Example", challenge: "Medical document processing bottleneck", solution: "Custom AI document intelligence system with HIPAA compliance", results: ["90% time reduction goal", "Target 99.8% accuracy", "Fully HIPAA compliant"] },
                  { industry: "Finance Example", challenge: "Fraud detection taking too long", solution: "Custom real-time AI fraud detection system", results: ["Real-time detection", "Reduce false positives", "Significant cost savings"] }
                ][activeCase].solution}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-medium mb-2">POTENTIAL RESULTS</h4>
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
