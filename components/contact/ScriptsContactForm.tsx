"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { scriptsContactSchema, type ScriptsContactInput } from "@/lib/validators/contact"
import { forwardRef, useImperativeHandle } from "react"
import { Clock, Zap, Repeat, BarChart3 } from "lucide-react"

interface ScriptsContactFormProps {
  onSubmit: (data: ScriptsContactInput) => void
  isLoading?: boolean
}

export interface ScriptsContactFormHandle {
  reset: () => void
}

const ScriptsContactForm = forwardRef<ScriptsContactFormHandle, ScriptsContactFormProps>(
  ({ onSubmit, isLoading }, ref) => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isValid },
    } = useForm<ScriptsContactInput>({
      resolver: zodResolver(scriptsContactSchema),
      mode: "onChange",
    })

    useImperativeHandle(ref, () => ({
      reset: () => reset(),
    }))

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel - Time Savings & Automation */}
        <div className="lg:col-span-3 space-y-6">
          <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
            <Clock className="w-8 h-8 mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-white mb-3">Save Time Daily</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Turn hours of manual work into seconds. Our scripts eliminate repetitive tasks automatically.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
            <Zap className="w-8 h-8 mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Process thousands of files in minutes. Automation that works at machine speed, not human pace.
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
              <Label htmlFor="scriptType" className="text-white text-base font-medium mb-2.5 block">
                Script/Automation Type *
              </Label>
              <select
                id="scriptType"
                {...register("scriptType")}
                className="w-full bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 rounded-md p-2.5 text-white h-11"
              >
                <option value="">Select a type...</option>
                <option value="data-processing">Data Processing</option>
                <option value="report-generation">Report Generation</option>
                <option value="file-automation">File Automation</option>
                <option value="api-integration">API Integration</option>
                <option value="scheduled-task">Scheduled Task</option>
                <option value="web-scraping">Web Scraping</option>
                <option value="other">Other/Custom</option>
              </select>
              {errors.scriptType && <p className="text-red-400 text-sm mt-1.5">{errors.scriptType.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="frequency" className="text-white text-base font-medium mb-2.5 block">
                  How Often? *
                </Label>
                <select
                  id="frequency"
                  {...register("frequency")}
                  className="w-full bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 rounded-md p-2.5 text-white h-11"
                >
                  <option value="">Select frequency...</option>
                  <option value="one-time">One-time project</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="on-demand">On-demand</option>
                </select>
                {errors.frequency && <p className="text-red-400 text-sm mt-1.5">{errors.frequency.message}</p>}
              </div>

              <div>
                <Label htmlFor="urgency" className="text-white text-base font-medium mb-2.5 block">
                  Urgency Level *
                </Label>
                <select
                  id="urgency"
                  {...register("urgency")}
                  className="w-full bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 rounded-md p-2.5 text-white h-11"
                >
                  <option value="">Select urgency...</option>
                  <option value="asap">ASAP (1-3 days)</option>
                  <option value="week">Within a week</option>
                  <option value="month">Within a month</option>
                  <option value="flexible">Flexible</option>
                </select>
                {errors.urgency && <p className="text-red-400 text-sm mt-1.5">{errors.urgency.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="currentProcess" className="text-white text-base font-medium mb-2.5 block">
                Current Manual Process (Optional)
              </Label>
              <Textarea
                id="currentProcess"
                {...register("currentProcess")}
                rows={3}
                className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 resize-none"
                placeholder="Describe how you currently do this manually..."
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-white text-base font-medium mb-2.5 block">
                Script/Automation Details *
              </Label>
              <Textarea
                id="message"
                {...register("message")}
                rows={4}
                className="bg-black/40 backdrop-blur-sm border-white/20 focus:border-red-500/50 resize-none"
                placeholder="Describe what you need automated, inputs/outputs, desired outcome, etc..."
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

        {/* Right Panel - Process & Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
            <Repeat className="w-8 h-8 mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-white mb-3">Set & Forget</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Schedule scripts to run automatically. Daily, weekly, or on-demand - your automation runs 24/7.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-6">
            <BarChart3 className="w-8 h-8 mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-white mb-3">Measure ROI</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Track time saved and efficiency gained. See exactly how much value your automation provides.
            </p>
          </div>
        </div>
      </div>
    )
  },
)

ScriptsContactForm.displayName = "ScriptsContactForm"

export default ScriptsContactForm
