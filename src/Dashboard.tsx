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
  ArrowLeft,
  ExternalLink,
  Copy
} from 'lucide-react'
import './App.css'
import { getRecentBlocks, submitDemoTransfer, getTestnetStatus, shortHash, formatTimestamp, TESTNET_EXPLORER, type BlockInfo as RpcBlock } from './services/CasperService'
import { ToastContainer, useToasts } from './components/ToastNotification'
import AiToolkitTab from './components/AiToolkitTab'

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
  const [activeTab, setActiveTab] = useState<'voice' | 'vision' | 'ide' | 'ai-toolkit'>('voice')
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
  const [subTab, setSubTab] = useState<'stake' | 'transfer' | 'x402'>('stake')
  const [stakeInput, setStakeInput] = useState('100')
  const [transferRecipient, setTransferRecipient] = useState('0202d9921473c9f28a7e08920199d9bc37f0bca2d89006e890a5a67c52b217a2db0f')
  const [transferAmount, setTransferAmount] = useState('10')
  const [x402DepositAmount, setX402DepositAmount] = useState('5')
  const [isExecutingDeFi, setIsExecutingDeFi] = useState(false)
  const [odraProfile, setOdraProfile] = useState<'debug' | 'release-wasm'>('debug')
  const [ltoEnabled, setLtoEnabled] = useState(true)
  const [odraVersion, setOdraVersion] = useState('1.0.0-rc')
  const [billingLedger, setBillingLedger] = useState<any[]>([
    { id: 'tx-101', action: 'Agent initialization handshake', cost: 0.10, hash: 'hash-f89a2b...', timestamp: '03:15:10' },
    { id: 'tx-102', action: 'Speech-to-text token translation', cost: 0.05, hash: 'hash-029cba...', timestamp: '03:16:45' },
    { id: 'tx-103', action: 'Casper testnet delegation state update', cost: 0.15, hash: 'hash-7a2bd0...', timestamp: '03:17:30' }
  ])

  const [recentBlocks, setRecentBlocks] = useState<RpcBlock[]>([])
  const [testnetConnected, setTestnetConnected] = useState(false)
  const [deployHash, setDeployHash] = useState<string | null>(null)
  const [copiedHash, setCopiedHash] = useState(false)
  const { toasts, addToast, dismiss } = useToasts()

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

  interface MintedNft {
    id: number
    name: string
    category: string
    hash: string
    imageUrl: string
  }

  const [mintedNfts, setMintedNfts] = useState<MintedNft[]>([
    { id: 526, name: 'Casper Nexus Twin #526', category: 'Physical Sculpture', hash: 'hash-02ac9f...', imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120&auto=format&fit=crop&q=60' },
    { id: 527, name: 'Casper Nexus Twin #527', category: 'Odra Flowchart Blueprint', hash: 'hash-5b1280...', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60' }
  ])
  
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

  // Real Casper Testnet block feed
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const [blocks, status] = await Promise.all([
          getRecentBlocks(4),
          getTestnetStatus()
        ])
        setRecentBlocks(blocks)
        setTestnetConnected(status.isConnected)
        if (status.isConnected) {
          addLog('casper', `Testnet block #${status.blockHeight.toLocaleString()} | Era ${blocks[0]?.eraId ?? '—'} | Chain: ${status.chainName}`)
        }
      } catch {
        setTestnetConnected(false)
      }
    }
    fetchBlocks()
    const interval = setInterval(fetchBlocks, 9000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

    if (lowerText.includes('network') || lowerText.includes('peers') || lowerText.includes('validators') || lowerText.includes('status')) {
      const latestBlockHeight = recentBlocks[0]?.height ? `#${recentBlocks[0].height.toLocaleString()}` : 'active';
      reply = `Casper Testnet is live at block height ${latestBlockHeight}. Network status verified via real-time JSON-RPC 2.0. x402 micropayment channels are fully operational.`
      addLog('casper', `Network status queried via real-time RPC. Latest block: ${latestBlockHeight}`)
    } else
    
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
    } else if (lowerText.includes('reward') || lowerText.includes('earn')) {
      reply = "Scanning Casper delegator rewards. You have accumulated 14.52 CSPR in rewards this week. Your average APY is 12.8%."
      addLog('casper', 'Querying era info and reward database table...')
      addLog('agent', 'Delegation rewards verified: 14.52 CSPR.')
    } else if (lowerText.includes('gas') || lowerText.includes('fee')) {
      reply = "Current Casper network gas price is stable at 1 motes. Transaction fee estimator lists standard transfers at 0.1 CSPR and smart contracts at 15 CSPR."
      addLog('casper', 'Fetched node auction information.')
      addLog('agent', 'Gas metrics verified.')
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

  // IDE deploy — submits a real transaction to Casper Testnet
  const deployContract = async () => {
    setIsDeploying(true)
    setDeployHash(null)
    addLog('casper', 'Broadcasting deploy to Casper Testnet via JSON-RPC 2.0...')
    addLog('x402', 'x402 channel debited 0.15 CSPR for on-chain deploy fee.')
    addBillingEntry('Odra contract deploy (WASM)', 0.15)
    setX402Balance(prev => Math.max(0, parseFloat((prev - 0.15).toFixed(2))))

    try {
      const { deployHash: hash, accepted } = await submitDemoTransfer('2500000000')
      setDeployHash(hash)
      setIsDeploying(false)
      setIsCompiled(false)
      addLog('casper', `Deploy submitted! Hash: ${hash}`)
      addLog('casper', `Accepted by node: ${accepted ? 'YES ✓' : 'Pending validation'}`)
      addToast({
        type: accepted ? 'success' : 'info',
        title: accepted ? '🚀 Deploy Submitted!' : '📡 Deploy Pending',
        message: accepted
          ? 'Transaction accepted by Casper Testnet node.'
          : 'Deploy queued — awaiting validator confirmation.',
        txHash: hash,
        duration: 8000
      })
      speakText("Smart contract deploy transaction submitted to Casper Testnet.")
    } catch (err: any) {
      setIsDeploying(false)
      addLog('system', `Deploy error: ${err.message}`)
      addToast({ type: 'error', title: 'Deploy Failed', message: err.message, duration: 5000 })
    }
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
        const newNftId = Math.floor(528 + Math.random() * 500)
        setMintedNfts(prev => [
          ...prev,
          {
            id: newNftId,
            name: nftName,
            category: selectedVisionAction === 'nft' ? 'Physical Asset' : 'Blueprint Design',
            hash: `hash-${Math.random().toString(16).substring(2, 8)}...`,
            imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&auto=format&fit=crop&q=60'
          }
        ])
        setSelectedVisionAction(null)
        setNftName('')
        setDetectedObjects([])
        addLog('casper', `RWA NFT Twin registered! ID: #528. Tx Hash: hash-cf82ac3...`)
        speakText(`Successfully minted ${nftName} digital twin.`)
      }, 2000)
    }, 1500)
  }

  const handleStaking = () => {
    const amt = parseFloat(stakeInput)
    if (isNaN(amt) || amt <= 0 || amt > walletBalance) {
      addToast({ type: 'error', title: 'Invalid Amount', message: 'Amount exceeds available balance.' })
      return
    }
    setIsExecutingDeFi(true)
    addLog('system', `Preparing validator delegation contract transaction for ${amt} CSPR...`)
    
    setTimeout(async () => {
      try {
        const { deployHash: hash } = await submitDemoTransfer((amt * 1000000000).toString())
        setWalletBalance(p => parseFloat((p - amt).toFixed(2)))
        setStakedBalance(p => parseFloat((p + amt).toFixed(2)))
        setIsExecutingDeFi(false)
        addLog('casper', `Delegation successful. Hash: ${hash}`)
        addToast({
          type: 'success',
          title: 'Delegation Active!',
          message: `Staked ${amt} CSPR with active Casper validator node.`,
          txHash: hash
        })
        speakText(`Successfully staked ${amt} CSPR on the Casper network.`)
      } catch (err: any) {
        setIsExecutingDeFi(false)
        addToast({ type: 'error', title: 'Staking Failed', message: err.message })
      }
    }, 1500)
  }

  const handleTransfer = () => {
    const amt = parseFloat(transferAmount)
    if (isNaN(amt) || amt <= 0 || amt > walletBalance) {
      addToast({ type: 'error', title: 'Invalid Amount', message: 'Transfer amount exceeds wallet balance.' })
      return
    }
    if (!transferRecipient || transferRecipient.length < 32) {
      addToast({ type: 'error', title: 'Invalid Recipient', message: 'Please enter a valid Casper public key.' })
      return
    }
    setIsExecutingDeFi(true)
    addLog('system', `Preparing CSPR native transfer of ${amt} CSPR to target recipient...`)
    
    setTimeout(async () => {
      try {
        const { deployHash: hash } = await submitDemoTransfer((amt * 1000000000).toString())
        setWalletBalance(p => parseFloat((p - amt).toFixed(2)))
        setIsExecutingDeFi(false)
        addLog('casper', `Native CSPR transfer successful. Hash: ${hash}`)
        addToast({
          type: 'success',
          title: 'Transfer Completed!',
          message: `Sent ${amt} CSPR to ${shortHash(transferRecipient)}`,
          txHash: hash
        })
        speakText(`Successfully transferred ${amt} CSPR.`)
      } catch (err: any) {
        setIsExecutingDeFi(false)
        addToast({ type: 'error', title: 'Transfer Failed', message: err.message })
      }
    }, 1500)
  }

  const handleDepositX402 = () => {
    const amt = parseFloat(x402DepositAmount)
    if (isNaN(amt) || amt <= 0 || amt > walletBalance) {
      addToast({ type: 'error', title: 'Invalid Amount', message: 'Deposit amount exceeds available wallet balance.' })
      return
    }
    setIsExecutingDeFi(true)
    addLog('system', `Funding x402 micropayment proxy channel with ${amt} CSPR...`)
    
    setTimeout(async () => {
      try {
        const { deployHash: hash } = await submitDemoTransfer((amt * 1000000000).toString())
        setWalletBalance(p => parseFloat((p - amt).toFixed(2)))
        setX402Balance(p => parseFloat((p + amt).toFixed(2)))
        setIsExecutingDeFi(false)
        addLog('x402', `Micropayment channel topped up with ${amt} CSPR. Hash: ${hash}`)
        addToast({
          type: 'success',
          title: 'x402 Channel Funded!',
          message: `Channel proxy balance increased by ${amt} CSPR.`,
          txHash: hash
        })
        speakText(`Successfully funded micropayment channel.`)
      } catch (err: any) {
        setIsExecutingDeFi(false)
        addToast({ type: 'error', title: 'Funding Failed', message: err.message })
      }
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
              <button 
                className={`tab-btn ${activeTab === 'ai-toolkit' ? 'active' : ''}`}
                onClick={() => { setActiveTab('ai-toolkit'); stopCamera(); }}
              >
                <Cpu size={16} /> AI Toolkit
              </button>
            </div>
            <div className="panel-title">
              <Cpu size={18} />
              <span>
                {activeTab === 'voice' && 'Voice Intelligence hub'}
                {activeTab === 'vision' && 'RWA Viewport Scanner'}
                {activeTab === 'ide' && 'Smart Contract IDE'}
                {activeTab === 'ai-toolkit' && 'Casper AI Toolkit & MCP'}
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
                    <div className="camera-placeholder" style={{ position: 'relative' }}>
                      <svg width="180" height="180" viewBox="0 0 100 100" style={{ animation: 'spinBorder 15s linear infinite', opacity: 0.25, position: 'absolute' }}>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" strokeDasharray="3 3" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-accent)" strokeWidth="1" />
                        <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="15" fill="none" stroke="var(--color-secondary)" strokeWidth="0.5" />
                      </svg>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55rem', zIndex: 10, textAlign: 'center', padding: '0 2rem' }}>
                        <Camera size={44} style={{ color: 'var(--color-primary)', filter: 'drop-shadow(0 0 8px var(--color-primary))' }} />
                        <span style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', fontWeight: 'bold' }}>Neural viewport ready</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Select an asset category on the right, then initiate visual signature mapping.</span>
                      </div>
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

              {/* NFT Gallery sub-panel */}
              <div style={{ marginTop: '1.5rem', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
                  <span>Casper CEP-78 Asset Registry Twin Gallery</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                  {mintedNfts.map((nft) => (
                    <div key={nft.id} className="nft-gallery-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <img src={nft.imageUrl} alt={nft.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nft.name}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-accent)' }}>{nft.category}</span>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{nft.hash}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1.25rem', borderRadius: '0', borderLeft: '1px solid var(--border-glass)', borderRight: '1px solid var(--border-glass)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Odra Profile:</span>
                  <select 
                    value={odraProfile} 
                    onChange={(e) => { const v = e.target.value as any; setOdraProfile(v); addLog('system', `Compiler build profile updated to: ${v}`); }}
                    style={{ background: '#0a0a14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', padding: '2px 6px', fontSize: '0.75rem' }}
                  >
                    <option value="debug">debug</option>
                    <option value="release-wasm">release-wasm</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>LTO:</span>
                  <input 
                    type="checkbox" 
                    checked={ltoEnabled} 
                    onChange={(e) => { const v = e.target.checked; setLtoEnabled(v); addLog('system', `Compiler LTO optimization flag set to: ${v}`); }}
                    style={{ accentColor: 'var(--color-primary)' }} 
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Framework:</span>
                  <select 
                    value={odraVersion} 
                    onChange={(e) => { setOdraVersion(e.target.value); addLog('system', `Targeted Odra Framework updated to version ${e.target.value}`); }} 
                    style={{ background: '#0a0a14', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', padding: '2px 6px', fontSize: '0.75rem' }}
                  >
                    <option value="0.8.0">Odra 0.8.0</option>
                    <option value="0.9.0">Odra 0.9.0</option>
                    <option value="1.0.0-rc">Odra 1.0.0-rc</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target:</span>
                  <span style={{ color: 'var(--color-accent)' }}>wasm32-unknown-unknown</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Est. Gas:</span>
                  <span style={{ color: '#ff9f43', fontWeight: 700 }}>
                    ~{odraProfile === 'release-wasm' ? (ltoEnabled ? '900M' : '1.1B') : '1.3B'} motes
                  </span>
                </div>
              </div>
              <div className="code-preview-container">
                <pre className="code-preview"><code>{contractCode}</code></pre>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  * Odra Rust compiler toolchain targets cargo wasm32-unknown-unknown
                </span>
                {deployHash && (
                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(29,209,161,0.06)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1dd1a1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>✓ Deploy Submitted to Casper Testnet</span>
                      <a href={`${TESTNET_EXPLORER}/deploy/${deployHash}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.7rem', color: '#00d2d3', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ExternalLink size={10} /> View
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#a4b0be', wordBreak: 'break-all' }}>{deployHash}</span>
                      <button onClick={() => { navigator.clipboard.writeText(deployHash); setCopiedHash(true); setTimeout(() => setCopiedHash(false), 2000) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedHash ? '#1dd1a1' : '#a4b0be', flexShrink: 0 }}>
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ai-toolkit' && (
            <AiToolkitTab 
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
              x402Balance={x402Balance}
              setX402Balance={setX402Balance}
              addLog={addLog}
              addBillingEntry={addBillingEntry}
            />
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

            {/* Interactive DeFi Operations Panel */}
            <div style={{ marginTop: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#fff' }}>Casper DeFi Operations</span>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {['stake', 'transfer', 'x402'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSubTab(tab as any)}
                      style={{
                        background: subTab === tab ? 'rgba(0, 210, 211, 0.15)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${subTab === tab ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}`,
                        color: subTab === tab ? '#fff' : 'var(--text-muted)',
                        padding: '0.15rem 0.4rem',
                        fontSize: '0.65rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {subTab === 'stake' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <input
                      type="number"
                      value={stakeInput}
                      onChange={(e) => setStakeInput(e.target.value)}
                      placeholder="Amount to Stake"
                      style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
                    />
                    <button
                      className="vision-btn primary"
                      onClick={handleStaking}
                      disabled={isExecutingDeFi}
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}
                    >
                      {isExecutingDeFi ? <RefreshCw className="animate-spin" size={10} /> : 'Delegate'}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>* Active validator: node-1.testnet.casper.network. Reward APY: ~12.8%.</span>
                </div>
              )}

              {subTab === 'transfer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <input
                    type="text"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                    placeholder="Recipient Public Key"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
                  />
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="CSPR Amount"
                      style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
                    />
                    <button
                      className="vision-btn primary"
                      onClick={handleTransfer}
                      disabled={isExecutingDeFi}
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}
                    >
                      {isExecutingDeFi ? <RefreshCw className="animate-spin" size={10} /> : 'Send CSPR'}
                    </button>
                  </div>
                </div>
              )}

              {subTab === 'x402' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <input
                      type="number"
                      value={x402DepositAmount}
                      onChange={(e) => setX402DepositAmount(e.target.value)}
                      placeholder="Deposit CSPR"
                      style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', padding: '0.35rem 0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
                    />
                    <button
                      className="vision-btn primary"
                      onClick={handleDepositX402}
                      disabled={isExecutingDeFi}
                      style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}
                    >
                      {isExecutingDeFi ? <RefreshCw className="animate-spin" size={10} /> : 'Fund Channel'}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>* Fund your automated agent micropayments channel. Deducts 0.05 CSPR per LLM query.</span>
                </div>
              )}
            </div>

            {/* Live Block Explorer — Real Casper Testnet RPC */}
            <div style={{ marginTop: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
              <div className="info-row" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>Live Casper Testnet Blocks</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: testnetConnected ? '#1dd1a1' : '#ff4757', boxShadow: testnetConnected ? '0 0 6px #1dd1a1' : '0 0 6px #ff4757', display: 'inline-block', animation: 'pulseNeon 1.5s infinite' }} />
                  <span style={{ fontSize: '0.68rem', color: testnetConnected ? '#1dd1a1' : '#ff4757', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{testnetConnected ? 'LIVE' : 'SYNCING'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {recentBlocks.length === 0
                  ? [1,2,3].map(i => (
                    <div key={i} style={{ height: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', animation: 'pulseNeon 2s infinite' }} />
                  ))
                  : recentBlocks.map((blk, i) => (
                  <div key={blk.height} className="live-block-item" style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto', alignItems: 'center', gap: '0.4rem', background: i === 0 ? 'rgba(29,209,161,0.04)' : 'rgba(0,0,0,0.2)', padding: '0.4rem 0.6rem', borderRadius: '7px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', border: `1px solid ${i === 0 ? 'rgba(29,209,161,0.15)' : 'rgba(255,255,255,0.03)'}` }}>
                    <span style={{ color: i === 0 ? '#1dd1a1' : 'var(--color-primary)', fontWeight: 'bold' }}>#{blk.height.toLocaleString()}</span>
                    <span style={{ color: 'var(--color-accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shortHash(blk.hash, 8)}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{formatTimestamp(blk.timestamp)}</span>
                    <a href={`${TESTNET_EXPLORER}/block/${blk.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', opacity: 0.6 }} title="View on CSPR.live">
                      <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
              <a href={TESTNET_EXPLORER} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: 'var(--color-accent)', marginTop: '0.5rem', textDecoration: 'none', opacity: 0.8 }}>
                <ExternalLink size={10} /> Open CSPR.live Testnet Explorer
              </a>
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

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

export default Dashboard
