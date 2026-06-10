import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Models from './components/Models'
import UseCases from './components/UseCases'
import CTA from './components/CTA'
import Footer from './components/Footer'
import './landing.css'

interface LandingPageProps {
  onLaunchApp: () => void
}

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing-root">
      {/* Global animated SVG dot grid overlay */}
      <div className="global-grid-overlay" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      <Navbar onLaunchApp={onLaunchApp} />
      <main>
        <Hero onLaunchApp={onLaunchApp} onExplore={scrollToFeatures} />
        <Features />
        <HowItWorks />
        <Models />
        <UseCases />
        <CTA onLaunchApp={onLaunchApp} />
      </main>
      <Footer />
    </div>
  )
}
