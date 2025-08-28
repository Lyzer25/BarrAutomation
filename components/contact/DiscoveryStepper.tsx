"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Stepper } from "@/components/ui/stepper"
import { discoveryAnswersSchema, type DiscoveryAnswersInput } from "@/lib/validators/contact"
import { ContactBasicsInput } from "@/lib/validators/contact"

interface DiscoveryStepperProps {
  contactBasics: ContactBasicsInput
  onSubmit: (data: ContactBasicsInput & DiscoveryAnswersInput) => void
  isLoading?: boolean
}

const STEPS = [
  { id: "hours", title: "Hours Focus" },
  { id: "followup", title: "Follow-up Pain" },
  { id: "lookups", title: "Repeated Lookups" },
  { id: "process", title: "Single Point Process" },
  { id: "kpis", title: "Morning KPIs" },
  { id: "integrations", title: "Integrations" },
  { id: "review", title: "Review & Send" },
]

const HOURS_OPTIONS = [
  "Sales",
  "Service/Support", 
  "Ops/Admin",
  "Marketing",
  "Finance",
  "Other"
]

const FOLLOWUP_OPTIONS = [
  "Lead response",
  "Abandoned carts",
  "Onboarding",
  "Billing",
  "Ticket routing",
  "Other"
]

const INTEGRATION_OPTIONS = [
  "Slack", "Telegram", "Gmail", "Google Sheets", "Google Calendar", "Trello", "Jira", 
  "HubSpot", "Monica CRM", "Stripe", "Shopify", "Discord", "Twilio", "Notion", 
  "Airtable", "MySQL", "Postgres", "S3", "Webhook", "HTTP Request", "QuickBooks", "Xero", "Calendly"
]

export default function DiscoveryStepper({ contactBasics, onSubmit, isLoading }: DiscoveryStepperProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [otherHours, setOtherHours] = useState("")
  const [otherFollowup, setOtherFollowup] = useState("")
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DiscoveryAnswersInput>({
    resolver: zodResolver(discoveryAnswersSchema),
    mode: "onChange",
  })

  const watchedHours = watch("hoursFocus")
  const watchedFollowup = watch("followupPain")

  // Update form value when otherHours changes
  useEffect(() => {
    if (watchedHours === "Other" && otherHours) {
      setValue("hoursFocus", otherHours)
    }
  }, [otherHours, watchedHours, setValue])

  // Update form value when otherFollowup changes
  useEffect(() => {
    if (watchedFollowup?.includes("Other") && otherFollowup) {
      const current = watchedFollowup || []
      const withoutOther = current.filter(item => item !== "Other")
      const newSelection = [...withoutOther, otherFollowup]
      setValue("followupPain", newSelection)
    }
  }, [otherFollowup, watchedFollowup, setValue])

  const handleHoursSelect = (option: string) => {
    if (option === "Other") {
      // Don't set the value yet, wait for user to type in the other field
      setValue("hoursFocus", "Other")
    } else {
      setValue("hoursFocus", option)
      setOtherHours("")
    }
  }

  const handleFollowupSelect = (option: string) => {
    const current = watchedFollowup || []
    let newSelection: string[]
    
    if (option === "Other") {
      // If "Other" is already selected, remove it
      if (current.includes("Other")) {
        newSelection = current.filter(item => item !== "Other" && item !== otherFollowup)
      } else {
        // Add "Other" to selection
        newSelection = [...current, "Other"]
      }
    } else {
      if (current.includes(option)) {
        newSelection = current.filter(item => item !== option)
      } else {
        newSelection = [...current, option]
      }
    }
    
    setValue("followupPain", newSelection)
  }

  const handleIntegrationToggle = (integration: string) => {
    const current = selectedIntegrations
    if (current.includes(integration)) {
      const newSelection = current.filter(item => item !== integration)
      setSelectedIntegrations(newSelection)
      setValue("integrations", newSelection)
    } else {
      const newSelection = [...current, integration]
      setSelectedIntegrations(newSelection)
      setValue("integrations", newSelection)
    }
  }

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const handleFinalSubmit = (data: DiscoveryAnswersInput) => {
    const fullPayload = { ...contactBasics, ...data }
    onSubmit(fullPayload)
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Hours Focus
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Where would 20 extra hours/week matter most?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {HOURS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleHoursSelect(option)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-sm ${
                    watchedHours === option
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-white/20 text-white hover:border-white/40"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {watchedHours === "Other" && (
              <div className="mt-4">
                <Label htmlFor="otherHours" className="text-white">
                  Please specify:
                </Label>
                <Input
                  id="otherHours"
                  value={otherHours}
                  onChange={(e) => setOtherHours(e.target.value)}
                  className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
                  placeholder="e.g., Customer Success, Product Development"
                />
                {otherHours && (
                  <p className="text-xs text-accent mt-1">
                    ✓ Will use: "{otherHours}"
                  </p>
                )}
              </div>
            )}
          </div>
        )

      case 1: // Follow-up Pain
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Where do delays or missed follow-ups hurt?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {FOLLOWUP_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleFollowupSelect(option)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-sm ${
                    (watchedFollowup || []).includes(option)
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-white/20 text-white hover:border-white/40"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {(watchedFollowup || []).includes("Other") && (
              <div className="mt-4">
                <Label htmlFor="otherFollowup" className="text-white">
                  Please specify:
                </Label>
                <Input
                  id="otherFollowup"
                  value={otherFollowup}
                  onChange={(e) => setOtherFollowup(e.target.value)}
                  className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
                  placeholder="e.g., Project deadlines, Client communication"
                />
                {otherFollowup && (
                  <p className="text-xs text-accent mt-1">
                    ✓ Will use: "{otherFollowup}"
                  </p>
                )}
              </div>
            )}
          </div>
        )

      case 2: // Repeated Lookups
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              What info do you & team look up repeatedly?
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Examples: SOPs, order status, policies, customer history
            </p>
            <Textarea
              {...register("repeatedLookups")}
              rows={3}
              className="bg-black/50 border-white/20 focus:border-accent/50"
              placeholder="e.g., Customer refund policies, shipping status, pricing tiers..."
            />
          </div>
        )

      case 3: // Single Point Process
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              One process only a key person knows how to do?
            </h3>
            <p className="text-white/60 text-sm mb-4">
              These are perfect automation candidates
            </p>
            <Textarea
              {...register("singlePointProcess")}
              rows={3}
              className="bg-black/50 border-white/20 focus:border-accent/50"
              placeholder="e.g., Monthly report generation, invoice processing, customer onboarding..."
            />
          </div>
        )

      case 4: // Morning KPIs
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              If a morning dashboard showed top KPIs, what's on it?
            </h3>
            <p className="text-white/60 text-sm mb-4">
              What metrics would help you make better decisions?
            </p>
            <Textarea
              {...register("morningKPIs")}
              rows={3}
              className="bg-black/50 border-white/20 focus:border-accent/50"
              placeholder="e.g., Daily sales, response times, conversion rates, customer satisfaction..."
            />
          </div>
        )

      case 5: // Integrations
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Which tools do you use that we should connect?
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {INTEGRATION_OPTIONS.map((integration) => (
                <button
                  key={integration}
                  type="button"
                  onClick={() => handleIntegrationToggle(integration)}
                  className={`p-2 rounded border text-xs transition-all duration-200 ${
                    selectedIntegrations.includes(integration)
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-white/20 text-white hover:border-white/40"
                  }`}
                >
                  {integration}
                </button>
              ))}
            </div>
            <p className="text-white/60 text-xs">
              Selected: {selectedIntegrations.length} tools
            </p>
          </div>
        )

      case 6: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Review Your Discovery
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Contact Details</h4>
                <div className="text-sm text-white/80 space-y-1">
                  <p><strong>Name:</strong> {contactBasics.fullName}</p>
                  <p><strong>Email:</strong> {contactBasics.email}</p>
                  {contactBasics.phone && <p><strong>Phone:</strong> {contactBasics.phone}</p>}
                  {contactBasics.company && <p><strong>Company:</strong> {contactBasics.company}</p>}
                  {contactBasics.website && <p><strong>Website:</strong> {contactBasics.website}</p>}
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Discovery Answers</h4>
                <div className="text-sm text-white/80 space-y-2">
                  {watchedHours && <p><strong>Hours Focus:</strong> {watchedHours}</p>}
                  {(watchedFollowup || []).length > 0 && (
                    <p><strong>Follow-up Pain:</strong> {(watchedFollowup || []).join(", ")}</p>
                  )}
                  {watch("repeatedLookups") && <p><strong>Repeated Lookups:</strong> {watch("repeatedLookups")}</p>}
                  {watch("singlePointProcess") && <p><strong>Single Point Process:</strong> {watch("singlePointProcess")}</p>}
                  {watch("morningKPIs") && <p><strong>Morning KPIs:</strong> {watch("morningKPIs")}</p>}
                  {selectedIntegrations.length > 0 && (
                    <p><strong>Integrations:</strong> {selectedIntegrations.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-black hover:bg-accent/90"
            >
              {isLoading ? "Sending..." : "Send Discovery & Contact"}
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFinalSubmit)}>
      <Stepper
        steps={STEPS}
        active={activeStep}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={activeStep < 5 ? handleSkip : undefined}
        canBack={activeStep > 0}
        canNext={activeStep < 6}
      >
        {renderStepContent()}
      </Stepper>
    </form>
  )
}
