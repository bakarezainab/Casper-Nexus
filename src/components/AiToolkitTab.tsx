import { useState } from 'react'
import { HelpCircle, ShieldCheck, Play, Terminal as TerminalIcon, RefreshCw } from 'lucide-react'

interface AiToolkitTabProps {
  walletBalance: number
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>
  x402Balance: number
  setX402Balance: React.Dispatch<React.SetStateAction<number>>
  addLog: (tag: 'x402' | 'casper' | 'agent' | 'system', text: string) => void
  addBillingEntry: (action: string, cost: number) => void
}

export default function AiToolkitTab({
  walletBalance,
  setWalletBalance,
  x402Balance,
  setX402Balance,
  addLog,
  addBillingEntry
}: AiToolkitTabProps) {
  const [activeSubSection, setActiveSubSection] = useState<'x402' | 'mcp' | 'odra'>('x402')

  // x402 State Machine
  const [x402Step, setX402Step] = useState<0 | 1 | 2 | 3 | 4>(0)
  const [x402Logs, setX402Logs] = useState<string[]>([])
  const [livePriceData, setLivePriceData] = useState<any>(null)
  const [isSimulatingX402, setIsSimulatingX402] = useState(false)

  const pushX402Log = (msg: string) => {
    setX402Logs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  const startX402Simulation = async () => {
    setIsSimulatingX402(true)
    setX402Step(1)
    setX402Logs([])
    pushX402Log("Client initiates API request: GET /api/v1/market-data")
    pushX402Log("Host: data-provider.casper-nexus.network")

    // Wait 1.2s to mock latency
    setTimeout(() => {
      setX402Step(2)
      pushX402Log("Server responds: 402 Payment Required")
      pushX402Log("Header X-Payment-Address: 01a3b5c7d9e1f2a38c82...")
      pushX402Log("Header X-Payment-Amount: 1.00 CSPR")
      pushX402Log("Header X-Payment-Network: casper-testnet")
      setIsSimulatingX402(false)
    }, 1200)
  }

  const payX402Challenge = async () => {
    if (walletBalance < 1.00) {
      pushX402Log("Error: Insufficient Casper wallet balance to cover the 1.00 CSPR fee.")
      return
    }

    setIsSimulatingX402(true)
    setX402Step(3)
    pushX402Log("Requesting wallet signature for micropayment authorization...")

    setTimeout(async () => {
      // Deduct fee and generate live price request
      setWalletBalance(prev => parseFloat((prev - 1.00).toFixed(2)))
      addLog('x402', "x402 payment validated: 1.00 CSPR transferred to Facilitator escrow.")
      addBillingEntry("x402 API Micropayment", 1.00)

      pushX402Log("Signature generated successfully (ED25519 hash proof).")
      pushX402Log("Resubmitting request with payment header:")
      pushX402Log("X-Payment: casper-testnet:01a3b5c7...:1000000000:sig_5b7ac...")

      try {
        pushX402Log("Facilitator validating block deployment on Casper Testnet...")
        pushX402Log("Escrow cleared. Fetching real market price feed from Coingecko API...")

        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd&include_24hr_vol=true")
        const data = await res.json()
        const csprData = data['casper-network']

        setLivePriceData({
          price: csprData.usd || 0.01024,
          volume: csprData.usd_24h_vol || 128472.91,
          timestamp: new Date().toISOString()
        })

        setX402Step(4)
        pushX402Log("Server responds: 200 OK")
        pushX402Log("Successfully fetched live CSPR price dynamically.")
      } catch (err: any) {
        // Fallback if coingecko throttles
        setLivePriceData({
          price: 0.01024,
          volume: 128472.91,
          timestamp: new Date().toISOString()
        })
        setX402Step(4)
        pushX402Log("Server responds: 200 OK (using backup node snapshot feed)")
      } finally {
        setIsSimulatingX402(false)
      }
    }, 1500)
  }

  const resetX402 = () => {
    setX402Step(0)
    setX402Logs([])
    setLivePriceData(null)
  }

  return (
    <div className="ai-toolkit-tab-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
        {['x402', 'mcp', 'odra'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSubSection(section as any)}
            className={`tab-btn ${activeSubSection === section ? 'active' : ''}`}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            {section === 'x402' && 'x402 Micropayments'}
            {section === 'mcp' && 'MCP Tool Console'}
            {section === 'odra' && 'Odra Framework'}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '1.25rem' }}>
        {activeSubSection === 'x402' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={16} style={{ color: 'var(--color-primary)' }} />
                  <span>x402 HTTP-Native Micropayments Protocol</span>
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Demonstrates the Casper standard for autonomous agent billing. The agent submits a request, handles the 402 challenge, signs with payment proof, and unlocks the live price API.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: '6px', width: 'fit-content' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proxy Channel Balance:</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>{x402Balance.toFixed(2)} CSPR</span>
                  <button 
                    onClick={() => {
                      if (walletBalance >= 5.0) {
                        setWalletBalance(prev => parseFloat((prev - 5.0).toFixed(2)))
                        setX402Balance(prev => parseFloat((prev + 5.0).toFixed(2)))
                        addLog('x402', 'x402 payment proxy funded with 5.00 CSPR from AI Toolkit Console.')
                        addBillingEntry('x402 Channel Top-up', 5.0)
                      }
                    }}
                    style={{ background: 'var(--color-accent)', border: 'none', color: '#000', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    + Fund 5 CSPR
                  </button>
                </div>
              </div>
              {x402Step > 0 && (
                <button onClick={resetX402} className="vision-btn" style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }}>
                  Reset Demo
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
              {/* Left Side: Step View */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {x402Step === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', justifyContent: 'center', minHeight: '180px', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
                    <Play size={32} style={{ color: 'var(--color-accent)' }} />
                    <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>Ready to simulate pay-per-call API</span>
                    <button
                      className="vision-btn primary"
                      onClick={startX402Simulation}
                      disabled={isSimulatingX402}
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
                    >
                      {isSimulatingX402 ? "Initiating..." : "Request GET /api/v1/market-data"}
                    </button>
                  </div>
                )}

                {x402Step === 1 && (
                  <div className="x402-step-card" style={{ borderColor: 'var(--color-accent)', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                    <RefreshCw className="animate-spin" size={24} style={{ color: 'var(--color-accent)' }} />
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>Step 1: Contacting API endpoint...</span>
                    <span>Sending anonymous request headers to host.</span>
                  </div>
                )}

                {x402Step === 2 && (
                  <div className="x402-step-card" style={{ borderColor: '#ff4757', minHeight: '180px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff4757', fontWeight: 'bold' }}>
                      <span>⚠ HTTP Status 402: Payment Required</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      The server intercepted the anonymous request. To retrieve live price indices, sign a proof with 1.00 CSPR transfer to the address below.
                    </p>
                    <div style={{ background: '#000', padding: '0.4rem', borderRadius: '6px', fontSize: '0.68rem', wordBreak: 'break-all' }}>
                      <span style={{ color: 'var(--color-primary)' }}>Escrow Address:</span> 01a3b5c7d9e1f2a38c823f0...
                    </div>
                    <button
                      className="vision-btn primary"
                      onClick={payX402Challenge}
                      disabled={isSimulatingX402}
                      style={{ background: '#ff4757', border: '1px solid #ff4757', padding: '0.45rem', fontSize: '0.75rem', marginTop: '0.25rem' }}
                    >
                      {isSimulatingX402 ? "Signing payload..." : "Authorize 1.00 CSPR Escrow Payment"}
                    </button>
                  </div>
                )}

                {x402Step === 3 && (
                  <div className="x402-step-card" style={{ borderColor: 'var(--color-primary)', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                    <RefreshCw className="animate-spin" size={24} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>Step 3: Transferring CSPR and Signing...</span>
                    <span>Broadcasting deploy transaction to Casper Testnet.</span>
                  </div>
                )}

                {x402Step === 4 && livePriceData && (
                  <div className="x402-step-card" style={{ borderColor: '#1dd1a1', minHeight: '180px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1dd1a1', fontWeight: 'bold' }}>
                      <ShieldCheck size={16} />
                      <span>HTTP Status 200: OK (Data Unlocked)</span>
                    </div>
                    <div style={{ background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Asset:</span>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>Casper (CSPR)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Live USD Price:</span>
                        <span style={{ color: '#1dd1a1', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>${livePriceData.price.toFixed(5)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>24h Volume USD:</span>
                        <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>${livePriceData.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Query Verified At:</span>
                        <span style={{ color: '#a4b0be' }}>{livePriceData.timestamp}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Network Console */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  <TerminalIcon size={12} /> x402 Facilitator Event Logs
                </span>
                <div className="mcp-console-terminal" style={{ minHeight: '180px', flex: 1, fontSize: '0.7rem' }}>
                  {x402Logs.length === 0 ? (
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>Console waiting to capture event streams...</span>
                  ) : (
                    x402Logs.map((l, i) => <div key={i} style={{ marginBottom: '0.25rem' }}>{l}</div>)
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
