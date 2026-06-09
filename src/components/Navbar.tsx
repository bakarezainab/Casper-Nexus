import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'

interface NavbarProps {
  onLaunchApp: () => void
}

export default function Navbar({ onLaunchApp }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
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
        </ul>

        {/* Right side */}
        <div className="navbar-actions">
          <span className="navbar-badge">Built for Casper Buildathon</span>
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
          <button className="btn-launch" onClick={onLaunchApp}>Launch App</button>
        </div>
      )}
    </nav>
  )
}
