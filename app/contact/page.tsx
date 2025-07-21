"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { submitContactForm, type FormState } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

const initialState: FormState = {
  message: "",
  success: false,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Submitting..." : "Send Message"}
    </Button>
  )
}

export default function ContactPage() {
  const [state, formAction] = useActionState(submitContactForm, initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (state.message && state.success) {
      toast({
        title: "Message Sent!",
        description: state.message,
      })
    } else if (state.message && !state.success) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, toast])

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center">
        <h1 className="font-mono text-4xl font-thin text-white md:text-5xl">Let's Build Your Automation</h1>
        <p className="mt-4 text-lg text-subtle-gray">
          We turn ideas into real, working automations using AI, Make, n8n, and custom code.
        </p>
      </div>

      <form action={formAction} className="mt-12 space-y-6">
        <div>
          <Label htmlFor="name" className="text-white">
            Name
          </Label>
          <Input id="name" name="name" type="text" required className="mt-2 bg-black border-white/20" />
          {state.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name[0]}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input id="email" name="email" type="email" required className="mt-2 bg-black border-white/20" />
          {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>}
        </div>
        <div>
          <Label htmlFor="company" className="text-white">
            Company (Optional)
          </Label>
          <Input id="company" name="company" type="text" className="mt-2 bg-black border-white/20" />
        </div>
        <div>
          <Label htmlFor="message" className="text-white">
            Message
          </Label>
          <Textarea id="message" name="message" required className="mt-2 bg-black border-white/20" rows={5} />
          {state.errors?.message && <p className="text-red-500 text-sm mt-1">{state.errors.message[0]}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isCustom"
            name="isCustom"
            className="border-white/50 data-[state=checked]:bg-accent data-[state=checked]:text-white"
          />
          <Label
            htmlFor="isCustom"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
          >
            I need a fully custom solution
          </Label>
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}
