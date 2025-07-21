"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

export default function AnimatedStat({
  value,
  suffix,
  label,
  icon,
}: {
  value: number
  suffix: string
  label: string
  icon: React.ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US").format(latest.toFixed(0))
        }
      }),
    [springValue],
  )

  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-accent mb-2">{icon}</div>
      <div className="text-4xl md:text-5xl font-bold text-white">
        <span ref={ref} />
        {suffix}
      </div>
      <p className="text-sm text-subtle-gray mt-1">{label}</p>
    </div>
  )
}
