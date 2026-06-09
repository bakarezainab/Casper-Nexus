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
