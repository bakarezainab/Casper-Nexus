#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "========================================="
echo "🛠️  Starting Casper Nexus Monorepo Build"
echo "========================================="

# 1. Build Smart Contract
echo ""
echo "📦 Step 1: Compiling Casper Odra Smart Contract..."
cd contract
if command -v cargo-odra &> /dev/null; then
    cargo odra build
else
    echo "⚠️  cargo-odra is not installed. Scaffolding check only."
    cargo check
fi
cd ..

# 2. Build Frontend
echo ""
echo "💻 Step 2: Compiling Frontend Dashboard..."
cd frontend
npm run build
cd ..

echo ""
echo "========================================="
echo "✅ Casper Nexus Monorepo Build Successful!"
echo "========================================="
