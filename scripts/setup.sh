#!/bin/bash

# DATAVA Setup Script
# Sets up the complete environment for DATAVA

set -e # Exit on any error

echo "🚀 Setting up DATAVA environment..."

# Get the root directory
PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$PROJECT_ROOT"

echo "📦 Installing workspace dependencies..."
pnpm install

echo "✅ Dependencies installed!"

echo "📋 Setting up environment files..."

# Check if .env files exist and create if needed
if [ ! -f "apps/web/.env.local" ]; then
    echo "Creating apps/web/.env.local..."
    cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_PACKAGE_ID=0x912da5f68142a0dc8cd335a6f23a5b8a4fd9efc9c8d401f8b8c5e6f550131a16
NEXT_PUBLIC_POOL_ID=0x6d6502e346b58d73092886d14ab72cb24ae0ae0c847703dcb66a1a106a527735
NEXT_PUBLIC_WALRUS_RELAY=http://localhost:5051
NEXT_PUBLIC_INFERENCE_URL=http://localhost:5052
EOF
fi

if [ ! -f "services/ingestion/.env" ]; then
    echo "Creating services/ingestion/.env..."
    cat > services/ingestion/.env << 'EOF'
WALRUS_RELAY=https://upload-relay.testnet.walrus.space
PORT=5051
EOF
fi

if [ ! -f "services/inference/.env" ]; then
    echo "Creating services/inference/.env..."
    cat > services/inference/.env << 'EOF'
OPENAI_API_KEY=sk-your-api-key-here
PORT=5052
SYSTEM_PROMPT=You are DATAVA cooperative model. Answer concisely.
MODEL=gpt-4o
EOF
fi

echo "✅ Environment files created/verified!"

echo "🔍 Building services..."
cd services/ingestion && pnpm build 2>/dev/null || echo "Building ingestion service skipped (using tsx)..."
cd "$PROJECT_ROOT/services/inference" && pnpm build 2>/dev/null || echo "Building inference service skipped (using tsx)..."
cd "$PROJECT_ROOT/apps/web" && pnpm build 2>/dev/null || echo "Building web app skipped for now..."

echo "✅ Environment setup complete!"
echo ""
echo "💡 To run the application:"
echo "   1. Update services/inference/.env with your OpenAI API key"
echo "   2. Run: ./scripts/dev.sh"
echo ""
echo "💡 For production deployment:"
echo "   1. Update environment variables with production values"
echo "   2. Deploy each service separately"