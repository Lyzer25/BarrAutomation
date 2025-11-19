"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { webDevContactSchema, type WebDevContactInput } from "@/lib/validators/contact"
import { forwardRef, useImperativeHandle, useState } from "react"
import { Palette, Sparkles } from "lucide-react"

interface WebDevContactFormProps {
  onSubmit: (data: WebDevContactInput) => void
  isLoading?: boolean
}

export interface WebDevContactFormHandle {
  reset: () => void
}

const themes = [
  {
    name: "Bold Red",
    primary: "#ef4444",
    accent: "#dc2626",
    font: "Inter",
    gradient: "from-red-600/20 via-red-500/10 to-transparent",
  },
  {
    name: "Ocean Blue",
    primary: "#3b82f6",
    accent: "#2563eb",
    font: "Space Grotesk",
    gradient: "from-blue-600/20 via-blue-500/10 to-transparent",
  },
  {
    name: "Royal Purple",
    primary: "#a855f7",
    accent: "#9333ea",
    font: "Poppins",
    gradient: "from-purple-600/20 via-purple-500/10 to-transparent",
  },
  {
    name: "Emerald Green",
    primary: "#22c55e",
    accent: "#16a34a",
    font: "Inter",
    gradient: "from-green-600/20 via-green-500/10 to-transparent",
  },
  {
    name: "Sunset Orange",
    primary: "#f97316",
    accent: "#ea580c",
    font: "Chakra Petch",
    gradient: "from-orange-600/20 via-orange-500/10 to-transparent",
  },
]

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

    const [selectedTheme, setSelectedTheme] = useState(themes[0])

    useImperativeHandle(ref, () => ({
      reset: () => reset(),
    }))

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel - Brand Messaging */}
        <div className="lg:col-span-3 space-y-6">
          <div
            className="backdrop-blur-md border rounded-xl p-6 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${selectedTheme.primary}15, transparent)`,
              borderColor: `${selectedTheme.primary}30`,
            }}
          >
            <Sparkles className="w-8 h-8 mb-4" style={{ color: selectedTheme.primary }} />
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: selectedTheme.font }}>
              Built for Your Brand
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Every website we create is uniquely tailored to reflect your brand identity and business goals.
            </p>
          </div>

          <div
            className="backdrop-blur-md border rounded-xl p-6 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${selectedTheme.primary}10, transparent)`,
              borderColor: `${selectedTheme.primary}30`,
            }}
          >
            <div
              className="w-12 h-12 rounded-full mb-4 shadow-lg transition-all duration-300"
              style={{ background: selectedTheme.primary, boxShadow: `0 0 20px ${selectedTheme.primary}50` }}
            />
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: selectedTheme.font }}>
              Your Style, Your Way
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              From colors to fonts to layouts, we craft designs that perfectly match your vision.
            </p>
          </div>
        </div>

        {/* Center Panel - Contact Form */}
        <div className="lg:col-span-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 backdrop-blur-md border rounded-xl p-8 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${selectedTheme.primary}10, rgba(255,255,255,0.02))`,
              borderColor: `${selectedTheme.primary}30`,
              fontFamily: selectedTheme.font,
            }}
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
                <Label htmlFor="fullName" className="text-white text-sm font-medium mb-2 block">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  className="bg-black/40 backdrop-blur-sm border transition-all duration-200 focus:ring-2 h-11"
                  style={{
                    borderColor: errors.fullName ? "#ef4444" : `${selectedTheme.primary}40`,
                    outlineColor: selectedTheme.primary,
                  }}
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
                  className="bg-black/40 backdrop-blur-sm border transition-all duration-200 focus:ring-2 h-11"
                  style={{
                    borderColor: errors.email ? "#ef4444" : `${selectedTheme.primary}40`,
                    outlineColor: selectedTheme.primary,
                  }}
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
                  className="bg-black/40 backdrop-blur-sm border transition-all duration-200 h-11"
                  style={{ borderColor: `${selectedTheme.primary}40` }}
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
                  className="bg-black/40 backdrop-blur-sm border transition-all duration-200 h-11"
                  style={{ borderColor: `${selectedTheme.primary}40` }}
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="projectType" className="text-white text-sm font-medium mb-2 block">
                Project Type *
              </Label>
              <select
                id="projectType"
                {...register("projectType")}
                className="w-full bg-black/40 backdrop-blur-sm border rounded-md p-2.5 text-white transition-all duration-200 h-11"
                style={{ borderColor: errors.projectType ? "#ef4444" : `${selectedTheme.primary}40` }}
              >
                <option value="">Select a package...</option>
                <option value="business-website">Business Website ($750+)</option>
                <option value="business-website-reservation">Business Website + Reservations ($1,000+)</option>
                <option value="ecommerce">E-Commerce Platform ($2,500+)</option>
                <option value="ecommerce-revshare">E-Commerce (Revenue Share Model)</option>
                <option value="enterprise">Enterprise Management System (Custom)</option>
                <option value="other">Other/Custom</option>
              </select>
              {errors.projectType && <p className="text-red-400 text-sm mt-1.5">{errors.projectType.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="timeline" className="text-white text-sm font-medium mb-2 block">
                  Desired Timeline *
                </Label>
                <select
                  id="timeline"
                  {...register("timeline")}
                  className="w-full bg-black/40 backdrop-blur-sm border rounded-md p-2.5 text-white transition-all duration-200 h-11"
                  style={{ borderColor: errors.timeline ? "#ef4444" : `${selectedTheme.primary}40` }}
                >
                  <option value="">Select timeline...</option>
                  <option value="asap">ASAP (1-2 weeks)</option>
                  <option value="month">Within a month</option>
                  <option value="flexible">Flexible timeline</option>
                  <option value="other">Other</option>
                </select>
                {errors.timeline && <p className="text-red-400 text-sm mt-1.5">{errors.timeline.message}</p>}
              </div>

              <div>
                <Label htmlFor="budget" className="text-white text-sm font-medium mb-2 block">
                  Budget Range *
                </Label>
                <select
                  id="budget"
                  {...register("budget")}
                  className="w-full bg-black/40 backdrop-blur-sm border rounded-md p-2.5 text-white transition-all duration-200 h-11"
                  style={{ borderColor: errors.budget ? "#ef4444" : `${selectedTheme.primary}40` }}
                >
                  <option value="">Select budget...</option>
                  <option value="under-1k">Under $1,000</option>
                  <option value="1k-3k">$1,000 - $3,000</option>
                  <option value="3k-10k">$3,000 - $10,000</option>
                  <option value="10k-plus">$10,000+</option>
                  <option value="flexible">Flexible/Discuss</option>
                </select>
                {errors.budget && <p className="text-red-400 text-sm mt-1.5">{errors.budget.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="existingWebsite" className="text-white text-sm font-medium mb-2 block">
                Existing Website (Optional)
              </Label>
              <Input
                id="existingWebsite"
                {...register("existingWebsite")}
                className="bg-black/40 backdrop-blur-sm border transition-all duration-200 h-11"
                style={{ borderColor: `${selectedTheme.primary}40` }}
                placeholder="https://currentsite.com"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-white text-sm font-medium mb-2 block">
                Project Details *
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                rows={4}
                className="bg-black/40 backdrop-blur-sm border transition-all duration-200 resize-none"
                style={{ borderColor: errors.message ? "#ef4444" : `${selectedTheme.primary}40` }}
                placeholder="Tell us about your website project, key features, design preferences, etc..."
              />
              {errors.message && <p className="text-red-400 text-sm mt-1.5">{errors.message.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all duration-200 h-12 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${selectedTheme.primary}, ${selectedTheme.accent})`,
                boxShadow: `0 4px 20px ${selectedTheme.primary}40`,
              }}
            >
              {isLoading ? "Sending..." : "Discuss This Project"}
            </Button>

            <p className="text-xs text-white/60 text-center">We'll follow up within 1 business day. No spam, ever.</p>
          </form>
        </div>

        {/* Right Panel - Theme Selector */}
        <div className="lg:col-span-3">
          <div
            className="backdrop-blur-md border rounded-xl p-6 sticky top-24 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${selectedTheme.primary}10, rgba(255,255,255,0.02))`,
              borderColor: `${selectedTheme.primary}30`,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-white" />
              <h3 className="text-lg font-bold text-white">Choose Your Theme</h3>
            </div>
            <p className="text-white/70 text-sm mb-6">See how different styles transform the form</p>

            <div className="space-y-3">
              {themes.map((theme) => (
                <button key={theme.name} onClick={() => setSelectedTheme(theme)} className="w-full group">
                  <div
                    className="p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: selectedTheme.name === theme.name ? theme.primary : "rgba(255,255,255,0.1)",
                      background:
                        selectedTheme.name === theme.name
                          ? `linear-gradient(135deg, ${theme.primary}20, rgba(255,255,255,0.05))`
                          : "rgba(255,255,255,0.02)",
                      boxShadow: selectedTheme.name === theme.name ? `0 0 20px ${theme.primary}30` : "none",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg shadow-md transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                          boxShadow: `0 4px 12px ${theme.primary}40`,
                        }}
                      />
                      <div className="text-left">
                        <p className="text-white font-semibold text-sm" style={{ fontFamily: theme.font }}>
                          {theme.name}
                        </p>
                        <p className="text-white/50 text-xs">{theme.font}</p>
                      </div>
                    </div>

                    {/* Mini preview */}
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full" style={{ background: `${theme.primary}40`, width: "100%" }} />
                      <div className="h-2 rounded-full" style={{ background: `${theme.primary}30`, width: "70%" }} />
                      <div className="h-2 rounded-full" style={{ background: `${theme.primary}20`, width: "90%" }} />
                    </div>
                  </div>
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
