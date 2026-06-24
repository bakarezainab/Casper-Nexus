import { useState } from 'react'
import { X, Wallet, Shield, ExternalLink, Copy, Check } from 'lucide-react'
import { TESTNET_EXPLORER, getAccountBalance } from '../services/CasperService'

const DEMO_ACCOUNT = {
  publicKey: '0202f55418d9807c6e9b9a3bab9a69aae0a7539cb90d65b36ca91f8de3f698a7cf7f',
  accountHash: 'account-hash-1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef12345678',
  balance: '3,450.25',
  staked: '1,200.00',
}

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (account: typeof DEMO_ACCOUNT) => void
  isConnected: boolean
  connectedAccount?: typeof DEMO_ACCOUNT
}

export default function WalletConnectModal({ isOpen, onClose, onConnect, isConnected, connectedAccount }: WalletConnectModalProps) {
  const [copied, setCopied] = useState(false)
  const [connecting, setConnecting] = useState(false)

  if (!isOpen) return null

  const handleConnect = async () => {
    setConnecting(true)
    
    // @ts-ignore
    const casperWalletProvider = window.CasperWalletProvider
    // @ts-ignore
    const casperSignerHelper = window.casperlabsHelper

    try {
      if (casperWalletProvider) {
        const provider = casperWalletProvider()
        const isConnected = await provider.requestConnection()
        if (isConnected) {
          const activeKey = await provider.getActivePublicKey()
          const balance = await getAccountBalance(activeKey)
          onConnect({
            publicKey: activeKey,
            accountHash: `account-hash-${activeKey.substring(0, 16)}...`,
            balance: balance.toLocaleString(),
            staked: '0.00',
          })
          onClose()
          return
        }
      } else if (casperSignerHelper) {
        await casperSignerHelper.requestConnection()
        const activeKey = await casperSignerHelper.getActivePublicKey()
        const balance = await getAccountBalance(activeKey)
        onConnect({
          publicKey: activeKey,
          accountHash: `account-hash-${activeKey.substring(0, 16)}...`,
          balance: balance.toLocaleString(),
          staked: '0.00',
        })
        onClose()
        return
      } else {
        // Fallback to pre-loaded account
        await new Promise(r => setTimeout(r, 1000))
        onConnect(DEMO_ACCOUNT)
        onClose()
      }
    } catch (err) {
      console.error("Wallet connection failed", err)
      onConnect(DEMO_ACCOUNT)
      onClose()
    } finally {
      setConnecting(false)
    }
  }

  const copyKey = () => {
    navigator.clipboard.writeText(connectedAccount?.publicKey ?? DEMO_ACCOUNT.publicKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,17,26,0.98) 0%, rgba(20,24,40,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '2rem',
        width: '420px',
        maxWidth: '94vw',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,71,87,0.1)',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#a4b0be' }}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#ff4757,#8e44ad)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#a4b0be' }}>Casper Network Testnet</div>
          </div>
        </div>

        {isConnected && connectedAccount ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Account info */}
            <div style={{ background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1dd1a1', boxShadow: '0 0 6px #1dd1a1' }} />
                <span style={{ fontSize: '0.75rem', color: '#1dd1a1', fontWeight: 700 }}>CONNECTED</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a4b0be', fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
                {connectedAccount.publicKey.substring(0, 32)}...
              </div>
              <button onClick={copyKey} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.3rem 0.65rem', cursor: 'pointer', fontSize: '0.72rem', color: '#a4b0be' }}>
                {copied ? <Check size={11} style={{ color: '#1dd1a1' }} /> : <Copy size={11} />}
                {copied ? 'Copied!' : 'Copy Key'}
              </button>
            </div>

            {/* Balances */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Available', value: connectedAccount.balance + ' CSPR', color: '#fff' },
                { label: 'Staked', value: connectedAccount.staked + ' CSPR', color: '#00d2d3' }
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#a4b0be', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <a href={`${TESTNET_EXPLORER}/account/${connectedAccount.publicKey}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.65rem', background: 'rgba(0,210,211,0.06)', border: '1px solid rgba(0,210,211,0.2)', borderRadius: '10px', color: '#00d2d3', fontSize: '0.8rem', textDecoration: 'none' }}>
              <ExternalLink size={13} /> View on CSPR.live Explorer
            </a>

            <button onClick={onClose} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#a4b0be', cursor: 'pointer', fontSize: '0.88rem' }}>
              Close
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,71,87,0.04)', border: '1px solid rgba(255,71,87,0.12)', borderRadius: '12px', fontSize: '0.82rem', color: '#a4b0be', lineHeight: '1.6' }}>
              <Shield size={14} style={{ color: '#ff4757', marginBottom: '0.4rem', display: 'block' }} />
              Connect your Casper Signer wallet to interact with the Casper Testnet. A demo account is pre-loaded for the hackathon prototype.
            </div>

            {/* Casper Signer option */}
            <button onClick={handleConnect} disabled={connecting} style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
              background: connecting ? 'rgba(255,71,87,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${connecting ? 'rgba(255,71,87,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '12px', cursor: connecting ? 'not-allowed' : 'pointer',
              textAlign: 'left', width: '100%', transition: 'all 0.2s'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg,#ff4757,#8e44ad)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Wallet size={18} style={{ color: '#fff' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  {connecting ? 'Connecting...' : 'Casper Signer'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a4b0be' }}>Demo account (Testnet)</div>
              </div>
              {connecting && (
                <div style={{ marginLeft: 'auto', width: '16px', height: '16px', border: '2px solid rgba(255,71,87,0.3)', borderTopColor: '#ff4757', borderRadius: '50%', animation: 'spinBorder 0.8s linear infinite' }} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
