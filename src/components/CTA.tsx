import { ArrowRight } from 'lucide-react'

interface CTAProps {
  onLaunchApp: () => void
}

export default function CTA({ onLaunchApp }: CTAProps) {
  return (
    <section className="cta-section">
      <div className="cta-orb cta-orb-1" />
      <div className="cta-orb cta-orb-2" />
      <div className="section-inner">
        <div className="cta-content">
          <span className="section-tag">Get Started Today</span>
          <h2 className="cta-title">
            Ready to Experience the Future<br />
            of <span className="cta-title-accent">Blockchain Interaction?</span>
          </h2>
          <p className="cta-subtitle">
            Launch Casper Nexus and control the Casper Network with your voice and vision. 
            No setup required. No wallet extensions needed.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary-hero" onClick={onLaunchApp}>
              Launch the App <ArrowRight size={18} />
            </button>
            <a
              href="https://github.com/bakarezainab/Casper-Nexus"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-hero"
            >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> View on GitHub
            </a>
          </div>
          <div className="cta-stats">
            <div className="cta-stat">
              <span className="cta-stat-val">6</span>
              <span className="cta-stat-lbl">AI Modules</span>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <span className="cta-stat-val">x402</span>
              <span className="cta-stat-lbl">Micropayments</span>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <span className="cta-stat-val">CEP-78</span>
              <span className="cta-stat-lbl">NFT Standard</span>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <span className="cta-stat-val">Odra</span>
              <span className="cta-stat-lbl">Rust IDE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
// DoraHacks link integrated for hackathon visibility
