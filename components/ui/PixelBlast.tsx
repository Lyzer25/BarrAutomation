"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { cn } from "@/lib/utils"

interface PixelBlastProps {
  variant?: "square" | "circle"
  pixelSize?: number
  color?: string
  patternScale?: number
  patternDensity?: number
  pixelSizeJitter?: number
  liquid?: boolean
  liquidStrength?: number
  liquidRadius?: number
  liquidWobbleSpeed?: number
  speed?: number
  edgeFade?: number
  transparent?: boolean
  className?: string
}

function PixelBlastScene({
  variant = "square",
  pixelSize = 2,
  color = "#7C0A02",
  patternScale = 3.5,
  patternDensity = 1.1,
  pixelSizeJitter = 0.4,
  liquid = false,
  liquidStrength = 0.12,
  liquidRadius = 1.2,
  liquidWobbleSpeed = 5,
  speed = 0.8,
  edgeFade = 0,
}: Omit<PixelBlastProps, "transparent" | "className">) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { size } = useThree()

  // Create shader material with pixelated dithering effect
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uColor: { value: new THREE.Color(color) },
        uPixelSize: { value: pixelSize },
        uPatternScale: { value: patternScale },
        uPatternDensity: { value: patternDensity },
        uPixelSizeJitter: { value: pixelSizeJitter },
        uLiquid: { value: liquid ? 1.0 : 0.0 },
        uLiquidStrength: { value: liquidStrength },
        uLiquidRadius: { value: liquidRadius },
        uLiquidWobbleSpeed: { value: liquidWobbleSpeed },
        uSpeed: { value: speed },
        uEdgeFade: { value: edgeFade },
        uVariant: { value: variant === "circle" ? 1.0 : 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uColor;
        uniform float uPixelSize;
        uniform float uPatternScale;
        uniform float uPatternDensity;
        uniform float uPixelSizeJitter;
        uniform float uLiquid;
        uniform float uLiquidStrength;
        uniform float uLiquidRadius;
        uniform float uLiquidWobbleSpeed;
        uniform float uSpeed;
        uniform float uEdgeFade;
        uniform float uVariant;
        
        varying vec2 vUv;
        
        // Noise function for dithering pattern
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Apply liquid distortion
          if (uLiquid > 0.5) {
            float distortX = sin(uTime * uLiquidWobbleSpeed + uv.y * 10.0) * uLiquidRadius * uLiquidStrength;
            float distortY = cos(uTime * uLiquidWobbleSpeed + uv.x * 10.0) * uLiquidRadius * uLiquidStrength;
            uv.x += distortX;
            uv.y += distortY;
          }
          
          // Calculate pixel grid
          vec2 pixelUv = floor(uv * uResolution / (uPixelSize * uPatternScale)) * (uPixelSize * uPatternScale) / uResolution;
          
          // Add jitter to pixel size
          float jitter = random(pixelUv) * uPixelSizeJitter;
          
          // Create dithering pattern with animation
          float pattern = noise(pixelUv * uPatternScale + uTime * uSpeed);
          pattern = pattern * uPatternDensity;
          
          // Apply variant (square or circle)
          if (uVariant > 0.5) {
            vec2 center = fract(uv * uResolution / (uPixelSize * uPatternScale)) - 0.5;
            float dist = length(center);
            pattern *= smoothstep(0.5, 0.3, dist);
          }
          
          // Apply edge fade
          if (uEdgeFade > 0.0) {
            float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
            pattern *= smoothstep(0.0, uEdgeFade, edgeDist);
          }
          
          // Output color with pattern opacity
          vec3 finalColor = uColor;
          float alpha = clamp(pattern + jitter, 0.0, 1.0) * 0.6;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    })
  }, [
    color,
    pixelSize,
    patternScale,
    patternDensity,
    pixelSizeJitter,
    liquid,
    liquidStrength,
    liquidRadius,
    liquidWobbleSpeed,
    speed,
    edgeFade,
    variant,
    size.width,
    size.height,
  ])

  // Update uniforms on resize
  useEffect(() => {
    if (shaderMaterial.uniforms.uResolution) {
      shaderMaterial.uniforms.uResolution.value.set(size.width, size.height)
    }
  }, [size, shaderMaterial])

  // Animate shader
  useFrame((state) => {
    if (meshRef.current && shaderMaterial.uniforms.uTime) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

export default function PixelBlast({
  variant = "square",
  pixelSize = 2,
  color = "#7C0A02",
  patternScale = 3.5,
  patternDensity = 1.1,
  pixelSizeJitter = 0.4,
  liquid = false,
  liquidStrength = 0.12,
  liquidRadius = 1.2,
  liquidWobbleSpeed = 5,
  speed = 0.8,
  edgeFade = 0,
  transparent = false,
  className,
}: PixelBlastProps) {
  return (
    <div className={cn("pointer-events-none", className)}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ alpha: true, antialias: false }}
        style={{
          background: transparent ? "transparent" : "black",
        }}
      >
        <PixelBlastScene
          variant={variant}
          pixelSize={pixelSize}
          color={color}
          patternScale={patternScale}
          patternDensity={patternDensity}
          pixelSizeJitter={pixelSizeJitter}
          liquid={liquid}
          liquidStrength={liquidStrength}
          liquidRadius={liquidRadius}
          liquidWobbleSpeed={liquidWobbleSpeed}
          speed={speed}
          edgeFade={edgeFade}
        />
      </Canvas>
    </div>
  )
}
