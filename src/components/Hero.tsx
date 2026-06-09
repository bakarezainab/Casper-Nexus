import { ArrowRight, Mic, Camera, Code } from 'lucide-react'

interface HeroProps {
  onLaunchApp: () => void
  onExplore: () => void
}

export default function Hero({ onLaunchApp, onExplore }: HeroProps) {
  return (
    <section className="hero-section">
      {/* Background orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Casper Agentic Buildathon 2026
        </div>

        {/* Main logo mark */}
        <div className="hero-logo-mark">
          <div className="hero-logo-ring hero-logo-ring-outer" />
          <div className="hero-logo-ring hero-logo-ring-middle" />
          <div className="hero-logo-ring hero-logo-ring-inner" />
          <div className="hero-logo-core">N</div>
        </div>

        {/* Headline */}
        <h1 className="hero-headline">
          <span>Speak.</span>
          <span>See.</span>
          <span className="hero-headline-accent">Deploy.</span>
        </h1>

        {/* Subheadline */}
        <p className="hero-subheadline">
          Casper Nexus is an autonomous multimodal AI agent that fuses voice commands, 
          computer vision, and x402 micropayments to let you interact with the 
          <span className="text-accent"> Casper Network</span> in real time.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta-group">
          <button className="btn-primary-hero" onClick={onLaunchApp}>
            Launch the App <ArrowRight size={18} />
          </button>
          <button className="btn-secondary-hero" onClick={onExplore}>
            Explore Features
          </button>
        </div>

        {/* Feature pills */}
        <div className="hero-pills">
          <div className="hero-pill"><Mic size={14} /> Voice Agent</div>
          <div className="hero-pill"><Camera size={14} /> Vision Scanner</div>
          <div className="hero-pill"><Code size={14} /> Odra Rust IDE</div>
          <div className="hero-pill">⚡ x402 Payments</div>
          <div className="hero-pill">🛡️ CEP-78 NFTs</div>
          <div className="hero-pill">🔗 Casper Testnet</div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <div className="scroll-mouse"><div className="scroll-wheel" /></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}
