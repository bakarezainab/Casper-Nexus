# Casper Nexus — Monorepo

Welcome to the **Casper Nexus** monorepo! This repository is organized into distinct directories to keep the project clean, structured, and easy to maintain.

## Repository Layout

```
casper-nexus/
├── frontend/             # React & Vite TypeScript Dashboard portal
│   ├── src/              # Source code (Voice/Vision Agents, IDE, and UI)
│   ├── public/           # Static assets
│   ├── package.json      # Frontend package details & dependencies
│   └── vite.config.ts    # Vite configuration
│
└── contract/             # Casper Odra Smart Contract project
    ├── src/              # Rust source code (lib.rs)
    ├── Cargo.toml        # Rust dependencies & optimization profiles
    ├── Odra.toml         # Odra framework settings
    └── README.md         # Guide to compiling and testing the contract
```

---

## Getting Started

### 1. Run the Frontend Dashboard
To run the interactive agentic dashboard locally:
```bash
cd frontend
npm install
npm run dev
```

The application will be served at `http://localhost:5173/`.

### 2. Compile the Smart Contract
To build the WebAssembly binaries for the Casper Network:
```bash
cd contract
cargo odra build
```

---

## Features Built
* **Voice Agent**: Multi-modal speech recognition and natural voice synthesis for hands-free Casper wallet commands (staking, transferring, deploying).
* **Vision Agent**: Premium real-time computer vision camera scanning view with an elegant animated HUD grid scanner fallback (to analyze design blueprints or real-world physical assets).
* **x402 Micropayments**: Native integration of agent micropayment channels debiting micro-amounts of CSPR per LLM query and vision scan.
* **On-chain Integrations**: Direct asynchronous Casper Wallet extension popup connection and real-time block explorer feeds.
