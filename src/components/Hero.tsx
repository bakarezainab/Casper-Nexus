import { ArrowRight, Mic, Camera, Code, Zap, TrendingUp, Shield } from 'lucide-react'

interface HeroProps {
  onLaunchApp: () => void
  onExplore: () => void
}

const floatingCards = [
  { icon: <Mic size={16} />, label: 'Voice Command', value: 'Stake 100 CSPR', color: '#ff4757', delay: '0s' },
  { icon: <TrendingUp size={16} />, label: 'Delegated', value: '1,200 CSPR', color: '#1dd1a1', delay: '0.6s' },
  { icon: <Shield size={16} />, label: 'NFT Minted', value: 'RWA Twin #528', color: '#8e44ad', delay: '1.2s' },
  { icon: <Zap size={16} />, label: 'x402 Balance', value: '4.85 CSPR', color: '#00d2d3', delay: '1.8s' },
]

export default function Hero({ onLaunchApp, onExplore }: HeroProps) {
  return (
    <section className="hero-section">
      {/* Background image layer */}
      <div className="hero-bg-image" />
      {/* Gradient vignette over image */}
      <div className="hero-bg-vignette" />

      {/* Floating ambient orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      <div className="hero-inner">
        {/* ── LEFT: Text Column ── */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Casper Agentic Buildathon 2026
          </div>

          <h1 className="hero-headline">
            Speak. See. Deploy.<br />
            that <span className="hero-headline-accent">Controls</span><br />
            the Blockchain
          </h1>

          <p className="hero-subheadline">
            Casper Nexus fuses <strong>voice commands</strong>, <strong>computer vision</strong>, 
            and <strong>x402 micropayments</strong> into one autonomous portal — 
            giving you real-time control over the Casper Network without wallets or extensions.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary-hero" onClick={onLaunchApp}>
              Launch the App <ArrowRight size={18} />
            </button>
            <button className="btn-secondary-hero" onClick={onExplore}>
              Explore Features
            </button>
          </div>

          <div className="hero-trust-bar">
            <span className="hero-trust-label">Powered by</span>
            <span className="hero-trust-chip">Casper Testnet</span>
            <span className="hero-trust-chip">Odra Rust</span>
            <span className="hero-trust-chip">x402 Protocol</span>
            <span className="hero-trust-chip">CEP-78 NFT</span>
          </div>
        </div>

        {/* ── RIGHT: Visual Panel ── */}
        <div className="hero-right">
          {/* Central glow hub */}
          <div className="hero-visual-hub">
            <div className="hub-ring hub-ring-1" />
            <div className="hub-ring hub-ring-2" />
            <div className="hub-ring hub-ring-3" />
            <div className="hub-core">
              <span>N</span>
            </div>

            {/* Module orbit icons */}
            <div className="hub-orbit hub-orbit-1"><Mic size={18} /></div>
            <div className="hub-orbit hub-orbit-2"><Camera size={18} /></div>
            <div className="hub-orbit hub-orbit-3"><Code size={18} /></div>
            <div className="hub-orbit hub-orbit-4"><Zap size={18} /></div>
          </div>

          {/* Live activity cards */}
          <div className="hero-floating-cards">
            {floatingCards.map((card, i) => (
              <div
                key={i}
                className="hero-float-card"
                style={{ animationDelay: card.delay, '--card-accent': card.color } as React.CSSProperties}
              >
                <div className="float-card-icon" style={{ color: card.color, background: `${card.color}18` }}>
                  {card.icon}
                </div>
                <div className="float-card-body">
                  <span className="float-card-label">{card.label}</span>
                  <span className="float-card-value" style={{ color: card.color }}>{card.value}</span>
                </div>
                <div className="float-card-dot" style={{ background: card.color }} />
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="hero-stats-row">
            <div className="hero-stat">
              <span className="hero-stat-val">4.6s</span>
              <span className="hero-stat-lbl">Block Time</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <span className="hero-stat-val" style={{ color: '#1dd1a1' }}>Live</span>
              <span className="hero-stat-lbl">Testnet RPC</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <span className="hero-stat-val">6</span>
              <span className="hero-stat-lbl">AI Modules</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="hero-bottom-fade" />
    </section>
  )
}
