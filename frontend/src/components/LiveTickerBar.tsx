import { useEffect, useState } from 'react'
import { TrendingUp, Activity } from 'lucide-react'
import { getTestnetStatus } from '../services/CasperService'

const ticks = [
  { label: 'CSPR/USD', base: 0.043, variance: 0.003, integer: false },
  { label: 'Block Height', base: 0, variance: 0, integer: true, live: true },
  { label: 'Network TPS', base: 24.7, variance: 2, integer: false },
  { label: 'Active Validators', base: 100, variance: 0, integer: true },
  { label: 'x402 Settlements', base: 3128, variance: 10, integer: true },
  { label: 'CEP-78 NFTs', base: 58420, variance: 5, integer: true },
  { label: 'Era', base: 12050, variance: 0, integer: true },
]

export default function LiveTickerBar() {
  const [values, setValues] = useState(ticks.map(t => t.base))
  const [liveBlockHeight, setLiveBlockHeight] = useState<number | null>(null)

  // Poll real testnet block height
  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const status = await getTestnetStatus()
        if (status.isConnected && status.blockHeight > 0) {
          setLiveBlockHeight(status.blockHeight)
        }
      } catch {
        // silent fail
      }
    }
    fetchBlock()
    const interval = setInterval(fetchBlock, 9000)
    return () => clearInterval(interval)
  }, [])

  // Animate simulated values
  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => prev.map((v, i) => {
        const t = ticks[i]
        if (t.live) return v // handled by liveBlockHeight
        const delta = (Math.random() - 0.5) * t.variance * 0.4
        const next = v + delta
        return t.integer ? Math.round(next) : parseFloat(next.toFixed(3))
      }))
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  const getDisplayValue = (tick: typeof ticks[0], i: number): string => {
    if (tick.live) {
      const bh = liveBlockHeight ?? values[i]
      return bh > 0 ? bh.toLocaleString() : '—'
    }
    return tick.integer ? values[i].toLocaleString() : values[i].toFixed(3)
  }

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
            <Activity size={12} style={{ color: tick.live ? '#ff4757' : '#1dd1a1' }} />
            <span style={{ fontSize: '0.78rem', color: '#a4b0be', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
              {tick.label}
            </span>
            <span style={{ fontSize: '0.8rem', color: tick.live ? '#ff4757' : '#00d2d3', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
              {getDisplayValue(tick, i % ticks.length)}
            </span>
            {tick.live && liveBlockHeight && (
              <span style={{ fontSize: '0.6rem', color: '#1dd1a1', fontWeight: 700 }}>LIVE</span>
            )}
            <TrendingUp size={11} style={{ color: '#1dd1a1', opacity: 0.7 }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  )
}
