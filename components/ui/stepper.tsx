"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'

type Step = { id: string; title: string }

interface StepperProps {
  steps: Step[]
  active: number
  onBack: () => void
  onNext: () => void
  onSkip?: () => void
  canNext?: boolean
  canBack?: boolean
  children: React.ReactNode
  className?: string
}

export function Stepper({
  steps,
  active,
  onBack,
  onNext,
  onSkip,
  canNext = true,
  canBack = true,
  children,
  className
}: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Step Indicators */}
      <ol className="flex items-center gap-4 mb-6">
        {steps.map((step, i) => (
          <li key={step.id} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border transition-all duration-300",
              i <= active 
                ? "bg-accent border-accent text-black" 
                : "bg-transparent border-white/20 text-white/60"
            )}>
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "w-10 h-px mx-2 transition-colors duration-300",
                i < active ? "bg-accent" : "bg-white/20"
              )} />
            )}
          </li>
        ))}
      </ol>

      {/* Step Content */}
      <div className="rounded-xl border border-white/10 p-6 bg-black/20 backdrop-blur-sm">
        {children}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          disabled={!canBack}
          className={cn(
            "px-6 py-2 rounded-lg border transition-all duration-200",
            canBack
              ? "border-white/20 text-white hover:border-white/40 hover:bg-white/5"
              : "border-white/10 text-white/40 cursor-not-allowed"
          )}
        >
          Back
        </button>

        <div className="flex gap-3">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-2 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200"
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className={cn(
              "px-6 py-2 rounded-lg transition-all duration-200",
              canNext
                ? "bg-accent text-black hover:bg-accent/90"
                : "bg-white/20 text-white/40 cursor-not-allowed"
            )}
          >
            {active === steps.length - 1 ? "Send" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}
