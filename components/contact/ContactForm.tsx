"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { contactBasicsSchema, type ContactBasicsInput } from "@/lib/validators/contact"

interface ContactFormProps {
  onSubmit: (data: ContactBasicsInput) => void
  isLoading?: boolean
}

export default function ContactForm({ onSubmit, isLoading }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactBasicsInput>({
    resolver: zodResolver(contactBasicsSchema),
    mode: "onChange",
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        {...register("trap")}
        className="absolute left-[-9999px]"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName" className="text-white">
            Full Name *
          </Label>
          <Input
            id="fullName"
            {...register("fullName")}
            className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-white">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
            placeholder="john@company.com"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone" className="text-white">
            Phone (Optional)
          </Label>
          <Input
            id="phone"
            {...register("phone")}
            className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <Label htmlFor="company" className="text-white">
            Company (Optional)
          </Label>
          <Input
            id="company"
            {...register("company")}
            className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
            placeholder="Acme Corp"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website" className="text-white">
          Website (Optional)
        </Label>
        <Input
          id="website"
          {...register("website")}
          className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
          placeholder="https://company.com"
        />
        {errors.website && (
          <p className="text-red-400 text-sm mt-1">{errors.website.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message" className="text-white">
          Message *
        </Label>
        <Textarea
          id="message"
          {...register("message")}
          rows={4}
          className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
          placeholder="Tell us about your automation needs..."
        />
        {errors.message && (
          <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full bg-accent text-black hover:bg-accent/90 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Continue to Discovery"}
      </Button>

      <p className="text-xs text-white/60 text-center">
        We'll follow up within 1 business day. No spam, ever.
      </p>
    </form>
  )
}
