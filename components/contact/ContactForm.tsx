"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { contactBasicsSchema, type ContactBasicsInput } from "@/lib/validators/contact"
import { forwardRef, useImperativeHandle } from "react"

interface ContactFormProps {
  onSubmit: (data: ContactBasicsInput, type: "simple" | "custom") => void
  isLoading?: boolean
}

export interface ContactFormHandle {
  reset: () => void
}

const ContactForm = forwardRef<ContactFormHandle, ContactFormProps>(({ onSubmit, isLoading }, ref) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactBasicsInput>({
    resolver: zodResolver(contactBasicsSchema),
    mode: "onChange",
  })

  // Expose reset method to parent component
  useImperativeHandle(ref, () => ({
    reset: () => reset(),
  }))

  const handleSimpleContact = (data: ContactBasicsInput) => {
    onSubmit(data, "simple")
  }

  const handleCustomSolution = (data: ContactBasicsInput) => {
    onSubmit(data, "custom")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form className="space-y-6 backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-2xl p-8 shadow-2xl shadow-red-500/10">
        {/* Honeypot field - hidden from users */}
        <input type="text" {...register("trap")} className="absolute left-[-9999px]" tabIndex={-1} autoComplete="off" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fullName" className="text-white text-sm font-medium mb-2 block">
              Full Name *
            </Label>
            <Input
              id="fullName"
              {...register("fullName")}
              className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 h-11"
              placeholder="John Doe"
            />
            {errors.fullName && <p className="text-red-400 text-sm mt-1.5">{errors.fullName.message}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-white text-sm font-medium mb-2 block">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 h-11"
              placeholder="john@company.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1.5">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="phone" className="text-white text-sm font-medium mb-2 block">
              Phone (Optional)
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 h-11"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="company" className="text-white text-sm font-medium mb-2 block">
              Company (Optional)
            </Label>
            <Input
              id="company"
              {...register("company")}
              className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 h-11"
              placeholder="Acme Corp"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website" className="text-white text-sm font-medium mb-2 block">
            Website (Optional)
          </Label>
          <Input
            id="website"
            {...register("website")}
            className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 h-11"
            placeholder="https://company.com"
          />
          {errors.website && <p className="text-red-400 text-sm mt-1.5">{errors.website.message}</p>}
        </div>

        <div>
          <Label htmlFor="message" className="text-white text-sm font-medium mb-2 block">
            Message *
          </Label>
          <Textarea
            id="message"
            {...register("message")}
            rows={4}
            className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 resize-none"
            placeholder="Tell us about your automation needs..."
          />
          {errors.message && <p className="text-red-400 text-sm mt-1.5">{errors.message.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            type="button"
            onClick={handleSubmit(handleSimpleContact)}
            disabled={!isValid || isLoading}
            variant="outline"
            className="w-full h-12 border-white/20 text-white hover:bg-white/10 disabled:opacity-50 bg-transparent backdrop-blur-sm"
          >
            {isLoading ? "Processing..." : "Contact Us"}
          </Button>

          <Button
            type="button"
            onClick={handleSubmit(handleCustomSolution)}
            disabled={!isValid || isLoading}
            className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 text-white hover:opacity-90 disabled:opacity-50 shadow-lg shadow-red-500/30"
          >
            {isLoading ? "Processing..." : "Build My Custom Solution"}
          </Button>
        </div>

        <p className="text-xs text-white/60 text-center">We'll follow up within 1 business day. No spam, ever.</p>
      </form>
    </div>
  )
})

ContactForm.displayName = "ContactForm"

export default ContactForm
