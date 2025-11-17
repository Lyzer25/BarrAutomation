'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Brain, MessageSquare, Workflow, ArrowRight, Check, Bot } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AIAutomationsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeCase, setActiveCase] = useState(0)

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
            <Sparkles className="w-4 h-4" />
            AI Automations
          </div>
          
          <h1 className="font-mono text-4xl font-thin text-white md:text-6xl lg:text-7xl">
            Custom AI Solutions{' '}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Built for You
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-subtle-gray max-w-3xl mx-auto">
            From intelligent chatbots to predictive analytics, we build custom AI solutions that transform your operations. Leverage the power of AI tailored to your unique needs.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="animate-pulse-glow">
              <Link href="/contact">Discuss Your AI Project</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demos">View AI Demos</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "Custom", label: "AI Solutions" },
              { value: "95%+", label: "Target Accuracy" },
              { value: "10x", label: "Potential Efficiency" },
              { value: "24/7", label: "AI Availability" }
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

      {/* AI Solutions Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl font-thin text-white md:text-4xl">Custom AI Solutions</h2>
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
              <Card className="group bg-black/80 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 h-full hover:shadow-2xl hover:shadow-accent/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                    <solution.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white group-hover:text-accent transition-colors">
                    {solution.title}
                  </CardTitle>
                  <CardDescription className="text-subtle-gray group-hover:text-white/80 transition-colors">
                    {solution.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {solution.features.map((feature, idx) => (
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
            See how custom AI solutions can transform businesses across industries
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center flex-wrap space-x-4 mb-12">
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
            whileInView={{ opacity: 1, x: 0 }}
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
              { number: "01", title: "Discovery", desc: "Understanding your data and goals" },
              { number: "02", title: "Design", desc: "Custom AI architecture planning" },
              { number: "03", title: "Training", desc: "Model development and fine-tuning" },
              { number: "04", title: "Deploy", desc: "Integration and optimization" }
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Custom AI Solution?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let's discuss how AI can transform your business with a solution tailored to your needs
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-black hover:bg-gray-100">
            <Link href="/contact">
              Start Your AI Project <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  )
}
