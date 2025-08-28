import { z } from "zod"

export const contactBasicsSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
  trap: z.string().max(0, "Invalid submission"), // honeypot field
})

export const discoveryAnswersSchema = z.object({
  hoursFocus: z.string().optional(),
  followupPain: z.array(z.string()).optional(),
  repeatedLookups: z.string().optional(),
  singlePointProcess: z.string().optional(),
  morningKPIs: z.string().optional(),
  integrations: z.array(z.string()).optional(),
})

export const contactPayloadSchema = contactBasicsSchema.merge(discoveryAnswersSchema)

export type ContactBasicsInput = z.input<typeof contactBasicsSchema>
export type DiscoveryAnswersInput = z.input<typeof discoveryAnswersSchema>
export type ContactPayloadInput = z.input<typeof contactPayloadSchema>
