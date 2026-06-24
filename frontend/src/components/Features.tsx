import { Mic, Camera, Code, Zap, Shield, Globe } from 'lucide-react'

const features = [
  {
    icon: <Mic size={28} />,
    title: 'Voice Intelligence Agent',
    description: 'Speak naturally to query balances, stake CSPR, swap tokens, or deploy contracts. Real-time STT and TTS powered by Web Speech API.',
    color: 'var(--color-primary)',
    glow: 'rgba(255,71,87,0.15)',
  },
  {
    icon: <Camera size={28} />,
    title: 'Real-World Vision Scanner',
    description: 'Point your camera at any physical object or flowchart sketch. The AI detects, identifies, and triggers contract generation or CEP-78 NFT minting.',
    color: 'var(--color-accent)',
    glow: 'rgba(0,210,211,0.15)',
  },
  {
    icon: <Code size={28} />,
    title: 'Odra Rust IDE',
    description: 'An in-browser smart contract editor. Write, compile to WASM, and deploy Casper Odra Rust contracts to Testnet — all without leaving the dashboard.',
    color: 'var(--color-secondary)',
    glow: 'rgba(142,68,173,0.15)',
  },
  {
    icon: <Zap size={28} />,
    title: 'x402 Micropayments & MCP',
    description: 'Autonomous AI agent execution settled via x402 payment channels. Interacts with Model Context Protocol (MCP) servers to execute dex/blockchain tools.',
    color: 'var(--color-warning)',
    glow: 'rgba(255,159,67,0.15)',
  },
  {
    icon: <Shield size={28} />,
    title: 'CEP-78 NFT Minting',
    description: 'Digitize physical assets as on-chain digital twins. The vision agent automatically generates CEP-78 metadata and submits the mint transaction.',
    color: 'var(--color-success)',
    glow: 'rgba(29,209,161,0.15)',
  },
  {
    icon: <Globe size={28} />,
    title: 'DeFi Blockchain Copilot',
    description: 'Stake, delegate, swap, and track validator performance through conversational commands. Full integration with Casper Testnet RPC.',
    color: '#a29bfe',
    glow: 'rgba(162,155,254,0.15)',
  },
]

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Core Capabilities</span>
          <h2 className="section-title">Everything Your Web3 Workflow Needs</h2>
          <p className="section-subtitle">
            Autonomous AI agent portal powered by the official Casper AI Toolkit, MCP server schemas, and Rust Odra IDE compiler toolchains.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              style={{ '--card-glow': f.glow, '--card-color': f.color } as React.CSSProperties}
            >
              <div className="feature-icon" style={{ color: f.color, background: f.glow }}>
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
