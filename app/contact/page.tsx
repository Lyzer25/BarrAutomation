"use client"

import { useState, useRef, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import ContactForm, { type ContactFormHandle } from "@/components/contact/ContactForm"
import DiscoveryStepper from "@/components/contact/DiscoveryStepper"
import WebDevContactForm, { type WebDevContactFormHandle } from "@/components/contact/WebDevContactForm"
import SoftwareToolsContactForm, {
  type SoftwareToolsContactFormHandle,
} from "@/components/contact/SoftwareToolsContactForm"
import ScriptsContactForm, { type ScriptsContactFormHandle } from "@/components/contact/ScriptsContactForm"
import type { ContactBasicsInput, DiscoveryAnswersInput } from "@/lib/validators/contact"
import { CheckCircle2, ArrowLeft, Code, Cpu, Zap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

type InquiryCategory = "web-dev" | "software-tools" | "scripts" | "ai-automations"

export default function ContactPage() {
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory | null>(null)
  const [currentSection, setCurrentSection] = useState<"contact" | "discovery" | "success">("contact")
  const [contactBasics, setContactBasics] = useState<ContactBasicsInput | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const contactFormRef = useRef<ContactFormHandle>(null)
  const webDevFormRef = useRef<WebDevContactFormHandle>(null)
  const softwareToolsFormRef = useRef<SoftwareToolsContactFormHandle>(null)
  const scriptsFormRef = useRef<ScriptsContactFormHandle>(null)

  const categories = [
    { id: "web-dev" as InquiryCategory, label: "Web Development", icon: Code },
    { id: "software-tools" as InquiryCategory, label: "Software & Tools", icon: Cpu },
    { id: "scripts" as InquiryCategory, label: "Scripts & Automation", icon: Zap },
    { id: "ai-automations" as InquiryCategory, label: "AI Automations", icon: Sparkles },
  ]

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const category = params.get("type") as InquiryCategory
    if (category && ["web-dev", "software-tools", "scripts", "ai-automations"].includes(category)) {
      setSelectedCategory(category)
    } else if (selectedCategory === null) {
      setSelectedCategory("ai-automations")
    }
  }, [])

  const handleSimpleContactSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      const payload = {
        ...data,
        category: selectedCategory,
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.ok) {
        // Clear the appropriate form
        if (selectedCategory === "ai-automations") contactFormRef.current?.reset()
        else if (selectedCategory === "web-dev") webDevFormRef.current?.reset()
        else if (selectedCategory === "software-tools") softwareToolsFormRef.current?.reset()
        else if (selectedCategory === "scripts") scriptsFormRef.current?.reset()

        setCurrentSection("success")
        toast({
          title: "Message sent successfully!",
          description: "We'll follow up within 1 business day.",
        })
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        throw new Error(result.error || "Submission failed")
      }
    } catch (error: any) {
      console.error("contact_submit_error:", error)

      if (error.message?.includes("Too many requests")) {
        toast({
          title: "Please wait a moment",
          description: "You're submitting too quickly. Please wait 10 seconds and try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Submission Error",
          description: "Something went wrong. Please try again or contact us directly.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactSubmit = async (data: ContactBasicsInput, type: "simple" | "custom") => {
    if (type === "simple") {
      await handleSimpleContactSubmit(data)
    } else {
      // Custom solution: proceed to discovery questions (AI Automations only)
      setContactBasics(data)
      setCurrentSection("discovery")

      setTimeout(() => {
        document.getElementById("discovery-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }

  const handleDiscoverySubmit = async (data: ContactBasicsInput & DiscoveryAnswersInput) => {
    setIsSubmitting(true)

    try {
      const payload = {
        ...data,
        category: "ai-automations",
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.ok) {
        contactFormRef.current?.reset()
        setCurrentSection("success")
        setContactBasics(null)

        toast({
          title: "Custom solution request sent!",
          description: "We'll follow up within 1 business day with next steps.",
        })

        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        throw new Error(result.error || "Submission failed")
      }
    } catch (error: any) {
      console.error("contact_submit_error:", error)

      if (error.message?.includes("Too many requests")) {
        toast({
          title: "Please wait a moment",
          description: "You're submitting too quickly. Please wait 10 seconds and try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Submission Error",
          description: "Something went wrong. Please try again or contact us directly.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Success State */}
      {currentSection === "success" && (
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="font-mono text-4xl font-thin text-white md:text-5xl mb-4">Message Sent Successfully!</h1>
          <p className="text-lg text-subtle-gray mb-8">
            Thank you for reaching out. We'll get back to you within 1 business day.
          </p>
          <Button
            onClick={() => setCurrentSection("contact")}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Send Another Message
          </Button>
        </div>
      )}

      {/* Contact Form Section */}
      {currentSection === "contact" && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="font-mono text-4xl font-thin text-white md:text-5xl">Get In Touch</h1>
            <p className="mt-4 text-lg text-subtle-gray">
              Select the service you're interested in, then tell us about your project
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = selectedCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    isActive
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-white/20 text-white hover:border-white/40"
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? "text-accent" : "text-white/60"}`} />
                  <div className="text-sm font-medium text-center">{category.label}</div>
                </button>
              )
            })}
          </div>

          <div className="mt-12">
            {selectedCategory === "ai-automations" && (
              <ContactForm ref={contactFormRef} onSubmit={handleContactSubmit} isLoading={isSubmitting} />
            )}
            {selectedCategory === "web-dev" && (
              <WebDevContactForm ref={webDevFormRef} onSubmit={handleSimpleContactSubmit} isLoading={isSubmitting} />
            )}
            {selectedCategory === "software-tools" && (
              <SoftwareToolsContactForm
                ref={softwareToolsFormRef}
                onSubmit={handleSimpleContactSubmit}
                isLoading={isSubmitting}
              />
            )}
            {selectedCategory === "scripts" && (
              <ScriptsContactForm ref={scriptsFormRef} onSubmit={handleSimpleContactSubmit} isLoading={isSubmitting} />
            )}
          </div>
        </div>
      )}

      {/* Discovery Stepper (AI Automations only) */}
      {contactBasics && currentSection === "discovery" && (
        <div id="discovery-section" className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-white">Discovery Questions</h2>
            <p className="mt-2 text-subtle-gray">Help us understand your automation needs better</p>
          </div>

          <DiscoveryStepper contactBasics={contactBasics} onSubmit={handleDiscoverySubmit} isLoading={isSubmitting} />
        </div>
      )}
    </div>
  )
}
