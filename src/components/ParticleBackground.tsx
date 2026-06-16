import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  r: number
  vx: number
  vy: number
  opacity: number
  color: string
}

const COLORS = ['#ff4757', '#00d2d3', '#8e44ad', '#ff9f43']

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const count = 28
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: 1.5 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        opacity: 0.2 + Math.random() * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      }))
    )
  }, [])

  useEffect(() => {
    let frame: number
    const animate = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.vx + 100) % 100,
        y: (p.y + p.vy + 100) % 100,
      })))
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <svg
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.7 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {particles.map(p => (
        <circle
          key={p.id}
          cx={`${p.x}%`}
          cy={`${p.y}%`}
          r={p.r}
          fill={p.color}
          opacity={p.opacity}
        />
      ))}
    </svg>
  )
}
