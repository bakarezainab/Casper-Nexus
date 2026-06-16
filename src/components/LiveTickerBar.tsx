import { useEffect, useState } from 'react'
import { TrendingUp, Activity } from 'lucide-react'

const ticks = [
  { label: 'CSPR/USD', base: 0.043, variance: 0.003 },
  { label: 'Block Height', base: 1489215, variance: 0, integer: true },
  { label: 'Network TPS', base: 24.7, variance: 2 },
  { label: 'Active Validators', base: 100, variance: 0, integer: true },
  { label: 'x402 Settlements', base: 3128, variance: 10, integer: true },
  { label: 'CEP-78 NFTs', base: 58420, variance: 5, integer: true },
]

export default function LiveTickerBar() {
  const [values, setValues] = useState(ticks.map(t => t.base))

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => prev.map((v, i) => {
        const t = ticks[i]
        const delta = (Math.random() - 0.5) * t.variance * 0.4
        const next = v + delta
        return t.integer ? Math.round(next) : parseFloat(next.toFixed(3))
      }))
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '0.65rem 0',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 5,
    }}>
      <div style={{
        display: 'flex',
        gap: '3rem',
        animation: 'tickerScroll 30s linear infinite',
        width: 'max-content',
        alignItems: 'center',
      }}>
        {[...ticks, ...ticks].map((tick, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', whiteSpace: 'nowrap' }}>
            <Activity size={12} style={{ color: '#1dd1a1' }} />
            <span style={{ fontSize: '0.78rem', color: '#a4b0be', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
              {tick.label}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#00d2d3', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
              {tick.integer ? values[i % ticks.length].toLocaleString() : values[i % ticks.length].toFixed(3)}
            </span>
            <TrendingUp size={11} style={{ color: '#1dd1a1', opacity: 0.7 }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  )
}
