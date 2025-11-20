"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { softwareToolsContactSchema, type SoftwareToolsContactInput } from "@/lib/validators/contact"
import { forwardRef, useImperativeHandle } from "react"
import { Database, Layers, Settings, TrendingUp } from "lucide-react"

interface SoftwareToolsContactFormProps {
  onSubmit: (data: SoftwareToolsContactInput) => void
  isLoading?: boolean
}

export interface SoftwareToolsContactFormHandle {
  reset: () => void
}

const SoftwareToolsContactForm = forwardRef<SoftwareToolsContactFormHandle, SoftwareToolsContactFormProps>(
  ({ onSubmit, isLoading }, ref) => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isValid },
    } = useForm<SoftwareToolsContactInput>({
      resolver: zodResolver(softwareToolsContactSchema),
      mode: "onChange",
    })

    useImperativeHandle(ref, () => ({
      reset: () => reset(),
    }))

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel - System Integration Features */}
        <div className="lg:col-span-3 space-y-6">
          <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
            <Database className="w-8 h-8 mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-white mb-3">Powerful Integrations</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Connect with your existing tools seamlessly. We integrate with databases, APIs, and third-party services.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
            <Layers className="w-8 h-8 mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-white mb-3">Scalable Architecture</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Built to grow with your business. From 10 to 10,000 users, our systems scale effortlessly.
            </p>
          </div>
        </div>

        {/* Center Panel - Contact Form */}
        <div className="lg:col-span-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-2xl p-8 shadow-2xl shadow-red-500/10"
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
                  Company *
                </Label>
                <Input
                  id="company"
                  {...register("company")}
                  className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 h-11"
                  placeholder="Acme Corp"
                />
                {errors.company && <p className="text-red-400 text-sm mt-1.5">{errors.company.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="softwareType" className="text-white text-base font-medium mb-2.5 block">
                Software Type *
              </Label>
              <select
                id="softwareType"
                {...register("softwareType")}
                className="w-full bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 rounded-md p-2.5 text-white h-11"
              >
                <option value="">Select a type...</option>
                <option value="small-tool">Small Tool ($2.5K-$7.5K)</option>
                <option value="medium-platform">Medium Platform ($10K-$25K)</option>
                <option value="enterprise-solution">Enterprise Solution ($25K+)</option>
                <option value="partnership">Partnership/Revenue Share</option>
                <option value="other">Other/Custom</option>
              </select>
              {errors.softwareType && <p className="text-red-400 text-sm mt-1.5">{errors.softwareType.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="userCount" className="text-white text-base font-medium mb-2.5 block">
                  Expected Users *
                </Label>
                <select
                  id="userCount"
                  {...register("userCount")}
                  className="w-full bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 rounded-md p-2.5 text-white h-11"
                >
                  <option value="">Select user count...</option>
                  <option value="1-10">1-10 users</option>
                  <option value="11-50">11-50 users</option>
                  <option value="51-200">51-200 users</option>
                  <option value="200-plus">200+ users</option>
                </select>
                {errors.userCount && <p className="text-red-400 text-sm mt-1.5">{errors.userCount.message}</p>}
              </div>

              <div>
                <Label htmlFor="timeline" className="text-white text-base font-medium mb-2.5 block">
                  Desired Timeline *
                </Label>
                <select
                  id="timeline"
                  {...register("timeline")}
                  className="w-full bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 rounded-md p-2.5 text-white h-11"
                >
                  <option value="">Select timeline...</option>
                  <option value="asap">ASAP (2-4 weeks)</option>
                  <option value="1-3-months">1-3 months</option>
                  <option value="3-6-months">3-6 months</option>
                  <option value="flexible">Flexible timeline</option>
                </select>
                {errors.timeline && <p className="text-red-400 text-sm mt-1.5">{errors.timeline.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="integrations" className="text-white text-base font-medium mb-2.5 block">
                Required Integrations (Optional)
              </Label>
              <Input
                id="integrations"
                {...register("integrations")}
                className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 h-11"
                placeholder="e.g., Salesforce, Stripe, QuickBooks, etc."
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-white text-base font-medium mb-2.5 block">
                Software Requirements *
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                rows={4}
                className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 resize-none"
                placeholder="Describe the software you need, key features, workflows, pain points, etc..."
              />
              {errors.message && <p className="text-red-400 text-sm mt-1.5">{errors.message.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 text-white hover:opacity-90 disabled:opacity-50 shadow-lg shadow-red-500/30"
            >
              {isLoading ? "Sending..." : "Discuss This Project"}
            </Button>

            <p className="text-sm text-white/70 text-center leading-relaxed">
              We'll follow up within 1 business day. No spam, ever.
            </p>
          </form>
        </div>

        {/* Right Panel - Tech Stack & Benefits */}
        <div className="lg:col-span-3 space-y-6">
          <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
            <Settings className="w-8 h-8 mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-white mb-3">Custom Built</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              No templates or off-the-shelf solutions. Every feature designed specifically for your workflow.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
            <TrendingUp className="w-8 h-8 mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-white mb-3">Boost Productivity</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Automate repetitive tasks and streamline operations. Save hours every day with intelligent software.
            </p>
          </div>
        </div>
      </div>
    )
  },
)

SoftwareToolsContactForm.displayName = "SoftwareToolsContactForm"

export default SoftwareToolsContactForm
