import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, ExternalLink } from 'lucide-react'
import { getRecentBlocks, getTestnetStatus, shortHash, formatTimestamp, TESTNET_EXPLORER, type BlockInfo, type TestnetStatus } from '../services/CasperService'

export default function TestnetBlockFeed() {
  const [blocks, setBlocks] = useState<BlockInfo[]>([])
  const [status, setStatus] = useState<TestnetStatus>({ isConnected: false, blockHeight: 0, chainName: 'casper-test', lastUpdated: '--' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const [blocks, status] = await Promise.all([
        getRecentBlocks(6),
        getTestnetStatus()
      ])
      setBlocks(blocks)
      setStatus(status)
    } catch (e: any) {
      setError('RPC temporarily unreachable — retrying...')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 8000) // refresh every ~8s (faster than Casper's 4.6s block time)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Status header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: status.isConnected ? '#1dd1a1' : '#ff4757',
            boxShadow: status.isConnected ? '0 0 6px #1dd1a1' : '0 0 6px #ff4757',
            animation: 'pulseNeon 2s infinite'
          }} />
          <span style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', color: status.isConnected ? '#1dd1a1' : '#ff4757', fontWeight: 700 }}>
            {status.isConnected ? status.chainName.toUpperCase() : 'CONNECTING...'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            #{status.blockHeight.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {loading && <RefreshCw size={12} style={{ color: 'var(--color-accent)', animation: 'spinBorder 1s linear infinite' }} />}
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Updated {status.lastUpdated}</span>
        </div>
      </div>

      {error && (
        <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontFamily: 'JetBrains Mono, monospace', padding: '0.5rem 0.75rem', background: 'rgba(0,210,211,0.06)', borderRadius: '8px', border: '1px solid rgba(0,210,211,0.15)' }}>
          ⚠ {error}
        </div>
      )}

      {/* Block list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {(loading && blocks.length === 0
          ? Array(4).fill(null)
          : blocks
        ).map((block, i) => (
          <div key={i} className="live-block-item" style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr auto',
            gap: '0.75rem',
            alignItems: 'center',
            padding: '0.65rem 0.85rem',
            background: i === 0 ? 'rgba(29,209,161,0.04)' : 'rgba(255,255,255,0.015)',
            border: `1px solid ${i === 0 ? 'rgba(29,209,161,0.2)' : 'rgba(255,255,255,0.04)'}`,
            borderRadius: '10px',
            transition: 'all 0.3s ease'
          }}>
            {block ? (
              <>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: i === 0 ? '#1dd1a1' : '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
                    #{block.height.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    Era {block.eraId}
                  </div>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {shortHash(block.hash, 10)}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {formatTimestamp(block.timestamp)}
                  </div>
                </div>
                <a
                  href={`${TESTNET_EXPLORER}/block/${block.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-muted)', opacity: 0.6, transition: 'opacity 0.2s' }}
                  title="View on CSPR.live"
                >
                  <ExternalLink size={12} />
                </a>
              </>
            ) : (
              <>
                <div style={{ height: '32px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', animation: 'pulseNeon 2s infinite' }} />
                <div style={{ height: '32px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', animation: 'pulseNeon 2s infinite' }} />
                <div />
              </>
            )}
          </div>
        ))}
      </div>

      <a
        href={TESTNET_EXPLORER}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', opacity: 0.8 }}
      >
        <ExternalLink size={11} /> Open CSPR.live Testnet Explorer
      </a>
    </div>
  )
}
