import { Mic, Globe, Shield, Code, TrendingUp, Camera } from 'lucide-react'

const useCases = [
  {
    icon: <TrendingUp size={24} />,
    tag: 'DeFi',
    title: 'Voice-Powered DeFi Operations',
    description: 'Stake CSPR, delegate to validators, and execute token swaps using nothing but natural language. The agent handles all transaction construction and signing automatically.',
    highlight: 'Say "Stake 500 CSPR to the top validator" and watch it happen.',
    color: 'var(--color-primary)',
  },
  {
    icon: <Camera size={24} />,
    tag: 'Real-World Assets',
    title: 'Physical-to-Digital Asset Bridging',
    description: 'Point the camera at any real-world item — a piece of art, collectible, or document. Casper Nexus identifies it, generates metadata, and registers it as a CEP-78 NFT on Casper.',
    highlight: 'Turn physical collectibles into verified on-chain digital twins instantly.',
    color: 'var(--color-accent)',
  },
  {
    icon: <Code size={24} />,
    tag: 'Smart Contracts',
    title: 'Flowchart-to-Contract Generation',
    description: 'Draw or sketch a smart contract flowchart on paper. Scan it with Vision mode and the AI writes the Odra Rust smart contract code, compiles it to WASM, and deploys it to Testnet.',
    highlight: 'No-code smart contract creation powered by computer vision.',
    color: 'var(--color-secondary)',
  },
  {
    icon: <Shield size={24} />,
    tag: 'Agentic AI',
    title: 'Self-Funded AI Agent Operations',
    description: 'Every inference call, RPC query, and vision task is autonomously funded by the x402 micropayment channel. The agent manages its own compute budget on the Casper Network.',
    highlight: 'Truly autonomous: the agent pays for itself in real time.',
    color: 'var(--color-warning)',
  },
  {
    icon: <Globe size={24} />,
    tag: 'Global Access',
    title: 'Browser-Native Web3 Portal',
    description: 'No wallet extension required. No app installation. Open Casper Nexus from any browser and immediately interact with the Casper Testnet through your voice and camera.',
    highlight: 'The most accessible Web3 interface ever built on Casper.',
    color: 'var(--color-success)',
  },
  {
    icon: <Mic size={24} />,
    tag: 'Education',
    title: 'Interactive Blockchain Learning',
    description: 'Ask the agent to explain concepts while it demonstrates them live on-chain. Learn staking, NFTs, and smart contracts through direct voice interaction with the blockchain.',
    highlight: 'Learn Casper by doing, not just reading.',
    color: '#a29bfe',
  },
]

export default function UseCases() {
  return (
    <section className="section section-alt" id="use-cases">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Real Applications</span>
          <h2 className="section-title">Built for Real-World Use Cases</h2>
          <p className="section-subtitle">
            From DeFi trading to physical asset tokenization — Casper Nexus opens new possibilities for how humans interact with blockchain.
          </p>
        </div>

        <div className="usecases-grid">
          {useCases.map((uc, i) => (
            <div key={i} className="usecase-card" style={{ '--uc-color': uc.color } as React.CSSProperties}>
              <div className="usecase-header">
                <div className="usecase-icon" style={{ color: uc.color, background: `${uc.color}18` }}>
                  {uc.icon}
                </div>
                <span className="usecase-tag" style={{ color: uc.color, background: `${uc.color}15`, borderColor: `${uc.color}30` }}>
                  {uc.tag}
                </span>
              </div>
              <h3 className="usecase-title">{uc.title}</h3>
              <p className="usecase-desc">{uc.description}</p>
              <div className="usecase-highlight">
                <span>→</span> {uc.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
