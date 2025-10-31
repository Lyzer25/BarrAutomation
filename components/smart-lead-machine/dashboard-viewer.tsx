"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { gsap } from "gsap"
import type { DashboardData } from "@/types/automation-types"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, ArrowRight, MessageSquare, BrainCircuit, CheckCircle, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { mockDashboardData } from "@/lib/mock-dashboard"

const integrationAlternatives = {
  email: [
    { name: "Gmail", description: "Google's email service" },
    { name: "Outlook", description: "Microsoft's email service" },
    { name: "SendGrid", description: "Transactional email API" },
    { name: "Mailchimp", description: "Email marketing platform" },
  ],
  data: [
    { name: "Google Sheets", description: "Cloud-based spreadsheets" },
    { name: "Airtable", description: "Spreadsheet-database hybrid" },
    { name: "Notion", description: "All-in-one workspace" },
    { name: "Database", description: "SQL/NoSQL databases" },
  ],
  notification: [
    { name: "Discord", description: "Community chat platform" },
    { name: "Slack", description: "Real-time team chat" },
    { name: "Microsoft Teams", description: "Enterprise collaboration" },
    { name: "Twilio", description: "SMS and voice notifications" },
    { name: "Telegram", description: "Secure messaging app" },
  ],
  ai: [
    { name: "OpenAI", description: "GPT models for text generation" },
    { name: "Anthropic Claude", description: "Advanced AI assistant" },
    { name: "Google AI", description: "Machine learning services" },
  ],
}

const getIntegrationCategory = (integrationName: string): keyof typeof integrationAlternatives | null => {
  const name = integrationName.toLowerCase()
  if (["gmail", "outlook", "sendgrid", "mailchimp"].includes(name)) return "email"
  if (["sheets", "google sheets", "airtable", "notion", "database"].includes(name)) return "data"
  if (["discord", "slack", "teams", "microsoft teams", "twilio", "telegram"].includes(name)) return "notification"
  if (["openai", "anthropic", "claude", "google ai"].includes(name)) return "ai"
  return null
}

const MetricCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="flex flex-col items-center justify-center text-center space-y-3 p-6">
    <div className="text-red-400">{icon}</div>
    <p className="text-4xl font-mono font-bold text-white">{value}</p>
    <p className="text-base font-mono text-gray-400">{label}</p>
  </div>
)

const LeadScoreBar = ({ score }: { score: number }) => {
  const scoreColor = score > 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"
  return (
    <div className="w-full bg-gray-800 rounded-full h-4">
      <motion.div
        className={cn("h-4 rounded-full", scoreColor)}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      />
    </div>
  )
}

const BentoCardProps = {
  color: undefined,
  title: undefined,
  description: undefined,
  label: undefined,
  textAutoHide: undefined,
  disableAnimations: undefined,
  children: undefined,
  className: undefined,
}

const BentoProps = {
  textAutoHide: undefined,
  enableStars: undefined,
  enableSpotlight: undefined,
  enableBorderGlow: undefined,
  disableAnimations: undefined,
  spotlightRadius: undefined,
  particleCount: undefined,
  enableTilt: undefined,
  glowColor: undefined,
  clickEffect: undefined,
  enableMagnetism: undefined,
}

const DEFAULT_PARTICLE_COUNT = 12
const DEFAULT_SPOTLIGHT_RADIUS = 300
const DEFAULT_GLOW_COLOR = "132, 0, 255"
const MOBILE_BREAKPOINT = 768

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement("div")
  el.className = "particle"
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `
  return el
}

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
})

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect()
  const relativeX = ((mouseX - rect.left) / rect.width) * 100
  const relativeY = ((mouseY - rect.top) / rect.height) * 100

  card.style.setProperty("--glow-x", `${relativeX}%`)
  card.style.setProperty("--glow-y", `${relativeY}%`)
  card.style.setProperty("--glow-intensity", glow.toString())
  card.style.setProperty("--glow-radius", `${radius}px`)
}

const ParticleCard: React.FC<{
  children: React.ReactNode
  className?: string
  disableAnimations?: boolean
  style?: React.CSSProperties
  particleCount?: number
  glowColor?: string
  enableTilt?: boolean
  clickEffect?: boolean
  enableMagnetism?: boolean
}> = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const isHoveredRef = useRef(false)
  const memoizedParticles = useRef<HTMLDivElement[]>([])
  const particlesInitialized = useRef(false)
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null)

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return

    const { width, height } = cardRef.current.getBoundingClientRect()
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor),
    )
    particlesInitialized.current = true
  }, [particleCount, glowColor])

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    magnetismAnimationRef.current?.kill()

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle)
        },
      })
    })
    particlesRef.current = []
  }, [])

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return

    if (!particlesInitialized.current) {
      initializeParticles()
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return

        const clone = particle.cloneNode(true) as HTMLDivElement
        cardRef.current.appendChild(clone)
        particlesRef.current.push(clone)

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" })

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        })

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        })
      }, index * 100)

      timeoutsRef.current.push(timeoutId)
    })
  }, [initializeParticles])

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return

    const element = cardRef.current

    const handleMouseEnter = () => {
      isHoveredRef.current = true
      animateParticles()

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        })
      }
    }

    const handleMouseLeave = () => {
      isHoveredRef.current = false
      clearAllParticles()

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return

      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10
        const rotateY = ((x - centerX) / centerX) * 10

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        })
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05
        const magnetY = (y - centerY) * 0.05

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return

      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      )

      const ripple = document.createElement("div")
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `

      element.appendChild(ripple)

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      )
    }

    element.addEventListener("mouseenter", handleMouseEnter)
    element.addEventListener("mouseleave", handleMouseLeave)
    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("click", handleClick)

    return () => {
      isHoveredRef.current = false
      element.removeEventListener("mouseenter", handleMouseEnter)
      element.removeEventListener("mouseleave", handleMouseLeave)
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("click", handleClick)
      clearAllParticles()
    }
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor])

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  )
}

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>
  disableAnimations?: boolean
  enabled?: boolean
  spotlightRadius?: number
  glowColor?: string
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null)
  const isInsideSection = useRef(false)

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return

    const spotlight = document.createElement("div")
    spotlight.className = "global-spotlight"
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `
    document.body.appendChild(spotlight)
    spotlightRef.current = spotlight

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return

      const section = gridRef.current.closest(".bento-section")
      const rect = section?.getBoundingClientRect()
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

      isInsideSection.current = mouseInside || false
      const cards = gridRef.current.querySelectorAll(".card")

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        })
        cards.forEach((card) => {
          ;(card as HTMLElement).style.setProperty("--glow-intensity", "0")
        })
        return
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius)
      let minDistance = Number.POSITIVE_INFINITY

      cards.forEach((card) => {
        const cardElement = card as HTMLElement
        const cardRect = cardElement.getBoundingClientRect()
        const centerX = cardRect.left + cardRect.width / 2
        const centerY = cardRect.top + cardRect.height / 2
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2
        const effectiveDistance = Math.max(0, distance)

        minDistance = Math.min(minDistance, effectiveDistance)

        let glowIntensity = 0
        if (effectiveDistance <= proximity) {
          glowIntensity = 1
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity)
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius)
      })

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      })

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      isInsideSection.current = false
      gridRef.current?.querySelectorAll(".card").forEach((card) => {
        ;(card as HTMLElement).style.setProperty("--glow-intensity", "0")
      })
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current)
    }
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor])

  return null
}

const BentoCardGrid: React.FC<{
  children: React.ReactNode
  gridRef?: React.RefObject<HTMLDivElement | null>
}> = ({ children, gridRef }) => (
  <div
    className="bento-section grid gap-6 p-8 max-w-[90rem] mx-auto select-none relative"
    style={{ fontSize: "clamp(1.2rem, 1.1rem + 0.5vw, 1.8rem)" }}
    ref={gridRef}
  >
    {children}
  </div>
)

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

const MagicBento: React.FC<any & { data: DashboardData | null }> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  data,
}) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobileDetection()
  const shouldDisableAnimations = disableAnimations || isMobile
  const router = useRouter()
  const [showEmail, setShowEmail] = useState(false)
  const [showDiscord, setShowDiscord] = useState(false)

  const dashboard = data || mockDashboardData.dashboard
  const leadScore = dashboard.leadScore ?? mockDashboardData.dashboard.leadScore
  const category = dashboard.category ?? mockDashboardData.dashboard.category
  const leadData = dashboard.leadData ?? mockDashboardData.dashboard.leadData
  const metrics = dashboard.metrics ?? mockDashboardData.dashboard.metrics
  const processingTime = dashboard.processingTime ?? mockDashboardData.dashboard.processingTime
  const emailContent = dashboard.emailContent ?? mockDashboardData.dashboard.emailContent
  const discordMessage = dashboard.discordMessage ?? mockDashboardData.dashboard.discordMessage
  const integrations = dashboard.integrations ?? mockDashboardData.dashboard.integrations

  const scoreColorClass =
    Number(leadScore) > 80 ? "border-green-500" : Number(leadScore) >= 50 ? "border-yellow-500" : "border-red-500"

  const cardData: any[] = [
    {
      title: leadData?.name || "Unknown Lead",
      description: leadData?.email || "No email provided",
      label: "Lead Info",
      className: "col-span-2 row-span-2",
      children: (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-6">
            <div>
              <h3 className="text-3xl font-mono font-bold text-white mb-2">{leadData?.name || "Unknown Lead"}</h3>
              <p className="text-xl text-red-400 font-mono">{leadData?.email || "No email provided"}</p>
            </div>
            <Badge className={cn("text-lg font-mono whitespace-nowrap px-4 py-2", scoreColorClass)}>
              {category || "Unknown"}
            </Badge>
          </div>
          <div className="space-y-4 mb-6">
            <p className="text-lg font-mono text-gray-400">Lead Score: {leadScore || 0}/100</p>
            <LeadScoreBar score={Number(leadScore) || 0} />
          </div>
          <p className="text-lg text-gray-300 font-mono italic">"{leadData?.message || "No message provided"}"</p>
        </>
      ),
    },
    {
      title: "Metrics",
      label: "Performance",
      className: "col-span-2",
      children: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <MetricCard icon={<Clock className="w-10 h-10" />} label="Total Time" value={`${processingTime || "0"}s`} />
          <MetricCard
            icon={<BrainCircuit className="w-10 h-10" />}
            label="AI Response Time"
            value={metrics?.responseTime || "N/A"}
          />
          <MetricCard
            icon={<CheckCircle className="w-10 h-10" />}
            label="Conversion Chance"
            value={metrics?.conversionProbability || "N/A"}
          />
        </div>
      ),
    },
    {
      title: "Automation Outputs",
      label: "Results",
      className: "col-span-2 row-span-2",
      children: (
        <div className="space-y-6">
          <Button
            onClick={() => setShowEmail(!showEmail)}
            variant="outline"
            className="w-full justify-between text-lg py-4"
          >
            <span className="font-mono">Peek at Sent Email</span> <Mail className="h-6 w-6" />
          </Button>
          <AnimatePresence>
            {showEmail && emailContent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-gray-700 rounded-lg p-6 bg-black max-h-96 overflow-y-auto"
              >
                <h4 className="font-bold text-white font-mono text-xl mb-4">{emailContent.subject || "No Subject"}</h4>
                <div
                  className="prose prose-lg prose-invert mt-2 text-gray-300 font-sans leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: emailContent.body || "No content available" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={() => setShowDiscord(!showDiscord)}
            variant="outline"
            className="w-full justify-between text-lg py-4"
          >
            <span className="font-mono">Reveal Team Notification</span> <MessageSquare className="h-6 w-6" />
          </Button>
          <AnimatePresence>
            {showDiscord && discordMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-gray-700 rounded-lg p-6 bg-black max-h-96 overflow-y-auto"
              >
                <p className="font-bold text-white font-mono text-xl mb-2">{discordMessage.title || "No Title"}</p>
                <p className="text-lg text-gray-400 mt-1 font-mono mb-6">
                  {discordMessage.description || "No description"}
                </p>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  {discordMessage.fields?.map((field: any, index: number) => (
                    <div key={index}>
                      <p className="text-sm font-semibold text-gray-400 uppercase font-mono mb-2">
                        {field.name || "Unknown"}
                      </p>
                      <p className="text-lg text-white font-mono">{field.value || "N/A"}</p>
                    </div>
                  )) || <p className="text-gray-400">No fields available</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ),
    },
    {
      title: "Integration Stack",
      label: "Technology",
      children: (
        <>
          <p className="text-lg text-gray-400 font-mono mb-6">
            This workflow used {integrations?.length || 0} tools. Click to see alternatives.
          </p>
          <div className="flex flex-wrap gap-3">
            {integrations?.map((int: string) => {
              const category = getIntegrationCategory(int)
              return (
                <Popover key={int}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="font-mono cursor-pointer bg-transparent text-lg px-4 py-3">
                      {int}
                    </Button>
                  </PopoverTrigger>
                  {category && (
                    <PopoverContent className="w-80 bg-black border-2 border-gray-700 text-white p-6">
                      <div className="space-y-4">
                        <h4 className="font-mono font-medium leading-none text-lg">Category Alternatives:</h4>
                        <div className="flex flex-wrap gap-3">
                          <TooltipProvider>
                            {integrationAlternatives[category].map((alt) => (
                              <Tooltip key={alt.name} delayDuration={100}>
                                <TooltipTrigger asChild>
                                  <Badge className="cursor-default font-mono hover:border-red-500 hover:shadow-[0_0_8px_hsl(var(--accent)/0.5)] transition-all text-base px-3 py-2">
                                    {alt.name}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="bg-black border-gray-600 text-white text-base p-3">
                                  <p>{alt.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </TooltipProvider>
                        </div>
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full mt-6 font-mono bg-transparent text-lg py-3"
                          onClick={() => router.push("/contact")}
                        >
                          Customize This <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </PopoverContent>
                  )}
                </Popover>
              )
            }) || <p className="text-gray-400">No integrations available</p>}
          </div>
        </>
      ),
    },
    {
      title: "Adapt This Workflow",
      label: "Customization",
      children: (
        <>
          <div className="space-y-4 text-lg text-gray-300 font-mono">
            <p>
              <strong className="text-white">For E-commerce:</strong> Analyze abandoned carts, send personalized
              recovery emails.
            </p>
            <p>
              <strong className="text-white">For Support:</strong> Categorize tickets, analyze sentiment, route to
              agents with suggested replies.
            </p>
            <p>
              <strong className="text-white">No-Code:</strong> We build in platforms like n8n so you can drag-and-drop
              to make changes.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full mt-6 font-mono bg-transparent text-lg py-4"
            onClick={() => router.push("/contact")}
          >
            Build My Custom Version <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </>
      ),
    },
  ]

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: #392e4e;
            --background-dark: #060010;
            --white: hsl(0, 0%, 100%);
            --purple-primary: rgba(132, 0, 255, 1);
            --purple-glow: rgba(132, 0, 255, 0.2);
            --purple-border: rgba(132, 0, 255, 0.8);
          }
          
          .card-responsive {
            display: grid;
            gap: 1.5rem;
          }
          
          @media (min-width: 600px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(4, 1fr);
            }
            
            .card-responsive .card:nth-child(1) {
              grid-column: span 2;
              grid-row: span 2;
            }
            
            .card-responsive .card:nth-child(2) {
              grid-column: span 2;
            }
            
            .card-responsive .card:nth-child(3) {
              grid-column: span 2;
              grid-row: span 2;
            }
          }
          
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .card--border-glow:hover::after {
            opacity: 1;
          }
          
          .card--border-glow:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
          
          .particle-container:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.2), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive">
          {cardData.map((card, index) => {
            const baseClassName = `card flex flex-col justify-between relative aspect-[4/3] min-h-[350px] w-full max-w-full p-8 rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${
              enableBorderGlow ? "card--border-glow" : ""
            } ${card.className || ""}`

            const cardStyle = {
              backgroundColor: card.color || "var(--background-dark)",
              borderColor: "var(--border-color)",
              color: "var(--white)",
              "--glow-x": "50%",
              "--glow-y": "50%",
              "--glow-intensity": "0",
              "--glow-radius": "200px",
            } as React.CSSProperties

            if (enableStars) {
              return (
                <ParticleCard
                  key={index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {card.children}
                </ParticleCard>
              )
            }

            return (
              <div
                key={index}
                className={baseClassName}
                style={cardStyle}
                ref={(el) => {
                  if (!el) return

                  const handleMouseMove = (e: MouseEvent) => {
                    if (shouldDisableAnimations) return

                    const rect = el.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const centerX = rect.width / 2
                    const centerY = rect.height / 2

                    if (enableTilt) {
                      const rotateX = ((y - centerY) / centerY) * -10
                      const rotateY = ((x - centerX) / centerX) * 10

                      gsap.to(el, {
                        rotateX,
                        rotateY,
                        duration: 0.1,
                        ease: "power2.out",
                        transformPerspective: 1000,
                      })
                    }

                    if (enableMagnetism) {
                      const magnetX = (x - centerX) * 0.05
                      const magnetY = (y - centerY) * 0.05

                      gsap.to(el, {
                        x: magnetX,
                        y: magnetY,
                        duration: 0.3,
                        ease: "power2.out",
                      })
                    }
                  }

                  const handleMouseLeave = () => {
                    if (shouldDisableAnimations) return

                    if (enableTilt) {
                      gsap.to(el, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.3,
                        ease: "power2.out",
                      })
                    }

                    if (enableMagnetism) {
                      gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out",
                      })
                    }
                  }

                  const handleClick = (e: MouseEvent) => {
                    if (!clickEffect || shouldDisableAnimations) return

                    const rect = el.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top

                    const maxDistance = Math.max(
                      Math.hypot(x, y),
                      Math.hypot(x - rect.width, y),
                      Math.hypot(x, y - rect.height),
                      Math.hypot(x - rect.width, y - rect.height),
                    )

                    const ripple = document.createElement("div")
                    ripple.style.cssText = `
                      position: absolute;
                      width: ${maxDistance * 2}px;
                      height: ${maxDistance * 2}px;
                      border-radius: 50%;
                      background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                      left: ${x - maxDistance}px;
                      top: ${y - maxDistance}px;
                      pointer-events: none;
                      z-index: 1000;
                    `

                    el.appendChild(ripple)

                    gsap.fromTo(
                      ripple,
                      {
                        scale: 0,
                        opacity: 1,
                      },
                      {
                        scale: 1,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete: () => ripple.remove(),
                      },
                    )
                  }

                  el.addEventListener("mousemove", handleMouseMove)
                  el.addEventListener("mouseleave", handleMouseLeave)
                  el.addEventListener("click", handleClick)
                }}
              >
                {card.children}
              </div>
            )
          })}
        </div>
      </BentoCardGrid>
    </>
  )
}

export default function DashboardViewer({ data }: { data: DashboardData | null }) {
  return (
    <MagicBento
      textAutoHide={true}
      enableStars={true}
      enableSpotlight={true}
      enableBorderGlow={true}
      enableTilt={true}
      enableMagnetism={true}
      clickEffect={true}
      spotlightRadius={300}
      particleCount={12}
      glowColor="132, 0, 255"
      data={data}
    />
  )
}
