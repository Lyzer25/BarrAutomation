"use server"

import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  company: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  isCustom: z.boolean(),
})

export type FormState = {
  message: string
  errors?: {
    name?: string[]
    email?: string[]
    message?: string[]
  }
  success: boolean
}

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const isCustom = formData.get("isCustom") === "on"

  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    message: formData.get("message"),
    isCustom: isCustom,
  })

  if (!validatedFields.success) {
    return {
      message: "Please correct the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    }
  }

  // Here you would typically send an email or save to a database.
  // For this demo, we'll just log it and simulate success.
  console.log("New Contact Form Submission:")
  console.log(validatedFields.data)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    message: "Thanks! We'll be in touch within 1 business day.",
    success: true,
  }
}
