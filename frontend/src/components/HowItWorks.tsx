const steps = [
  {
    number: '01',
    title: 'Connect & Activate Agent',
    description: 'Open the Casper Nexus dashboard. Your AI agent boots up, connects to the Casper Testnet RPC, and opens an x402 micropayment channel automatically.',
    detail: 'No wallet setup required for exploration. The agent initialises state from the Casper node directly.',
  },
  {
    number: '02',
    title: 'Speak or Scan',
    description: 'Click the mic orb and issue a voice command — "Stake 100 CSPR", "Check my balance", or "Mint this object as an NFT". Or switch to Vision mode and point your camera.',
    detail: 'Web Speech API handles STT. The agent routes your intent to the right blockchain module automatically.',
  },
  {
    number: '03',
    title: 'Agent Processes & Executes',
    description: 'The AI agent interprets intent, queries Casper RPC state roots, constructs deploy transactions, and deducts compute costs via the x402 micropayment channel.',
    detail: 'All agent steps are logged in real time in the Chain Metrics Console on the right panel.',
  },
  {
    number: '04',
    title: 'On-Chain Confirmation',
    description: 'Transactions are broadcast to Casper Testnet. The agent reads block confirmations, displays deploy hashes, and speaks the result back to you via TTS.',
    detail: 'Smart contract deployments generate a unique hash-prefix address stored on Casper permanently.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section section-alt" id="how-it-works">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Step by Step</span>
          <h2 className="section-title">How Casper Nexus Works</h2>
          <p className="section-subtitle">
            From a single voice command to a confirmed on-chain transaction — four simple steps.
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
                <p className="step-detail">{step.detail}</p>
              </div>
              {i < steps.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
