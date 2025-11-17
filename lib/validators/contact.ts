import { z } from "zod"

// Original AI Automations contact schema
export const contactBasicsSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
  trap: z.string().max(0, "Invalid submission"),
})

export const discoveryAnswersSchema = z.object({
  hoursFocus: z.string().optional(),
  followupPain: z.array(z.string()).optional(),
  repeatedLookups: z.string().optional(),
  singlePointProcess: z.string().optional(),
  morningKPIs: z.string().optional(),
  integrations: z.array(z.string()).optional(),
})

export const webDevContactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  timeline: z.string().min(1, "Please select a timeline"),
  budget: z.string().min(1, "Please select a budget range"),
  existingWebsite: z.string().optional(),
  message: z.string().min(10, "Project details must be at least 10 characters"),
  trap: z.string().max(0, "Invalid submission"),
})

export const softwareToolsContactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().min(1, "Company name is required"),
  softwareType: z.string().min(1, "Please select a software type"),
  userCount: z.string().min(1, "Please select expected user count"),
  timeline: z.string().min(1, "Please select a timeline"),
  integrations: z.string().optional(),
  message: z.string().min(10, "Software requirements must be at least 10 characters"),
  trap: z.string().max(0, "Invalid submission"),
})

export const scriptsContactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  scriptType: z.string().min(1, "Please select a script type"),
  frequency: z.string().min(1, "Please select frequency"),
  urgency: z.string().min(1, "Please select urgency level"),
  currentProcess: z.string().optional(),
  message: z.string().min(10, "Script details must be at least 10 characters"),
  trap: z.string().max(0, "Invalid submission"),
})

export const contactPayloadSchema = contactBasicsSchema
  .merge(discoveryAnswersSchema)
  .extend({
    category: z.enum(["web-dev", "software-tools", "scripts", "ai-automations"]).optional(),
  })

export const webDevPayloadSchema = webDevContactSchema.extend({
  category: z.literal("web-dev"),
})

export const softwareToolsPayloadSchema = softwareToolsContactSchema.extend({
  category: z.literal("software-tools"),
})

export const scriptsPayloadSchema = scriptsContactSchema.extend({
  category: z.literal("scripts"),
})

export type ContactBasicsInput = z.input<typeof contactBasicsSchema>
export type DiscoveryAnswersInput = z.input<typeof discoveryAnswersSchema>
export type ContactPayloadInput = z.input<typeof contactPayloadSchema>

export type WebDevContactInput = z.input<typeof webDevContactSchema>
export type SoftwareToolsContactInput = z.input<typeof softwareToolsContactSchema>
export type ScriptsContactInput = z.input<typeof scriptsContactSchema>
