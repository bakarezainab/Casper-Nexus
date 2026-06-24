const models = [
  {
    category: 'Blockchain Layer',
    color: 'var(--color-primary)',
    items: [
      { name: 'Casper Testnet', desc: 'Proof-of-Stake Layer 1 blockchain' },
      { name: 'Casper RPC 2.0', desc: 'JSON-RPC state root querying' },
      { name: 'Odra Framework', desc: 'Rust smart contract SDK' },
      { name: 'CEP-78 Standard', desc: 'Casper NFT standard' },
    ],
  },
  {
    category: 'AI & Voice',
    color: 'var(--color-accent)',
    items: [
      { name: 'Web Speech API', desc: 'Browser-native STT recognition' },
      { name: 'Speech Synthesis', desc: 'TTS voice response engine' },
      { name: 'Vision Inference', desc: 'Simulated CV object detection' },
      { name: 'Intent Router', desc: 'NLP command classification' },
    ],
  },
  {
    category: 'Payments & Infrastructure',
    color: 'var(--color-secondary)',
    items: [
      { name: 'x402 Protocol', desc: 'HTTP-native micropayment standard' },
      { name: 'CSPR.trade MCP', desc: 'DEX aggregator price routing' },
      { name: 'React + Vite', desc: 'Fast frontend build system' },
      { name: 'Cargo WASM', desc: 'wasm32-unknown-unknown toolchain' },
    ],
  },
]

export default function Models() {
  return (
    <section className="section" id="models">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Tech Stack</span>
          <h2 className="section-title">Powered By Cutting-Edge Technology</h2>
          <p className="section-subtitle">
            Casper Nexus leverages the latest blockchain, AI, and payment standards to deliver a seamless agentic experience.
          </p>
        </div>

        <div className="models-grid">
          {models.map((group, i) => (
            <div key={i} className="model-group" style={{ '--group-color': group.color } as React.CSSProperties}>
              <div className="model-group-header">
                <div className="model-group-dot" style={{ background: group.color }} />
                <h3 className="model-group-title">{group.category}</h3>
              </div>
              <div className="model-items">
                {group.items.map((item, j) => (
                  <div key={j} className="model-item">
                    <div className="model-item-name">{item.name}</div>
                    <div className="model-item-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Compatibility Bar */}
        <div className="compat-bar">
          {['Casper Testnet', 'Web Speech API', 'WASM', 'CEP-78', 'x402', 'Odra SDK', 'React 19', 'Vite 8'].map((tag) => (
            <span key={tag} className="compat-tag">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
