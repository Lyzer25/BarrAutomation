"use client"

import { useRef, useEffect } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let nodes: any[] = []
    const nodeCount = 30
    const maxDist = 150

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initNodes = () => {
      nodes = []
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.random() * 0.5 - 0.25,
          vy: Math.random() * 0.5 - 0.25,
          radius: Math.random() * 2 + 1,
          pulse: Math.random() * Math.PI * 2,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        node.pulse += 0.02
        const pulseRadius = node.radius + Math.sin(node.pulse) * 0.8

        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2)
        ctx.fillStyle = "hsla(204, 100%, 50%, 0.5)" // Accent color with alpha
        ctx.fill()

        for (let j = i + 1; j < nodes.length; j++) {
          const otherNode = nodes[j]
          const dist = Math.sqrt((node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2)

          if (dist < maxDist) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.strokeStyle = `hsla(204, 100%, 50%, ${1 - dist / maxDist})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initNodes()
    animate()

    window.addEventListener("resize", () => {
      resizeCanvas()
      initNodes()
    })

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />
}
