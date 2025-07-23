"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// Helper components for structure, replacing FormSection and FormField
const FormSection = ({
  title,
  description,
  children,
}: { title: string; description: string; children: React.ReactNode }) => (
  <div className="space-y-2 border-t border-white/10 pt-6 first:border-t-0 first:pt-0">
    <div>
      <h4 className="font-semibold text-white">{title}</h4>
      <p className="text-sm text-subtle-gray">{description}</p>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
)

const FormField = ({
  name,
  label,
  type = "text",
  placeholder,
  required,
  helpText,
  rows,
  options,
  value,
  onChange,
  onValueChange,
}: any) => (
  <div>
    <Label htmlFor={name} className="text-white">
      {label}
    </Label>
    {type === "select" ? (
      <Select name={name} required={required} value={value as string} onValueChange={onValueChange}>
        <SelectTrigger id={name} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option: any) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : type === "textarea" ? (
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
      />
    ) : (
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
    )}
    {helpText && <p className="text-xs text-subtle-gray mt-1.5">{helpText}</p>}
  </div>
)

export default function DemoModal({
  isOpen,
  onClose,
  onDemoStarted,
}: {
  isOpen: boolean
  onClose: () => void
  onDemoStarted: (leadId: string) => void
}) {
  const { toast } = useToast()
  const initialFormData = {
    fullName: "",
    email: "",
    phone: "",
    budget: "",
    propertyType: "",
    bedrooms: "",
    location: "",
    timeline: "",
    inquiryType: "",
    preApproved: "",
    currentSituation: "",
    message: "",
  }
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form options (same as before)
  const budgetOptions = [
    { value: "Under $300K", label: "Under $300,000" },
    { value: "$300K - $500K", label: "$300,000 - $500,000" },
    { value: "$500K - $750K", label: "$500,000 - $750,000" },
    { value: "$750K - $1M", label: "$750,000 - $1,000,000" },
    { value: "$1M - $2M", label: "$1,000,000 - $2,000,000" },
    { value: "$2M - $5M", label: "$2,000,000 - $5,000,000" },
    { value: "$5M+", label: "Over $5,000,000" },
  ]
  const propertyTypeOptions = [
    { value: "Single Family Home", label: "House (Single Family)" },
    { value: "Condo/Apartment", label: "Condo or Apartment" },
    { value: "Townhouse", label: "Townhouse" },
    { value: "Multi-Family", label: "Duplex/Multi-Family" },
    { value: "Luxury Home", label: "Luxury Home" },
    { value: "Investment Property", label: "Investment Property" },
  ]
  const bedroomOptions = [
    { value: "1", label: "1 bedroom" },
    { value: "2", label: "2 bedrooms" },
    { value: "3", label: "3 bedrooms" },
    { value: "4", label: "4 bedrooms" },
    { value: "5", label: "5 bedrooms" },
    { value: "6+", label: "6 or more bedrooms" },
  ]
  const timelineOptions = [
    { value: "ASAP", label: "As soon as possible (ready now!)" },
    { value: "1-3 months", label: "Within 1-3 months" },
    { value: "3-6 months", label: "In 3-6 months" },
    { value: "6-12 months", label: "6 months to 1 year" },
    { value: "12+ months", label: "More than a year from now" },
    { value: "Just browsing", label: "Just looking around for now" },
  ]
  const inquiryTypeOptions = [
    { value: "Ready to buy", label: "I'm ready to make an offer" },
    { value: "Exploring options", label: "I'm seriously looking" },
    { value: "First time buyer", label: "I'm a first-time home buyer" },
    { value: "Relocation", label: "I'm moving for work or family" },
    { value: "Upgrading", label: "I want to upgrade my home" },
    { value: "Investment research", label: "Looking for investments" },
    { value: "General interest", label: "Just curious" },
  ]
  const preApprovedOptions = [
    { value: "Yes", label: "Yes, I'm pre-approved" },
    { value: "In process", label: "I'm getting pre-approved now" },
    { value: "Need help", label: "I need help getting pre-approved" },
    { value: "Cash buyer", label: "I'm paying cash" },
    { value: "Not yet", label: "Haven't started yet" },
  ]
  const currentSituationOptions = [
    { value: "Renting", label: "I'm currently renting" },
    { value: "Own and selling", label: "I own a home and will sell it" },
    { value: "Own and keeping", label: "I own a home and will keep it" },
    { value: "Living with family", label: "Living with family or friends" },
    { value: "Other", label: "Other" },
  ]

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  // Effect to control body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = "" // Clean up on unmount
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const fillSampleData = () => {
    setFormData({
      fullName: "Alex Morgan",
      email: "alex.morgan@example.com",
      phone: "(555) 876-5432",
      budget: "$1M - $2M",
      propertyType: "Luxury Home",
      bedrooms: "4",
      location: "Miami Beach, FL",
      timeline: "ASAP",
      inquiryType: "Ready to buy",
      preApproved: "Cash buyer",
      currentSituation: "Own and keeping",
      message:
        "I'm a cash buyer looking for a waterfront property with at least 4 bedrooms in Miami Beach. I'm ready to make an offer immediately for the right place. A modern design is a must.",
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const leadId = `demo_web_${Date.now()}`

    try {
      const response = await fetch("/api/proxy-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, leadId, source: "Website Demo Form V2" }),
      })

      const responseData = await response.json()
      console.log("Frontend received response from proxy:", responseData)

      if (!response.ok) {
        throw new Error(responseData.message || "Webhook submission failed via proxy.")
      }

      toast({
        title: "🚀 Workflow Started!",
        description: "Your lead is being processed. Watch the magic happen!",
      })
      onDemoStarted(leadId)
      onClose()
      setFormData(initialFormData)
    } catch (error) {
      console.error("Submission error:", error)
      const errorMessage = error instanceof Error ? error.message : "Could not start the demo. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-black border border-white/20 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Launch Live Demo</h3>
                  <p className="text-sm text-subtle-gray">Fill out the form to trigger the AI pipeline.</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <Button type="button" variant="outline" onClick={fillSampleData} className="w-full mb-6 bg-transparent">
                📝 Try with Sample Data
              </Button>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormSection title="Tell Us About You" description="We'll help you find your perfect home">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="fullName"
                      label="Your Full Name"
                      placeholder="e.g., John Smith"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    <FormField
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="john@email.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <FormField
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </FormSection>

                <FormSection
                  title="What's Your Dream Home Like?"
                  description="Help us understand what you're looking for"
                >
                  <FormField
                    name="budget"
                    label="What's your budget?"
                    type="select"
                    required
                    helpText="This helps us show you the right homes"
                    placeholder="Select your budget range"
                    options={budgetOptions}
                    value={formData.budget}
                    onValueChange={handleSelectChange("budget")}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="propertyType"
                      label="What type of home?"
                      type="select"
                      required
                      placeholder="Choose home type"
                      options={propertyTypeOptions}
                      value={formData.propertyType}
                      onValueChange={handleSelectChange("propertyType")}
                    />
                    <FormField
                      name="bedrooms"
                      label="How many bedrooms?"
                      type="select"
                      placeholder="Any number is fine"
                      options={bedroomOptions}
                      value={formData.bedrooms}
                      onValueChange={handleSelectChange("bedrooms")}
                    />
                  </div>
                  <FormField
                    name="location"
                    label="Where do you want to live?"
                    placeholder="City, neighborhood, or zip code"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </FormSection>

                <FormSection title="When Do You Need to Move?" description="This helps us prioritize your search">
                  <FormField
                    name="timeline"
                    label="When do you want to buy?"
                    type="select"
                    required
                    helpText="Be honest - there's no wrong answer!"
                    placeholder="Select your timeline"
                    options={timelineOptions}
                    value={formData.timeline}
                    onValueChange={handleSelectChange("timeline")}
                  />
                  <FormField
                    name="inquiryType"
                    label="What best describes your situation?"
                    type="select"
                    required
                    placeholder="Choose what fits you best"
                    options={inquiryTypeOptions}
                    value={formData.inquiryType}
                    onValueChange={handleSelectChange("inquiryType")}
                  />
                </FormSection>

                <FormSection title="Financing Info (Optional)" description="Helps us serve you better">
                  <FormField
                    name="preApproved"
                    label="Are you pre-approved for a mortgage?"
                    type="select"
                    helpText="Don't worry if not - we can help!"
                    placeholder="Select if applicable"
                    options={preApprovedOptions}
                    value={formData.preApproved}
                    onValueChange={handleSelectChange("preApproved")}
                  />
                  <FormField
                    name="currentSituation"
                    label="What's your current housing situation?"
                    type="select"
                    placeholder="Select if applicable"
                    options={currentSituationOptions}
                    value={formData.currentSituation}
                    onValueChange={handleSelectChange("currentSituation")}
                  />
                </FormSection>

                <FormSection title="Anything Else?" description="Help us find your perfect match">
                  <FormField
                    name="message"
                    label="Tell us about your dream home"
                    type="textarea"
                    placeholder="Example: 'We need a big backyard for our kids...'"
                    rows={4}
                    helpText="The more details, the better!"
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </FormSection>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Launch Live Demo"}
                </Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
