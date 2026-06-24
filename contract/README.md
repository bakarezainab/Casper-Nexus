# Casper Nexus Smart Contract

This directory contains the official **Casper Nexus Asset** smart contract built using the **Odra** framework for the Casper Network.

## Project Structure

* `src/lib.rs`: The main contract module representing `CasperNexusAsset` with state storage variables, initializers, getters, and events.
* `Cargo.toml`: Package dependencies and compiler optimization profiles (LTO, codegen-units, etc.).
* `Odra.toml`: Schema name and default Casper execution backends.

## Prerequisites

Ensure you have Rust and Cargo installed:
```bash
rustup target add wasm32-unknown-unknown
cargo install cargo-odra
```

## Compilation

To compile the smart contract into optimized WebAssembly (`.wasm`) binaries ready for the Casper Network:
```bash
cargo odra build
```

This generates the compiled WASM binary inside the target directory, ready to be deployed.

## Testing

Odra comes with built-in VM simulation capabilities to test smart contracts locally:
```bash
cargo odra test
```
