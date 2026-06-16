import { useState, useEffect, useRef } from 'react'
import { 
  Mic, 
  Camera, 
  Cpu, 
  Terminal, 
  User, 
  Sparkles, 
  PlusCircle, 
  Wallet, 
  TrendingUp, 
  Volume2,
  VolumeX,
  RefreshCw,
  Code,
  Play,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import './App.css'

interface DashboardProps {
  onBack: () => void
}

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

function Dashboard({ onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'voice' | 'vision' | 'ide'>('voice')
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
      text: "Welcome to Casper Nexus. I am your multimodal AI agent. Speak or click a command below to check balance, stake Casper, or scan flowcharts for contract code.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: new Date().toLocaleTimeString(), tag: 'system', text: 'Casper Nexus Autonomous Agent Core Initialized.' },
    { id: 2, timestamp: new Date().toLocaleTimeString(), tag: 'x402', text: 'x402 payment channel open. Deposited: 5.00 CSPR.' },
    { id: 3, timestamp: new Date().toLocaleTimeString(), tag: 'casper', text: 'RPC Connection active: Node node-1.testnet.casper.network' }
  ])

  // Vision States
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [detectedObjects, setDetectedObjects] = useState<BoundingBox[]>([])
  const [selectedVisionAction, setSelectedVisionAction] = useState<'contract' | 'nft' | null>(null)

  const [logView, setLogView] = useState<'logs' | 'billing'>('logs')
  const [billingLedger, setBillingLedger] = useState<any[]>([
    { id: 'tx-101', action: 'Agent initialization handshake', cost: 0.10, hash: 'hash-f89a2b...', timestamp: '03:15:10' },
    { id: 'tx-102', action: 'Speech-to-text token translation', cost: 0.05, hash: 'hash-029cba...', timestamp: '03:16:45' },
    { id: 'tx-103', action: 'Casper testnet delegation state update', cost: 0.15, hash: 'hash-7a2bd0...', timestamp: '03:17:30' }
  ])

  const addBillingEntry = (action: string, cost: number) => {
    setBillingLedger(prev => [
      ...prev,
      {
        id: `tx-${Math.floor(100 + Math.random() * 900)}`,
        action,
        cost,
        hash: `hash-${Math.random().toString(16).substring(2, 8)}...`,
        timestamp: new Date().toLocaleTimeString()
      }
    ])
  }
  
  // Smart Contract States
  const [contractCode, setContractCode] = useState<string>(`// Casper Odra Smart Contract - Auto-Generated from Flowchart Scanner
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
`)
  const [isDeploying, setIsDeploying] = useState(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [isCompiled, setIsCompiled] = useState(false)
  const [nftName, setNftName] = useState('')
  const [isMinting, setIsMinting] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const speechRecognitionRef = useRef<any>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  // Scroll controls
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcripts])

  // Web Speech STT Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        addLog('system', 'Voice channel open. Listening for commands...')
      }

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        handleUserSpeech(text)
      }

      recognition.onerror = (event: any) => {
        addLog('system', `Speech recognition warning: ${event.error}`)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      speechRecognitionRef.current = recognition
    } else {
      addLog('system', 'Speech Recognition API not supported locally. Simulating agent queries.')
    }
  }, [])

  // Text to Speech
  const speakText = (text: string) => {
    if (isMuted) return
    window.speechSynthesis.cancel()
    const utterance = new SynthesisUtteranceMock(text)
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    if (preferredVoice) utterance.voice = preferredVoice

    window.speechSynthesis.speak(utterance as any)
  }

  // Synthesis Mock fallback for strict environments
  class SynthesisUtteranceMock {
    text: string
    onstart: (() => void) | null = null
    onend: (() => void) | null = null
    voice: any = null

    constructor(text: string) {
      this.text = text
    }
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

  // Voice Command Routing
  const handleUserSpeech = (text: string) => {
    const userMessage: Transcript = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setTranscripts(prev => [...prev, userMessage])

    // x402 micropayments deduction
    const cost = 0.05
    setX402Balance(prev => {
      const next = parseFloat((prev - cost).toFixed(2))
      return next > 0 ? next : 0
    })
    addLog('x402', `Micropayment channel debited ${cost} CSPR for agent query validation.`)
    addBillingEntry(`NLP query validation: "${text.substring(0, 20)}..."`, cost)

    const lowerText = text.toLowerCase()
    let reply = ''
    
    if (lowerText.includes('balance') || lowerText.includes('wallet') || lowerText.includes('funds')) {
      reply = `Your available wallet balance is ${walletBalance} CSPR. Additionally, you have ${stakedBalance} CSPR active in delegator pools.`
      addLog('casper', 'State Root Hash read command sent to Casper RPC.')
      addLog('agent', `Balance verified: ${walletBalance} CSPR available.`)
    } else if (lowerText.includes('stake') || lowerText.includes('delegate')) {
      reply = "Initiating validator delegation workflow. Preparing state change block for 100 CSPR."
      addLog('agent', 'Staking transaction request processed.')
      setTimeout(() => {
        const amt = 100
        setWalletBalance(p => p - amt)
        setStakedBalance(p => p + amt)
        addLog('casper', `Successfully delegated ${amt} CSPR. Block: 1,489,202. Hash: hash-7f0bc9...`)
        speakText(`Successfully staked ${amt} CSPR.`)
        setTranscripts(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'agent',
            text: `Staked ${amt} CSPR successfully. Staked balance: ${stakedBalance + amt} CSPR.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])
      }, 3000)
    } else if (lowerText.includes('swap') || lowerText.includes('exchange')) {
      reply = "Routing exchange request to Casper trade aggregator. Swapping 50 CSPR to USDC."
      addLog('agent', 'Consulting MCP liquidity price paths.')
      setTimeout(() => {
        setWalletBalance(p => p - 50)
        addLog('casper', 'Swap execution confirmed. Received 2.5 USDC. Tx: 0x98ab21...')
      }, 2000)
    } else if (lowerText.includes('nft') || lowerText.includes('mint')) {
      reply = "Switching layout to Vision Agent. Start the camera and register an object to mint an RWA NFT."
      setActiveTab('vision')
      setSelectedVisionAction('nft')
      addLog('agent', 'Switched context to Computer Vision Scanner.')
    } else {
      reply = "Command verified. Processing query via Casper blockchain modules."
      addLog('agent', `Processed: "${text}"`)
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

  // Trigger command fallback
  const triggerSimulatedCommand = (cmd: string) => {
    handleUserSpeech(cmd)
  }

  // Audio mic toggle
  const toggleListening = () => {
    if (isListening) {
      speechRecognitionRef.current?.stop()
    } else {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start()
      } else {
        const prompts = [
          "Check my wallet balance",
          "Stake 100 CSPR on validator",
          "Mint an NFT of this object",
          "Deploy an Odra token contract"
        ]
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
        addLog('system', `Simulating speech recognition input: "${randomPrompt}"`)
        triggerSimulatedCommand(randomPrompt)
      }
    }
  }

  // Vision camera setup
  const startCamera = async () => {
    setIsCameraActive(true)
    addLog('system', 'Powering up computer vision camera view...')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        addLog('system', 'Camera stream integrated.')
      }
    } catch (err) {
      addLog('system', 'Webcam preview blocked. Loading automated simulator viewport.')
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
    addLog('system', 'Webcam stream deactivated.')
  }

  // Scan current viewport frame
  const scanObject = () => {
    if (!isCameraActive) {
      addLog('system', 'Activate camera preview before scanning.')
      return
    }
    setIsScanning(true)
    addLog('agent', 'Performing deep neural visual inference on camera frame...')
    
    // x402 billing for visual inference
    const scanCost = 0.08
    setX402Balance(prev => {
      const next = parseFloat((prev - scanCost).toFixed(2))
      return next > 0 ? next : 0
    })
    addLog('x402', `Micropayment channel debited ${scanCost} CSPR for computer vision agent inference.`)
    addBillingEntry(`Vision scan: ${selectedVisionAction}`, scanCost)

    setTimeout(() => {
      setIsScanning(false)
      
      if (selectedVisionAction === 'contract') {
        const objects = [{ id: 1, label: 'Odra Flowchart Sketch', x: 15, y: 15, width: 70, height: 70 }]
        setDetectedObjects(objects)
        setContractCode(`// Casper Odra Smart Contract - Auto-Generated from Flowchart Scanner
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
`)
        addLog('agent', 'Visual flowchart parsed successfully. Translating to Rust code.')
        speakText("Smart contract flowchart detected. Opening compiler tab.")
        setTimeout(() => {
          setActiveTab('ide')
        }, 1200)
      } else {
        const objects = [{ id: 2, label: 'Physical Sculpture', x: 25, y: 20, width: 50, height: 60 }]
        setDetectedObjects(objects)
        setNftName('Casper Nexus RWA Twin #12')
        addLog('agent', 'RWA entity identified. Ready to generate CEP-78 metadata.')
        speakText("Physical asset identified. Ready to register digital twin NFT.")
      }
    }, 2000)
  }

  // IDE compilation
  const compileContract = () => {
    setIsCompiling(true)
    setIsCompiled(false)
    addLog('system', 'Running Cargo check & Casper Odra compiler chain...')
    
    setTimeout(() => {
      setIsCompiling(false)
      setIsCompiled(true)
      addLog('casper', 'Cargo compiler finished. Generated casper_nexus_asset.wasm (45.2 KB).')
      speakText("Compilation successful. Odra WASM binary generated.")
    }, 2500)
  }

  // IDE deploy
  const deployContract = () => {
    setIsDeploying(true)
    addLog('casper', 'Broadcasting WASM package to Casper Testnet node...')
    
    setTimeout(() => {
      setIsDeploying(false)
      setIsCompiled(false)
      addLog('casper', 'Transaction signature verified. Block height: 1,489,215.')
      addLog('casper', 'Contract Address: hash-6a9cf1839db08c7ea1b28d93f77342ac11f1816db73c68a48b99c72e')
      speakText("Odra smart contract successfully deployed to Testnet.")
    }, 2000)
  }

  // NFT minting
  const mintNFT = () => {
    if (!nftName) return
    setIsMinting(true)
    addLog('agent', `Requesting Flux inference for creative asset art generation...`)
    
    setTimeout(() => {
      addLog('x402', 'x402 channel debited 0.10 CSPR for generative AI compute.')
      addBillingEntry('Generative NFT compute', 0.10)
      addLog('casper', 'Signing CEP-78 NFT minting payload on Casper Network...')
      
      setTimeout(() => {
        setIsMinting(false)
        setSelectedVisionAction(null)
        setNftName('')
        setDetectedObjects([])
        addLog('casper', `RWA NFT Twin registered! ID: #528. Tx Hash: hash-cf82ac3...`)
        speakText(`Successfully minted ${nftName} digital twin.`)
      }, 2000)
    }, 1500)
  }

  // SVG circular calculations
  const totalBalance = walletBalance + stakedBalance + x402Balance
  const stakedPercent = (stakedBalance / totalBalance) * 100
  const circ = 2 * Math.PI * 45 // radius 45 -> circumference ~282.7
  const strokeDashoffset = circ - (stakedPercent / 100) * circ

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="casper-logo-symbol">C</div>
          <div className="app-title">
            <h1>Casper Nexus</h1>
            <span className="app-subtitle">Agentic Multi-Modal Web3 Portal</span>
          </div>
        </div>
        <div className="status-badge-container">
          <button className="vision-btn" onClick={onBack} style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={14} /> Landing
          </button>
          <div className="status-badge">
            <span className="dot"></span>
            <span>Testnet Node 1</span>
          </div>
          <div className="status-badge">
            <span className={`dot ${isListening ? 'connecting' : ''}`}></span>
            <span>{isListening ? 'Listening' : 'Core Ready'}</span>
          </div>
          <button className="vision-btn" onClick={toggleMute} style={{ padding: '0.6rem' }}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className={isSpeaking ? 'active-volume' : ''} />}
          </button>
        </div>
      </header>

      {/* Intro Hero Banner */}
      <div className="intro-banner">
        <div className="intro-content">
          <span className="intro-tag">Autonomous Web3 Copilot</span>
          <h2>Intelligent Blockchain Orchestrator</h2>
          <p>
            An advanced agentic portal utilizing voice commands, computer vision, and x402 micropayments. 
            Scan code sketches, compile Rust Odra contracts, and digitize real-world assets directly to the Casper Network.
          </p>
        </div>
        <div className="intro-stats">
          <div className="intro-stat-card">
            <span className="intro-stat-val">4.6s</span>
            <span className="intro-stat-lbl">Block Time</span>
          </div>
          <div className="intro-stat-card">
            <span className="intro-stat-val" style={{ color: 'var(--color-success)' }}>Active</span>
            <span className="intro-stat-lbl">AI Inference</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Side: Agent Operations */}
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
              <button 
                className={`tab-btn ${activeTab === 'ide' ? 'active' : ''}`}
                onClick={() => { setActiveTab('ide'); stopCamera(); }}
              >
                <Code size={16} /> Odra Rust IDE
              </button>
            </div>
            <div className="panel-title">
              <Cpu size={18} />
              <span>
                {activeTab === 'voice' && 'Voice Intelligence hub'}
                {activeTab === 'vision' && 'RWA Viewport Scanner'}
                {activeTab === 'ide' && 'Smart Contract IDE'}
              </span>
            </div>
          </div>

          {/* Voice Tab */}
          {activeTab === 'voice' && (
            <div className="voice-assistant-container">
              <div className="voice-orb-wrapper">
                <div className={`voice-orb-ripple ${isListening || isSpeaking ? 'active' : ''}`} style={{ animationDelay: '0s' }}></div>
                <div className={`voice-orb-ripple ${isListening || isSpeaking ? 'active' : ''}`} style={{ animationDelay: '0.6s' }}></div>
                <div className="voice-orb-outer" onClick={toggleListening}>
                  <div className={`voice-orb ${isListening ? 'listening' : ''}`}>
                    <Mic size={32} />
                  </div>
                </div>
              </div>

              {/* Bounce Waves */}
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

              {/* Transcripts */}
              <div className="transcription-box">
                {transcripts.map((t) => (
                  <div key={t.id} className={`speech-bubble ${t.sender}`}>
                    <span className="bubble-sender">
                      {t.sender === 'user' ? <User size={12} /> : <Cpu size={12} />}
                      {t.sender === 'user' ? 'User' : 'Nexus Agent'}
                      <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>• {t.time}</span>
                    </span>
                    <p className="bubble-text">{t.text}</p>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>

              {/* Quick Options */}
              <div className="quick-actions-grid">
                <div className="action-card" onClick={() => triggerSimulatedCommand('Check balance')}>
                  <Wallet size={18} />
                  <span>Check balance</span>
                </div>
                <div className="action-card" onClick={() => triggerSimulatedCommand('Stake 100 CSPR')}>
                  <TrendingUp size={18} />
                  <span>Stake CSPR</span>
                </div>
                <div className="action-card" onClick={() => triggerSimulatedCommand('Swap CSPR for USDC')}>
                  <RefreshCw size={18} />
                  <span>Swap CSPR</span>
                </div>
                <div className="action-card" onClick={() => triggerSimulatedCommand('Mint NFT')}>
                  <Sparkles size={18} />
                  <span>Mint NFT</span>
                </div>
              </div>
            </div>
          )}

          {/* Vision Tab */}
          {activeTab === 'vision' && (
            <div className="vision-assistant-container">
              <div className="vision-grid">
                <div className="camera-viewport">
                  {isCameraActive ? (
                    <video ref={videoRef} autoPlay playsInline className="camera-video"></video>
                  ) : (
                    <div className="camera-placeholder">
                      <Camera size={44} />
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Viewfinder offline. Click tools on the right to scan.</p>
                    </div>
                  )}

                  {/* Overlays */}
                  <div className="camera-scanline"></div>
                  <div className="camera-corner top-left"></div>
                  <div className="camera-corner top-right"></div>
                  <div className="camera-corner bottom-left"></div>
                  <div className="camera-corner bottom-right"></div>
                  <div className="camera-hud-crosshair"></div>
                  
                  <div className="camera-overlay-info">
                    <span className="dot"></span>
                    <span>HUD CAPTURE FEED ACTIVE</span>
                  </div>

                  {/* Bounding box overlays */}
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

                <div className="vision-tools">
                  <div className="vision-card">
                    <h3><Code size={16} /> Contract Flow Compiler</h3>
                    <p>Scans blueprint flowcharts or sketches to write Casper Odra code.</p>
                    <button 
                      className={`vision-btn ${selectedVisionAction === 'contract' ? 'primary' : ''}`}
                      onClick={() => { setSelectedVisionAction('contract'); startCamera(); }}
                    >
                      Scan Contract Design
                    </button>
                  </div>

                  <div className="vision-card">
                    <h3><Sparkles size={16} /> Asset Digitization Twin</h3>
                    <p>Register real-world physical assets as digital CEP-78 NFTs.</p>
                    <button 
                      className={`vision-btn ${selectedVisionAction === 'nft' ? 'primary' : ''}`}
                      onClick={() => { setSelectedVisionAction('nft'); startCamera(); }}
                    >
                      Scan RWA item
                    </button>
                  </div>

                  <button 
                    className="vision-btn primary" 
                    onClick={scanObject}
                    disabled={isScanning || !selectedVisionAction}
                    style={{ marginTop: '0.5rem' }}
                  >
                    {isScanning ? <RefreshCw className="animate-spin" size={16} /> : 'Execute Scanner Scan'}
                  </button>
                </div>
              </div>

              {/* RWA Digital twin form */}
              {selectedVisionAction === 'nft' && detectedObjects.length > 0 && (
                <div className="vision-card">
                  <h3><PlusCircle size={16} /> Digital Twin Asset Info</h3>
                  <p>Register identity parameters on the blockchain.</p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    <input 
                      type="text" 
                      placeholder="Asset Metadata Tag Name..." 
                      className="input-field"
                      value={nftName}
                      onChange={(e) => setNftName(e.target.value)}
                    />
                    <button 
                      className="vision-btn primary" 
                      onClick={mintNFT}
                      disabled={isMinting || !nftName}
                    >
                      {isMinting ? <RefreshCw className="animate-spin" size={16} /> : 'Mint Twin NFT'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* IDE Tab */}
          {activeTab === 'ide' && (
            <div className="ide-container">
              <div className="ide-editor-header">
                <div className="ide-tabs-mock">
                  <div className="ide-tab-mock">casper_nexus_asset.rs (Odra Framework)</div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="vision-btn" onClick={compileContract} disabled={isCompiling} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    {isCompiling ? <RefreshCw className="animate-spin" size={12} /> : <Play size={12} />} Compile WASM
                  </button>
                  <button className="vision-btn primary" onClick={deployContract} disabled={isDeploying || !isCompiled} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    {isDeploying ? <RefreshCw className="animate-spin" size={12} /> : <CheckCircle size={12} />} Deploy Testnet
                  </button>
                </div>
              </div>
              <div className="code-preview-container">
                <pre className="code-preview"><code>{contractCode}</code></pre>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  * Odra Rust compiler toolchain targets cargo wasm32-unknown-unknown
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Right Side: Ledger Operations & Telemetry */}
        <section className="panel logs-panel">
          <div className="panel-header" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="panel-title">
                <Terminal size={18} />
                <span>Console & Billing</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className={`tab-btn ${logView === 'logs' ? 'active' : ''}`} 
                  onClick={() => setLogView('logs')}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  Logs
                </button>
                <button 
                  className={`tab-btn ${logView === 'billing' ? 'active' : ''}`} 
                  onClick={() => setLogView('billing')}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  x402 Ledger
                </button>
              </div>
            </div>
          </div>

          {/* Circular progress visualizer */}
          <div className="info-pane">
            <div className="wallet-circle-progress">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" stroke="rgba(255,255,255,0.04)" strokeWidth="10" fill="transparent" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="45" 
                  stroke="var(--color-primary)" 
                  strokeWidth="10" 
                  fill="transparent" 
                  className="progress-ring-circle"
                  strokeDasharray={circ}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="progress-center-text">
                <span className="progress-center-val">{stakedPercent.toFixed(0)}%</span>
                <span className="progress-center-lbl">Staked</span>
              </div>
            </div>

            <div className="info-row">
              <span>Available Wallet Balance</span>
              <span>{walletBalance.toLocaleString()} CSPR</span>
            </div>
            <div className="info-row">
              <span>Delegated Staking</span>
              <span>{stakedBalance.toLocaleString()} CSPR</span>
            </div>
            <div className="info-row x402-row">
              <span>x402 Micropayment Channel</span>
              <span>{x402Balance.toFixed(2)} CSPR</span>
            </div>

            {/* Mock DeFi & Staking Volume Chart */}
            <div style={{ marginTop: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
              <div className="info-row" style={{ marginBottom: '0.5rem' }}>
                <span>Trading Volume (Trend)</span>
                <span style={{ color: 'var(--color-accent)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>+12.4% block change</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '54px', padding: '4px 0' }}>
                {[30, 45, 25, 60, 55, 75, 40].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      flex: 1, 
                      height: `${h}%`, 
                      background: 'linear-gradient(to top, var(--color-secondary), var(--color-accent))', 
                      borderRadius: '3px',
                      boxShadow: '0 0 8px rgba(0, 210, 211, 0.2)',
                      transition: 'height 0.3s ease'
                    }}
                  ></div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                <span>B-10</span>
                <span>B-8</span>
                <span>B-6</span>
                <span>B-4</span>
                <span>B-2</span>
                <span>Live</span>
              </div>
            </div>
          </div>

          {/* Logs / Billing Container */}
          <div className="logs-container" style={{ minHeight: '260px' }}>
            {logView === 'logs' ? (
              <>
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
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 0.8fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                  <span>ID</span>
                  <span>ACTION</span>
                  <span>COST</span>
                  <span>HASH</span>
                </div>
                {billingLedger.map((item) => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 0.8fr 1fr', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', borderBottom: '1px dashed rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--color-accent)' }}>{item.id}</span>
                    <span style={{ color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.action}</span>
                    <span style={{ color: 'var(--color-primary)' }}>-{item.cost} CSPR</span>
                    <span style={{ color: 'var(--text-muted)' }}>{item.hash}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
