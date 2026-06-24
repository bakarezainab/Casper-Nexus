import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LiveTickerBar from './components/LiveTickerBar'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Models from './components/Models'
import UseCases from './components/UseCases'
import About from './components/About'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'
import TestnetBlockFeed from './components/TestnetBlockFeed'
import './landing.css'

interface LandingPageProps {
  onLaunchApp: () => void
  connectedWallet: any
  setConnectedWallet: (wallet: any) => void
}

export default function LandingPage({ onLaunchApp, connectedWallet, setConnectedWallet }: LandingPageProps) {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing-root">
      {/* Floating particle layer */}
      <ParticleBackground />

      {/* Global animated SVG dot grid overlay */}
      <div className="global-grid-overlay" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      <Navbar 
        onLaunchApp={onLaunchApp} 
        connectedWallet={connectedWallet}
        setConnectedWallet={setConnectedWallet}
      />

      {/* Live network metrics ticker directly below navbar */}
      <div style={{ marginTop: '72px', position: 'relative', zIndex: 5 }}>
        <LiveTickerBar />
      </div>

      <main>
        <Hero onLaunchApp={onLaunchApp} onExplore={scrollToFeatures} />
        <Features />
        <HowItWorks />
        <Models />
        <UseCases />
        <About />

        {/* Live Casper Testnet Block Feed — real on-chain data */}
        <section className="section" id="testnet-feed" style={{ scrollMarginTop: '80px' }}>
          <div className="section-header">
            <div className="section-badge">⛓ LIVE TESTNET</div>
            <h2 className="section-title">Casper Network <span className="text-accent">Live Feed</span></h2>
            <p className="section-subtitle">
              Real-time block data directly from <strong>rpc.testnet.casperlabs.io</strong> — no simulation
            </p>
          </div>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '1.5rem'
          }}>
            <TestnetBlockFeed />
          </div>
        </section>

        <FAQ />
        <CTA onLaunchApp={onLaunchApp} />
      </main>
      <Footer />
    </div>
  )
}
