// Stage 7: Speech Synthesis (TTS)
import { useState, useEffect, useRef } from 'react'
import { 
  Mic, 
  Camera, 
  Cpu, 
  Layers, 
  Terminal, 
  User, 
  Sparkles, 
  PlusCircle, 
  Wallet, 
  TrendingUp, 
  Volume2,
  VolumeX,
  RefreshCw,
  X,
  Code
} from 'lucide-react'
import './App.css'

interface Transcript {
  id: number
  sender: 'user' | 'agent'
  text: string
  time: string
}

interface LogEntry {
  id: number
  timestamp: string
  tag: 'x402' | 'casper' | 'agent' | 'system'
  text: string
}

interface BoundingBox {
  id: number
  label: string
  x: number
  y: number
  width: number
  height: number
}

function App() {
  const [activeTab, setActiveTab] = useState<'voice' | 'vision' | 'explorer'>('voice')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  
  // Wallet States
  const [walletBalance, setWalletBalance] = useState(3450.25)
  const [stakedBalance, setStakedBalance] = useState(1200.00)
  const [x402Balance, setX402Balance] = useState(5.00)
  
  // Transcripts & Logs
  const [transcripts, setTranscripts] = useState<Transcript[]>([
    {
      id: 1,
      sender: 'agent',
      text: "Hello! I am Casper Nexus, your agentic voice and vision assistant. Say 'check balance', 'stake Casper', or 'mint NFT' to get started.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: new Date().toLocaleTimeString(), tag: 'system', text: 'Casper Agentic Nexus Initialized.' },
    { id: 2, timestamp: new Date().toLocaleTimeString(), tag: 'x402', text: 'x402 Micropayment payment channel open. Deposited: 5.00 CSPR.' },
    { id: 3, timestamp: new Date().toLocaleTimeString(), tag: 'casper', text: 'Connected to Casper Testnet RPC: https://rpc.testnet.casper.network' }
  ])

  // Vision States
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [detectedObjects, setDetectedObjects] = useState<BoundingBox[]>([])
  const [selectedVisionAction, setSelectedVisionAction] = useState<'contract' | 'nft' | null>(null)
  
  // Smart Contract States
  const [contractCode, setContractCode] = useState<string>('')
  const [showContractModal, setShowContractModal] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [nftName, setNftName] = useState('')
  const [isMinting, setIsMinting] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const speechRecognitionRef = useRef<any>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of logs/transcripts
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcripts])

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        addLog('system', 'Voice Recognition system active. Listening...')
      }

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        handleUserSpeech(text)
      }

      recognition.onerror = (event: any) => {
        addLog('system', `Speech recognition error: ${event.error}`)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      speechRecognitionRef.current = recognition
    } else {
      addLog('system', 'Web Speech Recognition API not supported in this browser. Running in simulation mode.')
    }
  }, [])

  // Text to Speech
  const speakText = (text: string) => {
    if (isMuted) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    
    // Select a premium sounding voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    if (preferredVoice) utterance.voice = preferredVoice

    window.speechSynthesis.speak(utterance)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const addLog = (tag: 'x402' | 'casper' | 'agent' | 'system', text: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        tag,
        text
      }
    ])
  }

  // Handle Speech Commands
  const handleUserSpeech = (text: string) => {
    const userMessage: Transcript = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setTranscripts(prev => [...prev, userMessage])

    // deduct x402 payment
    const cost = 0.05
    setX402Balance(prev => {
      const next = parseFloat((prev - cost).toFixed(2))
      return next > 0 ? next : 0
    })
    addLog('x402', `Deducted ${cost} CSPR for prompt processing. Remaining: ${(x402Balance - cost).toFixed(2)} CSPR.`)

    // Simple intent routing logic
    const lowerText = text.toLowerCase()
    let reply = ''
    
    if (lowerText.includes('balance') || lowerText.includes('wallet') || lowerText.includes('much money')) {
      reply = `Your current Casper balance is ${walletBalance} CSPR. You also have ${stakedBalance} CSPR staked with your validator.`
      addLog('casper', 'Querying state path: accounts/019a.../balance')
      addLog('agent', `Balance checked: ${walletBalance} CSPR`)
    } else if (lowerText.includes('stake') || lowerText.includes('validators')) {
      reply = "Opening staking interface. How much CSPR would you like to stake?"
      addLog('agent', 'Staking intent detected. Redirecting to Staking module.')
      // Simulate staking
      setTimeout(() => {
        const amt = 100
        setWalletBalance(p => p - amt)
        setStakedBalance(p => p + amt)
        addLog('casper', `Staked ${amt} CSPR to Validator: 01a938c1... Tx: hash_7a9f...`)
        speakText(`Successfully staked ${amt} CSPR on Casper Testnet.`)
        setTranscripts(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'agent',
            text: `I have staked ${amt} CSPR. Your new staked balance is ${stakedBalance + amt} CSPR.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])
      }, 3000)
    } else if (lowerText.includes('swap') || lowerText.includes('trade')) {
      reply = "Swapping is supported via CSPR.trade MCP Server. Let me check the liquidity pools. Swapping 50 CSPR for 2.5 USDC."
      addLog('agent', 'Querying CSPR.trade MCP server for swap routes.')
      setTimeout(() => {
        setWalletBalance(p => p - 50)
        addLog('casper', 'Executed swap transaction on Casper Testnet. Swap Hash: 0xf92b... ')
      }, 2000)
    } else if (lowerText.includes('nft') || lowerText.includes('mint')) {
      reply = "Switching to Vision mode to identify a physical object. Hold up an object to the camera and press 'Scan Object' to mint an NFT."
      setActiveTab('vision')
      setSelectedVisionAction('nft')
      addLog('agent', 'Vision module activated. Waiting for object scanner.')
    } else {
      reply = "I understand. I am processing your command through my Casper Agent Skill. I can execute secure transactions on Casper Testnet using Casper Odra Smart Contracts."
      addLog('agent', `Processed prompt: "${text}"`)
    }

    setTimeout(() => {
      const agentMessage: Transcript = {
        id: Date.now() + 1,
        sender: 'agent',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setTranscripts(prev => [...prev, agentMessage])
      speakText(reply)
    }, 800)
  }

  // Speak Simulated Commands for testing/fallback
  const triggerSimulatedCommand = (cmd: string) => {
    handleUserSpeech(cmd)
  }

  // Toggle voice recognition
  const toggleListening = () => {
    if (isListening) {
      speechRecognitionRef.current?.stop()
    } else {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start()
      } else {
        // Fallback simulated prompts
        const prompts = [
          "Check my wallet balance",
          "Stake 100 CSPR on validator",
          "Mint an NFT of this object",
          "Deploy an Odra token contract"
        ]
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
        addLog('system', `Speech recognition not available. Simulating voice prompt: "${randomPrompt}"`)
        triggerSimulatedCommand(randomPrompt)
      }
    }
  }

  // Webcam controls
  const startCamera = async () => {
    setIsCameraActive(true)
    addLog('system', 'Initializing computer vision feed...')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        addLog('system', 'Video stream active.')
      }
    } catch (err) {
      addLog('system', 'Webcam access denied or unavailable. Running camera simulation mode.')
    }
  }

  const stopCamera = () => {
    setIsCameraActive(false)
    setDetectedObjects([])
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    addLog('system', 'Camera feed stopped.')
  }

  // Scan current frame
  const scanObject = () => {
    if (!isCameraActive) {
      addLog('system', 'Please start camera before scanning.')
      return
    }
    setIsScanning(true)
    addLog('agent', 'Performing object detection and vision inference...')
    
    // Simulate scanner latency
    setTimeout(() => {
      setIsScanning(false)
      
      if (selectedVisionAction === 'contract') {
        const objects = [{ id: 1, label: 'Smart Contract Sketch', x: 20, y: 15, width: 60, height: 70 }]
        setDetectedObjects(objects)
        
        // Load generated Odra contract code
        const code = `// Casper Odra Smart Contract - Auto-Generated from Vision Scanner
use odra::prelude::*;
use odra::types::Address;

#[odra::module]
pub struct CasperNexusAsset {
    owner: Var<Address>,
    metadata_hash: Var<String>,
}

#[odra::module]
impl CasperNexusAsset {
    #[odra(init)]
    pub fn init(&mut self, metadata_hash: String) {
        self.owner.set(self.env().caller());
        self.metadata_hash.set(metadata_hash);
      
        // Emit Event
        self.env().emit_event(AssetRegistered {
            owner: self.env().caller(),
            hash: metadata_hash,
        });
    }

    pub fn get_owner(&self) -> Address {
        self.owner.get_or_default()
    }
}

#[derive(Event, PartialEq, Eq, Debug)]
pub struct AssetRegistered {
    pub owner: Address,
    pub hash: String,
}
`
        setContractCode(code)
        setShowContractModal(true)
        addLog('agent', 'Detected Sketch: Smart Contract Flowchart. Code generated successfully using Odra framework!')
        speakText("Smart contract flowchart detected. I have written a Casper Odra contract for it.")
      } else {
        const objects = [{ id: 2, label: 'Creative Sculpture (Physical)', x: 30, y: 20, width: 40, height: 60 }]
        setDetectedObjects(objects)
        setNftName('Casper Vision Artifact #89')
        addLog('agent', 'Detected Object: Creative physical asset. RWA identification hash logged.')
        speakText("Object detected. Ready to mint this physical object as a Casper NFT.")
      }
    }, 2000)
  }

  const deployContract = () => {
    setIsDeploying(true)
    addLog('casper', 'Compiling Odra smart contract code into WASM binary...')
    
    setTimeout(() => {
      addLog('casper', 'WASM binary generated. Size: 45 KB.')
      addLog('casper', 'Broadcasting deploy transaction to Casper Testnet...')
      
      setTimeout(() => {
        setIsDeploying(false)
        setShowContractModal(false)
        addLog('casper', 'Transaction Confirmed! Block: 341,920')
        addLog('casper', 'Contract Deployed at Address: hash-6a9cf1839db08c7ea1b28d93f77342ac11f1816db73c68a48b99c72e')
        speakText("Smart contract successfully compiled and deployed on Casper Testnet.")
      }, 2000)
    }, 1500)
  }

  const mintNFT = () => {
    if (!nftName) return
    setIsMinting(true)
    addLog('agent', `Requesting Flux API to generate artwork for: ${nftName}`)
    
    setTimeout(() => {
      addLog('x402', 'Deducted 0.10 CSPR for Flux creative AI inference.')
      addLog('casper', 'Minting NFT CEP-78 token on Casper Testnet...')
      
      setTimeout(() => {
        setIsMinting(false)
        setSelectedVisionAction(null)
        setNftName('')
        setDetectedObjects([])
        addLog('casper', `CEP-78 NFT Token minted successfully! ID: #108. Tx: hash_cf82...`)
        speakText(`Successfully minted ${nftName} as a Casper NFT.`)
      }, 2000)
    }, 1500)
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="casper-logo-symbol">C</div>
          <div className="app-title">
            <h1>Casper Nexus</h1>
            <span className="app-subtitle">Agentic Multi-Modal Assistant</span>
          </div>
        </div>
        <div className="status-badge-container">
          <div className="status-badge">
            <span className="dot"></span>
            <span>Casper Testnet</span>
          </div>
          <div className="status-badge">
            <span className={`dot ${isListening ? 'connecting' : ''}`}></span>
            <span>{isListening ? 'Listening' : 'Agent Idle'}</span>
          </div>
          <button className="vision-btn" onClick={toggleMute} style={{ padding: '0.4rem' }}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className={isSpeaking ? 'active-volume' : ''} />}
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Interactive Panel */}
        <section className="panel">
          <div className="panel-header">
            <div className="tabs">
              <button 
                className={`tab-btn ${activeTab === 'voice' ? 'active' : ''}`}
                onClick={() => { setActiveTab('voice'); stopCamera(); }}
              >
                <Mic size={16} /> Voice Agent
              </button>
              <button 
                className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`}
                onClick={() => { setActiveTab('vision'); startCamera(); }}
              >
                <Camera size={16} /> Vision Agent
              </button>
            </div>
            <div className="panel-title">
              {activeTab === 'voice' ? <Cpu size={18} /> : <Layers size={18} />}
              <span>{activeTab === 'voice' ? 'Autonomous Voice Assistant' : 'Real-time Computer Vision'}</span>
            </div>
          </div>

          {/* Tab Content: Voice Agent */}
          {activeTab === 'voice' && (
            <div className="voice-assistant-container">
              <div 
                className="voice-orb-outer"
                onClick={toggleListening}
              >
                <div className={`voice-orb ${isListening ? 'listening' : ''}`}>
                  <Mic size={32} />
                </div>
              </div>

              {/* Sound waves animation */}
              <div className="waves-container">
                <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`}></div>
                <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`}></div>
                <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`}></div>
                <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`}></div>
                <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`}></div>
                <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`}></div>
                <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`}></div>
                <div className={`wave-bar ${isListening || isSpeaking ? 'active' : ''}`}></div>
              </div>

              {/* Transcript list */}
              <div className="transcription-box">
                {transcripts.map((t) => (
                  <div key={t.id} className={`speech-bubble ${t.sender}`}>
                    <span className="bubble-sender">
                      {t.sender === 'user' ? <User size={12} /> : <Cpu size={12} />}
                      {t.sender === 'user' ? 'User' : 'Casper Agent'}
                      <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>• {t.time}</span>
                    </span>
                    <p className="bubble-text">{t.text}</p>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>

              {/* Quick Staking & DeFi Action Cards */}
              <div className="quick-actions-grid">
                <div className="action-card" onClick={() => triggerSimulatedCommand('Check my balance')}>
                  <Wallet size={18} />
                  <span>Check Balance</span>
                </div>
                <div className="action-card" onClick={() => triggerSimulatedCommand('Stake 100 CSPR')}>
                  <TrendingUp size={18} />
                  <span>Stake 100 CSPR</span>
                </div>
                <div className="action-card" onClick={() => triggerSimulatedCommand('Swap CSPR for USDC')}>
                  <RefreshCw size={18} />
                  <span>Swap CSPR</span>
                </div>
                <div className="action-card" onClick={() => triggerSimulatedCommand('Mint physical object as NFT')}>
                  <Sparkles size={18} />
                  <span>Mint NFT</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Vision Agent */}
          {activeTab === 'vision' && (
            <div className="vision-assistant-container">
              <div className="vision-grid">
                {/* Viewport */}
                <div className="camera-viewport">
                  {isCameraActive ? (
                    <video ref={videoRef} autoPlay playsInline className="camera-video"></video>
                  ) : (
                    <div className="camera-placeholder">
                      <Camera size={48} />
                      <p>Camera feed starting...</p>
                    </div>
                  )}

                  {/* Visual Overlays */}
                  <div className="camera-scanline"></div>
                  <div className="camera-corner top-left"></div>
                  <div className="camera-corner top-right"></div>
                  <div className="camera-corner bottom-left"></div>
                  <div className="camera-corner bottom-right"></div>
                  
                  <div className="camera-overlay-info">
                    <span className="status-badge"><span className="dot"></span></span>
                    <span>HD FEED: 1080P // INFERENCE: ACTIVE</span>
                  </div>

                  {/* Bounding boxes */}
                  {detectedObjects.map(obj => (
                    <div 
                      key={obj.id} 
                      className="bounding-box"
                      style={{
                        top: `${obj.y}%`,
                        left: `${obj.x}%`,
                        width: `${obj.width}%`,
                        height: `${obj.height}%`
                      }}
                    >
                      <span className="bounding-box-label">{obj.label}</span>
                    </div>
                  ))}
                </div>

                {/* Sidebar Controls */}
                <div className="vision-tools">
                  <div className="vision-card">
                    <h3><Code size={16} /> Code Scanner</h3>
                    <p>Detect flows or code notes to compile into Casper Odra contracts.</p>
                    <button 
                      className={`vision-btn ${selectedVisionAction === 'contract' ? 'primary' : ''}`}
                      onClick={() => { setSelectedVisionAction('contract'); startCamera(); }}
                    >
                      Scan Contract Sketch
                    </button>
                  </div>

                  <div className="vision-card">
                    <h3><Sparkles size={16} /> Asset Creator</h3>
                    <p>Identify items and mint dynamic NFTs directly to the blockchain.</p>
                    <button 
                      className={`vision-btn ${selectedVisionAction === 'nft' ? 'primary' : ''}`}
                      onClick={() => { setSelectedVisionAction('nft'); startCamera(); }}
                    >
                      Scan Object for NFT
                    </button>
                  </div>

                  <button 
                    className="vision-btn primary" 
                    onClick={scanObject}
                    disabled={isScanning || !selectedVisionAction}
                  >
                    {isScanning ? <RefreshCw className="animate-spin" size={16} /> : 'Scan Object'}
                  </button>
                </div>
              </div>

              {/* RWA NFT Minting Interface */}
              {selectedVisionAction === 'nft' && detectedObjects.length > 0 && (
                <div className="vision-card" style={{ marginTop: '0.5rem' }}>
                  <h3><PlusCircle size={16} /> Register Digital Twin NFT</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <input 
                      type="text" 
                      placeholder="Enter NFT Artifact Name..." 
                      className="input-field"
                      value={nftName}
                      onChange={(e) => setNftName(e.target.value)}
                    />
                    <button 
                      className="vision-btn primary" 
                      onClick={mintNFT}
                      disabled={isMinting || !nftName}
                    >
                      {isMinting ? 'Minting...' : 'Mint NFT'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right Blockchain Explorer & Agent Logs */}
        <section className="panel logs-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Terminal size={18} />
              <span>Chain Operations & x402 Micropayments</span>
            </div>
            <button className="vision-btn" onClick={() => setLogs([])} style={{ padding: '0.4rem' }}>
              Clear Logs
            </button>
          </div>

          {/* System information widgets */}
          <div className="info-pane">
            <div className="info-row">
              <span>Account Balance</span>
              <span>{walletBalance.toLocaleString()} CSPR</span>
            </div>
            <div className="info-row">
              <span>Staked Balance</span>
              <span>{stakedBalance.toLocaleString()} CSPR</span>
            </div>
            <div className="info-row" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
              <span>x402 Micropayment Channel</span>
              <span style={{ color: 'var(--info-color)', fontWeight: 600 }}>{x402Balance.toFixed(2)} CSPR</span>
            </div>
          </div>

          {/* Terminal log window */}
          <div className="logs-container">
            {logs.map((log) => (
              <div key={log.id} className={`log-entry ${log.tag}`}>
                <div className="log-meta">
                  <span className="log-tag">[{log.tag.toUpperCase()}]</span>
                  <span>{log.timestamp}</span>
                </div>
                <span className="log-text">{log.text}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </section>
      </div>

      {/* Smart Contract Code Scanner Code Preview Modal */}
      {showContractModal && (
        <div className="overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Smart Contract Detected</h2>
              <button className="close-btn" onClick={() => setShowContractModal(false)}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Below is the Casper Odra (Rust) code generated from your flowchart. You can compile and deploy it directly to the Casper Testnet.
            </p>
            <div className="code-preview-container">
              <pre className="code-preview"><code>{contractCode}</code></pre>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="vision-btn" onClick={() => setShowContractModal(false)}>Cancel</button>
              <button className="vision-btn primary" onClick={deployContract} disabled={isDeploying}>
                {isDeploying ? 'Deploying...' : 'Compile & Deploy WASM'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
