import { ExternalLink } from 'lucide-react'

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

const team = [
  {
    name: 'Zainab Bakare',
    role: 'Lead Developer & AI Architect',
    avatar: 'Z',
    color: '#ff4757',
    bio: 'Full-stack engineer specializing in autonomous AI systems and Web3 integrations on the Casper Network.',
    links: { github: 'https://github.com/bakarezainab' }
  }
]

const timeline = [
  { date: 'Week 1', title: 'Concept & Architecture', desc: 'Designed the multimodal agent architecture combining voice, vision, and blockchain modules.' },
  { date: 'Week 2', title: 'Core Agent Implementation', desc: 'Built Voice Intelligence Agent (STT/TTS), Vision Scanner with HUD overlays, and Odra Rust IDE.' },
  { date: 'Week 3', title: 'Blockchain Integration', desc: 'Integrated x402 micropayment channels, CEP-78 NFT minting, and Casper Testnet RPC connectivity.' },
  { date: 'Week 4', title: 'Landing Page & Polish', desc: 'Designed the full landing page with glassmorphism UI, live metrics ticker, and submitted to DoraHacks.' },
]

export default function About() {
  return (
    <section id="about" className="section section-alt">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">About the Project</span>
          <h2 className="section-title">Built for the Casper Agentic Buildathon</h2>
          <p className="section-subtitle">
            Casper Nexus was designed and built as an entry to the{' '}
            <a href="https://dorahacks.io/hackathon/casper-agentic-buildathon/buidl" target="_blank" rel="noopener noreferrer" style={{ color: '#ff4757', textDecoration: 'none' }}>
              Casper Agentic Buildathon 2026
            </a>
            , exploring autonomous AI agents on a PoS blockchain.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>Development Timeline</h3>
            {timeline.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.25rem', paddingBottom: '1.75rem', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#ff4757,#8e44ad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#fff', zIndex: 1 }}>{i + 1}</div>
                  {i < timeline.length - 1 && <div style={{ width: '1px', flex: 1, background: 'rgba(255,71,87,0.2)', marginTop: '4px' }} />}
                </div>
                <div style={{ paddingTop: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ff4757', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.date}</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#a4b0be', marginTop: '0.3rem', lineHeight: '1.5' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Team */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>The Builder</h3>
            {team.map((member, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `linear-gradient(135deg, ${member.color}, #8e44ad)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: '#fff', boxShadow: `0 0 18px ${member.color}40` }}>
                    {member.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{member.name}</div>
                    <div style={{ fontSize: '0.82rem', color: '#ff4757', fontWeight: 600 }}>{member.role}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#a4b0be', lineHeight: '1.6' }}>{member.bio}</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a href={member.links.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#a4b0be', textDecoration: 'none', padding: '0.4rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', transition: 'all 0.2s' }}>
                    <GithubIcon /> GitHub
                  </a>
                  <a href="https://dorahacks.io/hackathon/casper-agentic-buildathon/buidl" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#a4b0be', textDecoration: 'none', padding: '0.4rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                    <ExternalLink size={14} /> DoraHacks
                  </a>
                </div>
              </div>
            ))}

            {/* Hackathon info box */}
            <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'rgba(255,71,87,0.04)', border: '1px solid rgba(255,71,87,0.15)', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ff4757', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>🏆 Hackathon Entry</div>
              <div style={{ fontSize: '0.88rem', color: '#a4b0be', lineHeight: '1.6' }}>
                Submitted to the <strong style={{ color: '#fff' }}>Casper Agentic Buildathon 2026</strong> on DoraHacks.<br/>
                Tracks: <span style={{ color: '#00d2d3' }}>Agentic AI · DeFi · Real-World Assets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
