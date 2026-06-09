# ⚡ Casper Nexus

**An autonomous multimodal AI Agent portal built for the Casper Agentic Buildathon 2026.**

[![Built for Casper](https://img.shields.io/badge/Built%20for-Casper%20Buildathon-ff4757?style=for-the-badge)](https://dorahacks.io/hackathon/casper-agentic-buildathon/detail)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)](https://vite.dev)
[![Casper](https://img.shields.io/badge/Casper-Testnet-ff4757?style=for-the-badge)](https://testnet.cspr.live)

---

## 🌐 Live Interface

Casper Nexus consists of two connected views:

- **Landing Page** — Full marketing site with Logo, Features, How It Works, Models, Use Cases, CTA, and Footer
- **Dashboard App** — Agentic AI portal with Voice Agent, Vision Scanner, and Odra Rust IDE

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🎙️ **Voice Intelligence Agent** | STT voice commands for DeFi operations: check balance, stake CSPR, swap tokens |
| 👁️ **Real-World Vision Scanner** | Camera feed with HUD overlays for detecting objects and flowchart sketches |
| 🦀 **Odra Rust IDE** | In-browser smart contract editor with WASM compiler and Testnet deploy |
| ⚡ **x402 Micropayments** | HTTP-native autonomous payment channel deducting fees per AI inference call |
| 🖼️ **CEP-78 NFT Minting** | Scan physical objects and register them as digital twin NFTs on Casper |
| 📊 **Chain Metrics Console** | Real-time log terminal with SVG staking ring and trading volume chart |

---

## 🏗️ Architecture

```
Landing Page (LandingPage.tsx)
├── Navbar — Sticky nav with logo and smooth-scroll links
├── Hero — Animated logo rings, headline, CTA buttons, feature pills
├── Features — 6 Web3 capability cards
├── How It Works — 4-step blockchain workflow
├── Models — Tech stack: Blockchain, AI & Voice, Payments
├── Use Cases — 6 real-world application scenarios
├── CTA — Launch App + GitHub buttons
└── Footer — Links to GitHub, DoraHacks, Casper Docs

Dashboard App (Dashboard.tsx)
├── Voice Agent Tab — Mic orb, waves, transcript bubbles, quick commands
├── Vision Agent Tab — Camera viewport with HUD overlays and bounding boxes
├── Odra Rust IDE Tab — Code editor with compile & deploy workflow
└── Chain Metrics Panel — Staking ring, x402 balance, volume chart, log console
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 8
- **Styling**: Vanilla CSS with glassmorphism, neon gradients, keyframe animations
- **Icons**: Lucide React
- **Blockchain**: Casper Testnet RPC, Odra Framework, CEP-78 standard
- **AI/Voice**: Web Speech API (STT + TTS), Vision Inference simulation
- **Payments**: x402 micropayment protocol simulation
- **Smart Contracts**: Rust + Odra framework → WASM32

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to view the landing page. Click **Launch App** to enter the agentic dashboard.

---

## 📖 Hackathon Details

- **Event**: [Casper Agentic Buildathon 2026](https://dorahacks.io/hackathon/casper-agentic-buildathon/detail)
- **Tracks**: Agentic AI · DeFi · Real-World Assets · Casper Network
- **Keywords**: Blockchain · Web3 · Rust · Global

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx       # Sticky navigation bar
│   ├── Hero.tsx         # Hero section with animated logo
│   ├── Features.tsx     # 6 feature cards
│   ├── HowItWorks.tsx   # 4-step workflow
│   ├── Models.tsx       # Tech stack cards
│   ├── UseCases.tsx     # Use case scenarios
│   ├── CTA.tsx          # Call-to-action section
│   └── Footer.tsx       # Footer with links
├── LandingPage.tsx      # Landing page assembler
├── Dashboard.tsx        # Main AI agent dashboard
├── main.tsx             # Root with state-based router
├── landing.css          # Landing page styles
├── App.css              # Dashboard styles
└── index.css            # Global design tokens & animations
```

---

*© 2026 Casper Nexus — Built with ❤️ for the Casper Agentic Buildathon*
