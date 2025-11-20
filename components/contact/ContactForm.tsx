"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { contactBasicsSchema, type ContactBasicsInput } from "@/lib/validators/contact"
import { forwardRef, useImperativeHandle } from "react"
import { Brain, Sparkles, MessageSquare, Target, ArrowRight } from "lucide-react"

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Panel - AI Capabilities */}
      <div className="lg:col-span-3 space-y-6">
        <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
          <Brain className="w-8 h-8 mb-4 text-red-500" />
          <h3 className="text-xl font-bold text-white mb-3">Intelligent AI</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Powered by cutting-edge models. From GPT to Claude to custom models - we implement the best AI for your
            needs.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
          <Sparkles className="w-8 h-8 mb-4 text-red-500" />
          <h3 className="text-xl font-bold text-white mb-3">Smart Automation</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            AI that learns from your data. Automate decisions, generate content, and extract insights automatically.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-red-600/5 border-2 border-red-500/40 rounded-xl p-5 relative">
          <div className="absolute -right-4 top-1/2 -translate-y-1/2">
            <ArrowRight className="w-8 h-8 text-red-500 animate-pulse drop-shadow-lg" />
          </div>
          <h4 className="text-base font-bold text-red-400 mb-2.5">Quick Consultation</h4>
          <p className="text-white/80 text-sm leading-relaxed">
            Need to chat first? The left button sends your info quickly for a consultation call.
          </p>
        </div>
      </div>

      {/* Center Panel - Contact Form */}
      <div className="lg:col-span-6">
        <form className="space-y-6 backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-2xl p-8 shadow-2xl shadow-red-500/10">
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
              <Label htmlFor="fullName" className="text-white text-base font-medium mb-2.5 block">
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
              <Label htmlFor="email" className="text-white text-base font-medium mb-2.5 block">
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
              <Label htmlFor="phone" className="text-white text-base font-medium mb-2.5 block">
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
              <Label htmlFor="company" className="text-white text-base font-medium mb-2.5 block">
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
            <Label htmlFor="website" className="text-white text-base font-medium mb-2.5 block">
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
            <Label htmlFor="message" className="text-white text-base font-medium mb-2.5 block">
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
              {isLoading ? "Processing..." : "Discuss This Project"}
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

          <p className="text-sm text-white/70 text-center leading-relaxed">
            We'll follow up within 1 business day. No spam, ever.
          </p>
        </form>
      </div>

      {/* Right Panel - Use Cases & Integration */}
      <div className="lg:col-span-3 space-y-6">
        <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
          <MessageSquare className="w-8 h-8 mb-4 text-red-500" />
          <h3 className="text-xl font-bold text-white mb-3">Conversational AI</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Build intelligent chatbots and assistants. Handle customer queries with AI that understands context.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
          <Target className="w-8 h-8 mb-4 text-red-500" />
          <h3 className="text-xl font-bold text-white mb-3">Task-Specific AI</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Custom AI trained for your specific workflows. From data analysis to content creation to predictions.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-red-600/5 border-2 border-red-500/40 rounded-xl p-5 relative">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 rotate-180">
            <ArrowRight className="w-8 h-8 text-red-500 animate-pulse drop-shadow-lg" />
          </div>
          <h4 className="text-base font-bold text-red-400 mb-2.5">Detailed AI Request</h4>
          <p className="text-white/80 text-sm leading-relaxed">
            Know what you need? The right button helps us understand your specific AI automation requirements.
          </p>
        </div>
      </div>
    </div>
  )
})

ContactForm.displayName = "ContactForm"

export default ContactForm
