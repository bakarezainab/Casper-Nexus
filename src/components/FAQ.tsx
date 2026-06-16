import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is Casper Nexus?',
    a: 'Casper Nexus is an autonomous multimodal AI agent built for the Casper Agentic Buildathon 2026. It combines voice commands, computer vision, and x402 micropayments to give you real-time control over the Casper Network.'
  },
  {
    q: 'How does the Voice Agent work?',
    a: 'The Voice Agent uses the Web Speech API (STT) to capture your commands and Web Speech Synthesis (TTS) for responses. Commands like "Check balance", "Stake 100 CSPR", or "Mint NFT" are routed to the appropriate blockchain modules automatically.'
  },
  {
    q: 'What is x402 and why is it used?',
    a: 'x402 is an HTTP-native micropayment protocol. Every AI inference call, vision scan, or agent query is settled autonomously via tiny CSPR payments deducted from your channel balance — making the agent truly self-funding and trustless.'
  },
  {
    q: 'Do I need a wallet extension?',
    a: 'No. Casper Nexus is designed to work without external wallet extensions. All transactions are simulated against the Casper Testnet for the hackathon demo, with RPC calls made directly from the browser.'
  },
  {
    q: 'What is CEP-78 NFT minting?',
    a: 'CEP-78 is the Casper Network NFT standard. The Vision Agent can scan a physical object with your camera and automatically generate its metadata and mint it as a digital twin NFT on the Casper blockchain.'
  },
  {
    q: 'What is the Odra Rust IDE?',
    a: 'The built-in Odra Rust IDE lets you write, compile, and deploy Casper smart contracts using the Odra framework. The Vision Agent can even scan flowchart sketches and auto-generate the Rust code for you.'
  }
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about Casper Nexus</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '780px', margin: '0 auto' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: open === i ? 'rgba(255,71,87,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${open === i ? 'rgba(255,71,87,0.2)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '14px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  textAlign: 'left',
                  gap: '1rem'
                }}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  style={{
                    flexShrink: 0,
                    color: '#ff4757',
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </button>
              {open === i && (
                <div style={{ padding: '0 1.5rem 1.25rem', color: '#a4b0be', lineHeight: '1.7', fontSize: '0.95rem' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
