'use client'

import { useEffect, useRef } from 'react'

interface Beam {
  x: number
  y: number
  width: number
  length: number
  angle: number
  speed: number
  opacity: number
  hue: number
  saturation: number
  lightness: number
  pulse: number
  pulseSpeed: number
}

function createBeam(width: number, height: number): Beam {
  // Mostly teal-family hues (155–175), occasional gold accent (35–45)
  const isGold = Math.random() < 0.15
  const hue = isGold
    ? 35 + Math.random() * 12          // gold: ~38 (matches #c9a24d)
    : 155 + Math.random() * 22         // teal: ~165 (matches #0b4742)
  const angle = -30 + Math.random() * 14

  return {
    x: Math.random() * width * 1.4 - width * 0.2,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 40 + Math.random() * 80,
    length: height * 2.8,
    angle,
    speed: 0.35 + Math.random() * 0.55,
    opacity: isGold
      ? 0.06 + Math.random() * 0.08   // gold beams stay very subtle
      : 0.07 + Math.random() * 0.11,  // teal beams slightly bolder
    hue,
    saturation: isGold ? 55 : 70,
    lightness: isGold ? 60 : 45,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.015 + Math.random() * 0.025,
  }
}

function resetBeam(
  beam: Beam,
  index: number,
  total: number,
  width: number,
  height: number
): Beam {
  const col = index % 3
  const spacing = width / 3
  const isGold = Math.random() < 0.15
  beam.y = height + 120
  beam.x = col * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5
  beam.width = 60 + Math.random() * 80
  beam.speed = 0.3 + Math.random() * 0.5
  beam.hue = isGold ? 35 + Math.random() * 12 : 155 + Math.random() * 22
  beam.saturation = isGold ? 55 : 70
  beam.lightness = isGold ? 60 : 45
  beam.opacity = isGold ? 0.06 + Math.random() * 0.07 : 0.07 + Math.random() * 0.10
  return beam
}

export default function BeamsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const beamsRef = useRef<Beam[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const BEAM_COUNT = 28

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      beamsRef.current = Array.from({ length: BEAM_COUNT }, () =>
        createBeam(w, h)
      )
    }

    resize()
    window.addEventListener('resize', resize)

    function drawBeam(beam: Beam, w: number, h: number) {
      ctx!.save()
      ctx!.translate(beam.x, beam.y)
      ctx!.rotate((beam.angle * Math.PI) / 180)

      const pulsingOpacity = beam.opacity * (0.75 + Math.sin(beam.pulse) * 0.25)
      const { hue: hu, saturation: sa, lightness: li } = beam

      const grad = ctx!.createLinearGradient(0, 0, 0, beam.length)
      grad.addColorStop(0,   `hsla(${hu}, ${sa}%, ${li}%, 0)`)
      grad.addColorStop(0.08,`hsla(${hu}, ${sa}%, ${li}%, ${pulsingOpacity * 0.4})`)
      grad.addColorStop(0.35,`hsla(${hu}, ${sa}%, ${li}%, ${pulsingOpacity})`)
      grad.addColorStop(0.65,`hsla(${hu}, ${sa}%, ${li}%, ${pulsingOpacity})`)
      grad.addColorStop(0.92,`hsla(${hu}, ${sa}%, ${li}%, ${pulsingOpacity * 0.4})`)
      grad.addColorStop(1,   `hsla(${hu}, ${sa}%, ${li}%, 0)`)

      ctx!.fillStyle = grad
      ctx!.fillRect(-beam.width / 2, 0, beam.width, beam.length)
      ctx!.restore()
    }

    function animate() {
      if (!canvas || !ctx) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      ctx.clearRect(0, 0, w, h)
      ctx.filter = 'blur(32px)'

      beamsRef.current.forEach((beam, i) => {
        beam.y -= beam.speed
        beam.pulse += beam.pulseSpeed
        if (beam.y + beam.length < -80) {
          resetBeam(beam, i, beamsRef.current.length, w, h)
        }
        drawBeam(beam, w, h)
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.9,
      }}
    />
  )
}
