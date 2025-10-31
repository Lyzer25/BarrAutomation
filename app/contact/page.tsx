"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import ContactForm from "@/components/contact/ContactForm"
import DiscoveryStepper from "@/components/contact/DiscoveryStepper"
import type { ContactBasicsInput, DiscoveryAnswersInput } from "@/lib/validators/contact"

export default function ContactPage() {
  const [currentSection, setCurrentSection] = useState<"contact" | "discovery">("contact")
  const [contactBasics, setContactBasics] = useState<ContactBasicsInput | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleContactSubmit = async (data: ContactBasicsInput, type: "simple" | "custom") => {
    if (type === "simple") {
      // Simple contact: send directly to API without discovery questions
      await handleSimpleContactSubmit(data)
    } else {
      // Custom solution: proceed to discovery questions
      setContactBasics(data)
      setCurrentSection("discovery")

      // Smooth scroll to discovery section
      setTimeout(() => {
        document.getElementById("discovery-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }

  const handleSimpleContactSubmit = async (data: ContactBasicsInput) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.ok) {
        toast({
          title: "Thanks! We'll reach out shortly.",
          description: "We'll follow up within 1 business day.",
        })

        // Scroll back to top
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        throw new Error(result.error || "Submission failed")
      }
    } catch (error: any) {
      console.error("contact_submit_error:", error)

      // Handle rate limiting specifically
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

  const handleDiscoverySubmit = async (data: ContactBasicsInput & DiscoveryAnswersInput) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.ok) {
        toast({
          title: "Thanks! We'll reach out shortly.",
          description: "We'll follow up within 1 business day with next steps.",
        })

        // Reset forms
        setContactBasics(null)
        setCurrentSection("contact")

        // Scroll back to top
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        throw new Error(result.error || "Submission failed")
      }
    } catch (error: any) {
      console.error("contact_submit_error:", error)

      // Handle rate limiting specifically
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
      {/* Section A: Quick Contact */}
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="font-mono text-4xl font-thin text-white md:text-5xl">Let's Build Your Automation</h1>
          <p className="mt-4 text-lg text-subtle-gray">
            Tell us how to reach you. Choose "Contact Us" for a quick message, or "Build My Custom Solution" to answer a
            few questions for a personalized automation plan.
          </p>
        </div>

        <div className="mt-12">
          <ContactForm onSubmit={handleContactSubmit} isLoading={isSubmitting} />
        </div>
      </div>

      {/* Section B: Discovery Stepper */}
      {contactBasics && (
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
