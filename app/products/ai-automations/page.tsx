'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Brain, Zap, Workflow, Database, MessageSquare, Image, FileText, ArrowRight, Check, Star, Bot } from 'lucide-react'
import Link from 'next/link'

export default function AIAutomationsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const aiSolutions = [
    {
      icon: Brain,
      title: "Custom AI Models",
      description: "Tailored machine learning solutions for your specific needs",
      features: ["Model training", "Fine-tuning", "Data analysis", "Performance optimization"],
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: MessageSquare,
      title: "Conversational AI",
      description: "Intelligent chatbots and virtual assistants",
      features: ["Natural language processing", "Multi-language support", "Context awareness", "Integration ready"],
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Workflow,
      title: "AI Workflow Automation",
      description: "Automate complex business processes with AI",
      features: ["Document processing", "Data extraction", "Smart routing", "Decision automation"],
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Image,
      title: "Computer Vision",
      description: "Image and video analysis for your applications",
      features: ["Object detection", "Face recognition", "Quality inspection", "Content moderation"],
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Database,
      title: "Predictive Analytics",
      description: "Forecast trends and make data-driven decisions",
      features: ["Sales forecasting", "Risk assessment", "Anomaly detection", "Customer insights"],
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: FileText,
      title: "Document Intelligence",
      description: "Extract insights from documents automatically",
      features: ["OCR processing", "Data extraction", "Classification", "Summarization"],
      gradient: "from-red-500 to-orange-500"
    }
  ]

  const integrations = [
    "OpenAI", "Anthropic", "Google Gemini", "AWS Bedrock",
    "Hugging Face", "TensorFlow", "PyTorch", "LangChain",
    "Pinecone", "Weaviate", "ChromaDB", "Azure AI"
  ]

  const useCases = [
    {
      industry: "E-Commerce",
      challenge: "Manual product categorization taking hours",
      solution: "Custom AI model for automatic product classification and tagging",
      results: ["95% accuracy", "10x faster processing", "Saved 40 hours/week"]
    },
    {
      industry: "Healthcare",
      challenge: "Medical document processing bottleneck",
      solution: "Custom AI document intelligence system with HIPAA compliance",
      results: ["90% time reduction", "99.8% accuracy", "Fully HIPAA compliant"]
    },
    {
      industry: "Finance",
      challenge: "Fraud detection taking too long",
      solution: "Custom real-time AI fraud detection system",
      results: ["Real-time detection", "85% false positive reduction", "$500k saved annually"]
    }
  ]

  const [activeCase, setActiveCase] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 py-24 mx-auto max-w-7xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-red-900/30 border border-red-500/30 rounded-full text-red-400 text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            CUSTOM AI SOLUTIONS TAILORED TO YOUR BUSINESS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              AI Automations
            </span>
            <br />
            <span className="text-white">Built for Your Business</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            From intelligent chatbots to predictive analytics, we build custom AI solutions 
            that transform your operations. Leverage the power of AI tailored to your unique needs.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-red-500/25 transition-all">
                Discuss Your AI Project
              </button>
            </Link>
            <Link href="/demos">
              <button className="px-8 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-all">
                View AI Demos
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              { number: "50+", label: "AI Projects Delivered" },
              { number: "95%", label: "Average Accuracy" },
              { number: "10x", label: "Efficiency Gain" },
              { number: "24/7", label: "AI Availability" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-red-400">{stat.number}</div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* AI Solutions Grid */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-white"
        >
          Custom AI <span className="text-red-400">Solutions</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiSolutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                hoveredCard === index 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-red-400 shadow-2xl shadow-red-400/20' 
                  : 'bg-gray-900/50 border-gray-800'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${solution.gradient} p-3 mb-6`}>
                <solution.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
              <p className="text-gray-400 mb-6">{solution.description}</p>
              <ul className="space-y-2">
                {solution.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
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
            Real-World AI Success Stories
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            See how custom AI solutions have transformed businesses across industries
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center flex-wrap space-x-4 mb-12">
            {useCases.map((useCase, index) => (
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
                <p className="text-gray-300">{useCases[activeCase].challenge}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">OUR CUSTOM SOLUTION</h4>
                <p className="text-gray-300">{useCases[activeCase].solution}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">THE RESULTS</h4>
                <ul className="space-y-2">
                  {useCases[activeCase].results.map((result, idx) => (
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

      {/* AI Integrations */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-8 text-white">
            Powered by <span className="text-red-400">Leading AI Technology</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            We integrate with the best AI platforms and frameworks to build custom solutions
            that leverage cutting-edge technology.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-3 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors"
              >
                {integration}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12"
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            From Concept to <span className="text-red-400">Custom AI Solution</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", desc: "Understanding your data and goals" },
              { step: "02", title: "Design", desc: "Custom AI architecture planning" },
              { step: "03", title: "Training", desc: "Model development and fine-tuning" },
              { step: "04", title: "Deploy", desc: "Integration and continuous optimization" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-red-400 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">
          Custom AI <span className="text-red-400">Pricing</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "AI Starter",
              price: "$5,000",
              description: "Perfect for small AI projects",
              features: ["Simple AI model", "Basic integration", "2 weeks delivery", "1 month support", "Documentation"]
            },
            {
              name: "AI Professional",
              price: "$15,000",
              description: "For complex AI solutions",
              features: ["Custom AI model", "Advanced integration", "Data pipeline setup", "6 weeks delivery", "3 months support", "Performance monitoring"],
              popular: true
            },
            {
              name: "AI Enterprise",
              price: "Custom",
              description: "Large-scale AI systems",
              features: ["Multiple AI models", "Full system integration", "Continuous training", "Dedicated team", "12 months support", "SLA guarantee", "Custom features"]
            }
          ].map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                tier.popular 
                  ? 'bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-400' 
                  : 'bg-gray-900/50 border-gray-800'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-red-400 text-white text-sm font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="text-4xl font-bold text-red-400 mb-2">{tier.price}</div>
              <p className="text-gray-400 mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  tier.popular
                    ? 'bg-red-400 text-white hover:bg-red-300'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}>
                  Get Started
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-3xl p-12 text-center"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <Bot className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Your Custom AI Solution?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let's discuss how AI can transform your business with a custom solution tailored to your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <button className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Start Your AI Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="/integrations">
                <button className="px-8 py-4 bg-black/30 text-white font-bold rounded-lg hover:bg-black/40 transition-colors border border-white/20">
                  View AI Integrations
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
