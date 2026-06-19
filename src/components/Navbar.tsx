import { useState, useEffect } from 'react'
import { Zap, Wallet } from 'lucide-react'
import TestnetStatusBadge from './TestnetStatusBadge'
import WalletConnectModal from './WalletConnectModal'

interface NavbarProps {
  onLaunchApp: () => void
}

const DEMO_ACCOUNT = {
  publicKey: '0202f55418d9807c6e9b9a3bab9a69aae0a7539cb90d65b36ca91f8de3f698a7cf7f',
  accountHash: 'account-hash-1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef12345678',
  balance: '3,450.25',
  staked: '1,200.00',
}

export default function Navbar({ onLaunchApp }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectedAccount, setConnectedAccount] = useState<typeof DEMO_ACCOUNT | undefined>()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleConnect = (account: typeof DEMO_ACCOUNT) => {
    setConnectedAccount(account)
    setIsConnected(true)
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <div className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="logo-icon">
              <Zap size={18} />
            </div>
            <span className="logo-text">Casper<span className="logo-accent">Nexus</span></span>
          </div>

          {/* Desktop nav links */}
          <ul className="navbar-links">
            <li><button onClick={() => scrollTo('features')}>Features</button></li>
            <li><button onClick={() => scrollTo('how-it-works')}>How It Works</button></li>
            <li><button onClick={() => scrollTo('models')}>Models</button></li>
            <li><button onClick={() => scrollTo('use-cases')}>Use Cases</button></li>
            <li><button onClick={() => scrollTo('about')}>About</button></li>
            <li><button onClick={() => scrollTo('faq')}>FAQ</button></li>
          </ul>

          {/* Right side */}
          <div className="navbar-actions">
            {/* Live testnet status */}
            <TestnetStatusBadge />

            {/* Wallet connect button */}
            <button
              onClick={() => setWalletOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.42rem 0.85rem',
                background: isConnected ? 'rgba(29,209,161,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isConnected ? 'rgba(29,209,161,0.3)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                color: isConnected ? '#1dd1a1' : '#a4b0be',
                fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.2s'
              }}
            >
              <Wallet size={14} />
              {isConnected ? `${connectedAccount?.publicKey.substring(0, 8)}...` : 'Connect'}
            </button>

            <button className="btn-launch" onClick={onLaunchApp}>Launch App</button>
          </div>

          {/* Mobile hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <button onClick={() => scrollTo('features')}>Features</button>
            <button onClick={() => scrollTo('how-it-works')}>How It Works</button>
            <button onClick={() => scrollTo('models')}>Models</button>
            <button onClick={() => scrollTo('use-cases')}>Use Cases</button>
            <button onClick={() => scrollTo('about')}>About</button>
            <button onClick={() => scrollTo('faq')}>FAQ</button>
            <button onClick={() => { setWalletOpen(true); setMenuOpen(false) }}>
              <Wallet size={14} style={{ marginRight: '0.4rem' }} />
              {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
            <button className="btn-launch" onClick={onLaunchApp}>Launch App</button>
          </div>
        )}
      </nav>

      <WalletConnectModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
        onConnect={handleConnect}
        isConnected={isConnected}
        connectedAccount={connectedAccount}
      />
    </>
  )
}
