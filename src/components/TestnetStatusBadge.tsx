import { useState, useEffect } from 'react'
import { getTestnetStatus, getPeers, type TestnetStatus } from '../services/CasperService'

export default function TestnetStatusBadge() {
  const [status, setStatus] = useState<TestnetStatus>({
    isConnected: false,
    blockHeight: 0,
    chainName: 'casper-test',
    lastUpdated: '--'
  })
  const [peersCount, setPeersCount] = useState<number>(0)

  useEffect(() => {
    const fetch = async () => {
      const s = await getTestnetStatus()
      setStatus(s)
      if (s.isConnected) {
        try {
          const peers = await getPeers()
          setPeersCount(peers.length)
        } catch {
          setPeersCount(0)
        }
      }
    }
    fetch()
    const interval = setInterval(fetch, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.45rem',
      padding: '0.3rem 0.75rem',
      borderRadius: '20px',
      background: status.isConnected ? 'rgba(29,209,161,0.08)' : 'rgba(255,71,87,0.08)',
      border: `1px solid ${status.isConnected ? 'rgba(29,209,161,0.25)' : 'rgba(255,71,87,0.2)'}`,
      fontSize: '0.72rem',
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 600,
      color: status.isConnected ? '#1dd1a1' : '#ff4757',
      cursor: 'default',
      userSelect: 'none',
      transition: 'all 0.4s ease'
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: status.isConnected ? '#1dd1a1' : '#ff4757',
        boxShadow: status.isConnected ? '0 0 6px #1dd1a1' : '0 0 6px #ff4757',
        animation: status.isConnected ? 'pulseNeon 2s infinite' : 'none',
        flexShrink: 0
      }} />
      <span>
        {status.isConnected
          ? `Testnet Live · #${status.blockHeight.toLocaleString()}${peersCount > 0 ? ` · ${peersCount} peers` : ''}`
          : 'Connecting...'}
      </span>
    </div>
  )
}
