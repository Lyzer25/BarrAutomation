"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { contactBasicsSchema, type ContactBasicsInput } from "@/lib/validators/contact"

interface ContactFormProps {
  onSubmit: (data: ContactBasicsInput, type: "simple" | "custom") => void
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

  const handleSimpleContact = (data: ContactBasicsInput) => {
    onSubmit(data, "simple")
  }

  const handleCustomSolution = (data: ContactBasicsInput) => {
    onSubmit(data, "custom")
  }

  return (
    <form className="space-y-6">
      {/* Honeypot field - hidden from users */}
      <input type="text" {...register("trap")} className="absolute left-[-9999px]" tabIndex={-1} autoComplete="off" />

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
          {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
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
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
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
        {errors.website && <p className="text-red-400 text-sm mt-1">{errors.website.message}</p>}
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
        {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          type="button"
          onClick={handleSubmit(handleSimpleContact)}
          disabled={!isValid || isLoading}
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10 disabled:opacity-50 bg-transparent"
        >
          {isLoading ? "Processing..." : "Contact Us"}
        </Button>

        <Button
          type="button"
          onClick={handleSubmit(handleCustomSolution)}
          disabled={!isValid || isLoading}
          className="w-full bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Build My Custom Solution"}
        </Button>
      </div>

      <p className="text-xs text-white/60 text-center">We'll follow up within 1 business day. No spam, ever.</p>
    </form>
  )
}
