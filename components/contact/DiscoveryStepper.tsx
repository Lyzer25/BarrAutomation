"use client"

import React, { useState, useMemo } from "react"
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
import { integrationData } from "@/lib/integrations"

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

export default function DiscoveryStepper({ contactBasics, onSubmit, isLoading }: DiscoveryStepperProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [otherHours, setOtherHours] = useState("")
  const [otherFollowup, setOtherFollowup] = useState("")
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [stepErrors, setStepErrors] = useState<string>("")
  const [integrationQuery, setIntegrationQuery] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<DiscoveryAnswersInput>({
    resolver: zodResolver(discoveryAnswersSchema),
    mode: "onChange",
  })

  const watchedHours = watch("hoursFocus")
  const watchedFollowup = watch("followupPain")

  // Build full integration list from canonical source
  const allIntegrationKeys = useMemo(() => Object.keys(integrationData), [])
  const filteredIntegrationKeys = useMemo(() => {
    if (!integrationQuery) return allIntegrationKeys
    const q = integrationQuery.toLowerCase()
    return allIntegrationKeys.filter((k) => {
      const meta = integrationData[k]
      return (
        k.toLowerCase().includes(q) ||
        (meta?.name || "").toLowerCase().includes(q) ||
        (meta?.description || "").toLowerCase().includes(q)
      )
    })
  }, [integrationQuery, allIntegrationKeys])

  const handleHoursSelect = (option: string) => {
    if (option === "Other") {
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
      if (current.includes("Other")) {
        newSelection = current.filter(item => item !== "Other" && item !== otherFollowup)
      } else {
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

  const handleNext = async () => {
    console.log('handleNext called, current step:', activeStep)
    console.log('Current form data:', { watchedHours, watchedFollowup, otherHours, otherFollowup, selectedIntegrations, valuesPreview: getValues() })

    // Attempt to trigger validation for the currently relevant field(s)
    let triggered = true
    try {
      switch (activeStep) {
        case 0:
          triggered = await trigger('hoursFocus')
          break
        case 1:
          triggered = await trigger('followupPain')
          break
        case 2:
          triggered = await trigger('repeatedLookups')
          break
        case 3:
          triggered = await trigger('singlePointProcess')
          break
        case 4:
          triggered = await trigger('morningKPIs')
          break
        case 5:
          triggered = await trigger('integrations')
          break
        default:
          triggered = true
      }
    } catch (err) {
      console.error('Error triggering validation for step', activeStep, err)
      triggered = false
    }

    const localValid = validateCurrentStep()
    const canProceed = triggered && localValid
    console.log('triggered:', triggered, 'localValid:', localValid, 'canProceed:', canProceed)

    // If we're on the final step, programmatically submit the form
    const lastIndex = STEPS.length - 1
    if (activeStep === lastIndex) {
      // Submit the form (this will call handleFinalSubmit)
      handleSubmit(handleFinalSubmit)()
      return
    }

    if (activeStep < lastIndex) {
      if (canProceed) {
        setStepErrors("")
        // Clear the field for the current step to avoid leaking text into subsequent steps
        // (addresses the reported textbox-not-clearing issue when advancing)
        switch (activeStep) {
          case 2:
            setValue('repeatedLookups', '')
            break
          case 3:
            setValue('singlePointProcess', '')
            break
          case 4:
            setValue('morningKPIs', '')
            break
        }

        const nextStep = activeStep + 1
        console.log('Moving to step:', nextStep)
        setActiveStep(nextStep)
      } else {
        const errorMessage = getValidationErrorMessage()
        console.log('Validation error:', errorMessage)
        setStepErrors(errorMessage)
      }
    }
  }

  const getValidationErrorMessage = (): string => {
    switch (activeStep) {
      case 0:
        return "Please select where 20 extra hours/week would matter most, or specify 'Other'"
      case 1:
        return "Please select at least one area where delays hurt your business"
      default:
        return "Please complete the current step before continuing"
    }
  }

  const validateCurrentStep = (): boolean => {
    switch (activeStep) {
      case 0:
        return !!(watchedHours && watchedHours !== "Other" || (watchedHours === "Other" && otherHours))
      case 1:
        return (watchedFollowup || []).length > 0
      case 2:
        return true
      case 3:
        return true
      case 4:
        return true
      case 5:
        return true
      default:
        return true
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
    let processedData = { ...data }

    if (data.hoursFocus === "Other" && otherHours) {
      processedData.hoursFocus = otherHours
    }

    if (data.followupPain?.includes("Other")) {
      const withoutOther = data.followupPain.filter(item => item !== "Other")
      if (otherFollowup) {
        processedData.followupPain = [...withoutOther, otherFollowup]
      } else {
        processedData.followupPain = withoutOther
      }
    }

    if ((!processedData.integrations || processedData.integrations.length === 0) && selectedIntegrations.length > 0) {
      processedData.integrations = selectedIntegrations
    }

    const fullPayload = { ...contactBasics, ...processedData }
    console.log('Final discovery payload:', fullPayload)
    onSubmit(fullPayload)
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Where would 20 extra hours/week matter most?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Sales","Service/Support","Ops/Admin","Marketing","Finance","Other"].map((option) => (
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
            {stepErrors && activeStep === 0 && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{stepErrors}</p>
              </div>
            )}
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Where do delays or missed follow-ups hurt?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Lead response","Abandoned carts","Onboarding","Billing","Ticket routing","Other"].map((option) => (
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
            {stepErrors && activeStep === 1 && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{stepErrors}</p>
              </div>
            )}
          </div>
        )

      case 2:
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

      case 3:
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

      case 4:
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

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Which tools do you use that we should connect?
            </h3>

            <div className="mb-3">
              <Input
                placeholder="Search integrations (name, description, or key)"
                value={integrationQuery}
                onChange={(e) => setIntegrationQuery(e.target.value)}
                className="bg-black/50 border-white/20"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-72 overflow-y-auto">
              {filteredIntegrationKeys.map((integrationKey) => {
                const meta = integrationData[integrationKey]
                const isSelected = selectedIntegrations.includes(integrationKey)
                return (
                  <button
                    key={integrationKey}
                    type="button"
                    onClick={() => handleIntegrationToggle(integrationKey)}
                    className={`p-2 rounded border text-xs text-left transition-all duration-200 ${isSelected ? "border-accent bg-accent/20 text-accent" : "border-white/20 text-white hover:border-white/40"}`}
                  >
                    <div className="font-medium text-sm">{meta?.name || integrationKey}</div>
                    <div className="text-white/60 text-xs truncate">{meta?.description}</div>
                  </button>
                )
              })}
            </div>

            <p className="text-white/60 text-xs">
              Selected: {selectedIntegrations.length} tools
            </p>
          </div>
        )

      case 6:
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
      {/* Progress indicator */}
      <div className="mb-6 text-center">
        <div className="text-sm text-white/60 mb-2">
          Step {activeStep + 1} of {STEPS.length}
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Debug panel - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg text-xs">
          <div className="text-white/60 mb-2">Debug Info:</div>
          <div className="grid grid-cols-2 gap-2 text-white/80">
            <div>Current Step: {activeStep}</div>
            <div>Hours Focus: {watchedHours || 'None'}</div>
            <div>Follow-up Pain: {(watchedFollowup || []).join(', ') || 'None'}</div>
            <div>Other Hours: {otherHours || 'None'}</div>
            <div>Other Follow-up: {otherFollowup || 'None'}</div>
            <div>Can Proceed: {validateCurrentStep() ? 'Yes' : 'No'}</div>
          </div>
        </div>
      )}

      <Stepper
        steps={STEPS}
        active={activeStep}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={activeStep < 6 ? handleSkip : undefined}
        canBack={activeStep > 0}
        canNext={activeStep < STEPS.length - 1}
      >
        {renderStepContent()}
      </Stepper>
    </form>
  )
}
