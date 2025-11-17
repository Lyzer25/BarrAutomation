"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { scriptsContactSchema, type ScriptsContactInput } from "@/lib/validators/contact"
import { forwardRef, useImperativeHandle } from "react"

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
          <Label htmlFor="scriptType" className="text-white">
            Script/Automation Type *
          </Label>
          <select
            id="scriptType"
            {...register("scriptType")}
            className="mt-2 w-full bg-black/50 border-white/20 focus:border-accent/50 rounded-md p-2 text-white"
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
          {errors.scriptType && <p className="text-red-400 text-sm mt-1">{errors.scriptType.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="frequency" className="text-white">
              How Often? *
            </Label>
            <select
              id="frequency"
              {...register("frequency")}
              className="mt-2 w-full bg-black/50 border-white/20 focus:border-accent/50 rounded-md p-2 text-white"
            >
              <option value="">Select frequency...</option>
              <option value="one-time">One-time project</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="on-demand">On-demand</option>
            </select>
            {errors.frequency && <p className="text-red-400 text-sm mt-1">{errors.frequency.message}</p>}
          </div>

          <div>
            <Label htmlFor="urgency" className="text-white">
              Urgency Level *
            </Label>
            <select
              id="urgency"
              {...register("urgency")}
              className="mt-2 w-full bg-black/50 border-white/20 focus:border-accent/50 rounded-md p-2 text-white"
            >
              <option value="">Select urgency...</option>
              <option value="asap">ASAP (1-3 days)</option>
              <option value="week">Within a week</option>
              <option value="month">Within a month</option>
              <option value="flexible">Flexible</option>
            </select>
            {errors.urgency && <p className="text-red-400 text-sm mt-1">{errors.urgency.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="currentProcess" className="text-white">
            Current Manual Process (Optional)
          </Label>
          <Textarea
            id="currentProcess"
            {...register("currentProcess")}
            rows={3}
            className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
            placeholder="Describe how you currently do this manually..."
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-white">
            Script/Automation Details *
          </Label>
          <Textarea
            id="message"
            {...register("message")}
            rows={4}
            className="mt-2 bg-black/50 border-white/20 focus:border-accent/50"
            placeholder="Describe what you need automated, inputs/outputs, desired outcome, etc..."
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

ScriptsContactForm.displayName = "ScriptsContactForm"

export default ScriptsContactForm
