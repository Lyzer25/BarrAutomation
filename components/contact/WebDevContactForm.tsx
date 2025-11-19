"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { webDevContactSchema, type WebDevContactInput } from "@/lib/validators/contact"
import { forwardRef, useImperativeHandle, useState } from "react"
import { Palette, Type, Sparkles } from "lucide-react"

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

    const [primaryColor, setPrimaryColor] = useState("#ef4444")
    const [bgColor, setBgColor] = useState("#0a0a0a")
    const [fontFamily, setFontFamily] = useState("Inter")

    const fonts = [
      { name: "Inter", label: "Inter (Modern)" },
      { name: "Chakra Petch", label: "Chakra Petch (Tech)" },
      { name: "Space Grotesk", label: "Space Grotesk" },
      { name: "Poppins", label: "Poppins (Friendly)" },
      { name: "Roboto Mono", label: "Roboto Mono (Code)" },
    ]

    const colorPresets = [
      { name: "Red", value: "#ef4444" },
      { name: "Blue", value: "#3b82f6" },
      { name: "Purple", value: "#a855f7" },
      { name: "Green", value: "#22c55e" },
      { name: "Orange", value: "#f97316" },
    ]

    useImperativeHandle(ref, () => ({
      reset: () => reset(),
    }))

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel - Brand Messaging */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <Sparkles className="w-8 h-8 mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily }}>
              Built for Your Brand
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Every website we create is uniquely tailored to reflect your brand identity and business goals.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full mb-4" style={{ background: primaryColor }} />
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily }}>
              Your Style, Your Way
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              From colors to fonts to layouts, we craft designs that perfectly match your vision.
            </p>
          </div>
        </div>

        {/* Center Panel - Contact Form */}
        <div className="lg:col-span-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white/5 backdrop-blur-sm border rounded-xl p-8 transition-all duration-300"
            style={{ borderColor: `${primaryColor}20`, fontFamily }}
          >
            <input
              type="text"
              {...register("trap")}
              className="absolute left-[-9999px]"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="text-white" style={{ fontFamily }}>
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  className="mt-2 bg-black/50 border-white/20 transition-all duration-200"
                  style={{ borderColor: errors.fullName ? "#ef4444" : `${primaryColor}40`, fontFamily }}
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-white" style={{ fontFamily }}>
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="mt-2 bg-black/50 border-white/20 transition-all duration-200"
                  style={{ borderColor: errors.email ? "#ef4444" : `${primaryColor}40`, fontFamily }}
                  placeholder="john@company.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone" className="text-white" style={{ fontFamily }}>
                  Phone (Optional)
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className="mt-2 bg-black/50 transition-all duration-200"
                  style={{ borderColor: `${primaryColor}40`, fontFamily }}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-white" style={{ fontFamily }}>
                  Company (Optional)
                </Label>
                <Input
                  id="company"
                  {...register("company")}
                  className="mt-2 bg-black/50 transition-all duration-200"
                  style={{ borderColor: `${primaryColor}40`, fontFamily }}
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="projectType" className="text-white" style={{ fontFamily }}>
                Project Type *
              </Label>
              <select
                id="projectType"
                {...register("projectType")}
                className="mt-2 w-full bg-black/50 rounded-md p-2 text-white transition-all duration-200"
                style={{ borderColor: errors.projectType ? "#ef4444" : `${primaryColor}40`, fontFamily }}
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
                <Label htmlFor="timeline" className="text-white" style={{ fontFamily }}>
                  Desired Timeline *
                </Label>
                <select
                  id="timeline"
                  {...register("timeline")}
                  className="mt-2 w-full bg-black/50 rounded-md p-2 text-white transition-all duration-200"
                  style={{ borderColor: errors.timeline ? "#ef4444" : `${primaryColor}40`, fontFamily }}
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
                <Label htmlFor="budget" className="text-white" style={{ fontFamily }}>
                  Budget Range *
                </Label>
                <select
                  id="budget"
                  {...register("budget")}
                  className="mt-2 w-full bg-black/50 rounded-md p-2 text-white transition-all duration-200"
                  style={{ borderColor: errors.budget ? "#ef4444" : `${primaryColor}40`, fontFamily }}
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
              <Label htmlFor="existingWebsite" className="text-white" style={{ fontFamily }}>
                Existing Website (Optional)
              </Label>
              <Input
                id="existingWebsite"
                {...register("existingWebsite")}
                className="mt-2 bg-black/50 transition-all duration-200"
                style={{ borderColor: `${primaryColor}40`, fontFamily }}
                placeholder="https://currentsite.com"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-white" style={{ fontFamily }}>
                Project Details *
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                rows={4}
                className="mt-2 bg-black/50 transition-all duration-200"
                style={{ borderColor: errors.message ? "#ef4444" : `${primaryColor}40`, fontFamily }}
                placeholder="Tell us about your website project, key features, design preferences, etc..."
              />
              {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full text-white hover:opacity-90 disabled:opacity-50 transition-all duration-200"
              style={{ background: primaryColor, fontFamily }}
            >
              {isLoading ? "Sending..." : "Discuss This Project"}
            </Button>

            <p className="text-xs text-white/60 text-center" style={{ fontFamily }}>
              We'll follow up within 1 business day. No spam, ever.
            </p>
          </form>
        </div>

        {/* Right Panel - Customization Controls */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-white" />
              <h3 className="text-lg font-bold text-white">Try Your Colors</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">See how your brand colors look in real-time</p>
            <div className="space-y-3">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setPrimaryColor(color.value)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:scale-105"
                  style={{
                    borderColor: primaryColor === color.value ? color.value : "rgba(255,255,255,0.1)",
                    background: primaryColor === color.value ? `${color.value}10` : "transparent",
                  }}
                >
                  <div className="w-6 h-6 rounded-full" style={{ background: color.value }} />
                  <span className="text-white text-sm font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-white" />
              <h3 className="text-lg font-bold text-white">Choose Your Font</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">Pick a typeface that matches your brand</p>
            <div className="space-y-2">
              {fonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() => setFontFamily(font.name)}
                  className="w-full text-left p-3 rounded-lg border transition-all duration-200 hover:scale-105"
                  style={{
                    fontFamily: font.name,
                    borderColor: fontFamily === font.name ? primaryColor : "rgba(255,255,255,0.1)",
                    background: fontFamily === font.name ? `${primaryColor}10` : "transparent",
                  }}
                >
                  <span className="text-white text-sm">{font.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
)

WebDevContactForm.displayName = "WebDevContactForm"

export default WebDevContactForm
