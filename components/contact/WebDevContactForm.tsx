"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { webDevContactSchema, type WebDevContactInput } from "@/lib/validators/contact"
import { forwardRef, useImperativeHandle } from "react"

interface WebDevContactFormProps {
  onSubmit: (data: WebDevContactInput) => void
  isLoading?: boolean
}

export interface WebDevContactFormHandle {
  reset: () => void
}

const WebDevContactForm = forwardRef<WebDevContactFormHandle, WebDevContactFormProps>(
  ({ onSubmit, isLoading }, ref) => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isValid },
    } = useForm<WebDevContactInput>({
      resolver: zodResolver(webDevContactSchema),
      mode: "onChange",
    })

    useImperativeHandle(ref, () => ({
      reset: () => reset(),
    }))

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <Label htmlFor="projectType" className="text-white">
            Project Type *
          </Label>
          <select
            id="projectType"
            {...register("projectType")}
            className="mt-2 w-full bg-black/50 border-white/20 focus:border-accent/50 rounded-md p-2 text-white"
          >
            <option value="">Select a package...</option>
            <option value="business-website">Business Website ($750+)</option>
            <option value="business-website-reservation">Business Website + Reservations ($1,000+)</option>
            <option value="ecommerce">E-Commerce Platform ($2,500+)</option>
            <option value="ecommerce-revshare">E-Commerce (Revenue Share Model)</option>
            <option value="enterprise">Enterprise Management System (Custom)</option>
            <option value="other">Other/Custom</option>
          </select>
          {errors.projectType && <p className="text-red-400 text-sm mt-1">{errors.projectType.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="timeline" className="text-white">
              Desired Timeline *
            </Label>
            <select
              id="timeline"
              {...register("timeline")}
              className="mt-2 w-full bg-black/50 border-white/20 focus:border-accent/50 rounded-md p-2 text-white"
            >
              <option value="">Select timeline...</option>
              <option value="asap">ASAP (1-2 weeks)</option>
              <option value="month">Within a month</option>
              <option value="flexible">Flexible timeline</option>
              <option value="other">Other</option>
            </select>
            {errors.timeline && <p className="text-red-400 text-sm mt-1">{errors.timeline.message}</p>}
          </div>

          <div>
            <Label htmlFor="budget" className="text-white">
              Budget Range *
            </Label>
            <select
              id="budget"
              {...register("budget")}
              className="mt-2 w-full bg-black/50 border-white/20 focus:border-accent/50 rounded-md p-2 text-white"
            >
              <option value="">Select budget...</option>
              <option value="under-1k">Under $1,000</option>
              <option value="1k-3k">$1,000 - $3,000</option>
              <option value="3k-10k">$3,000 - $10,000</option>
              <option value="10k-plus">$10,000+</option>
              <option value="flexible">Flexible/Discuss</option>
            </select>
            {errors.budget && <p className="text-red-400 text-sm mt-1">{errors.budget.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="existingWebsite" className="text-white">
            Existing Website (Optional)
          </Label>
          <Input
            id="existingWebsite"
            {...register("existingWebsite")}
            className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
            placeholder="https://currentsite.com"
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-white">
            Project Details *
          </Label>
          <Textarea
            id="message"
            {...register("message")}
            rows={4}
            className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
            placeholder="Tell us about your website project, key features, design preferences, etc..."
          />
          {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Discuss This Project"}
        </Button>

        <p className="text-xs text-white/60 text-center">We'll follow up within 1 business day. No spam, ever.</p>
      </form>
    )
  }
)

WebDevContactForm.displayName = "WebDevContactForm"

export default WebDevContactForm
