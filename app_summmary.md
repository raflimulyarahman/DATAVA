# Prompt: Build DATAVA (Full-Stack AI Data Marketplace)

## 🚀 Mission
Create a **decentralized AI data marketplace** called **DATAVA** that enables users to:
- 📤 Upload datasets to decentralized storage (Walrus)
- 🔗 Register dataset ownership on Sui blockchain
- 🤖 Run GPT-4.1 inference via AI backend
- 💰 Earn rewards through on-chain usage tracking
- 🎨 Experience a polished, neon-themed UI ready for demo

## 🛠 Tech Stack Requirements

**Frontend:**
- Next.js 14 (App Router) + React 18
- Tailwind CSS with neon gradient theme
- @mysten/dapp-kit for Sui wallet integration
- Glass morphism cards, dark background, cyan/pink accents

**Backend Services:**
- **Ingestion Service**: Express.js, handles file uploads to Walrus relay
- **Inference Service**: Express.js, integrates OpenAI GPT-4.1 API
- CORS enabled, proper error handling, environment variables

**Blockchain:**
- Sui Move smart contracts (`datava::core`)
- Functions: `create_pool`, `contribute`, `publish_model`, `record_usage`
- Event emission for contributions and usage

**Storage:**
- Walrus decentralized storage (testnet relay)
- CID generation and retrieval

## 🎯 Critical Demo Flows (Must Implement)

### Flow 1: Wallet Connection & Pool Setup
```
Connect Wallet → Display PACKAGE_ID/POOL_ID → Optional "Create Pool" modal
```

### Flow 2: Dataset Contribution
```
File Upload → Walrus CID → Sign contribute() TX → Show TX digest → EContributed event
```

### Flow 3: AI Inference & Usage Tracking
```
Input Prompt → GPT-4.1 Inference → Display Output → Sign record_usage() TX → EUsageRecorded event
```

## 📁 Repository Structure (Monorepo)

```
DATAVA/
├── apps/
│   └── web/                    # Next.js 14 (Neon UI)
│       ├── app/               # App Router pages
│       ├── components/        # Reusable components
│       ├── lib/               # Sui & utility functions
│       └── .env.example
├── services/
│   ├── ingestion/             # Walrus upload service
│   │   ├── index.js
│   │   └── .env.example
│   └── inference/             # OpenAI inference service
│       ├── index.js
│       └── .env.example
├── contracts/
│   ├── Move.toml
│   └── sources/
│       └── core.move          # Main Move module
├── packages/
│   └── sdk/                   # TypeScript SDK for contracts
├── scripts/
│   ├── dev.sh                 # One-click dev startup
│   └── hexify.js              # String to hex conversion
└── README.md                  # Comprehensive setup guide
```

## 🎨 UI/UX Specifications (High Priority)

**Theme:** Neon Futurism
- Dark background (`#0a0a0a`)
- Cyan (`#00f5ff`) to pink (`#ff00ff`) gradients
- Glass cards with backdrop blur
- Real-time status indicators (upload progress, TX status, inference loading)

**Layout Components:**
- Header with `ConnectWallet` button + environment info
- Three main cards: Upload → Contribute → Run Model
- Toast notifications for all actions
- Copyable CID links and transaction digests

## 🔧 Environment Configuration

**Frontend (.env.example):**
```env
NEXT_PUBLIC_PACKAGE_ID=REPLACE_WITH_PACKAGE_ID
NEXT_PUBLIC_POOL_ID=REPLACE_WITH_POOL_ID
NEXT_PUBLIC_WALRUS_RELAY=https://upload-relay.testnet.walrus.space
NEXT_PUBLIC_INFERENCE_URL=http://localhost:5052/infer
```

**Ingestion Service (.env.example):**
```env
WALRUS_RELAY=https://upload-relay.testnet.walrus.space
PORT=5051
```

**Inference Service (.env.example):**
```env
OPENAI_API_KEY=REPLACE_WITH_YOUR_KEY
PORT=5052
SYSTEM_PROMPT=You are DATAVA cooperative model. Answer concisely.
MODEL=gpt-4.1
```

## 📡 API Specifications

### POST /upload (Ingestion Service)
- Multipart form with `file` field
- Stream to Walrus relay
- Return: `{ "cid": "walrus-cid" }`
- File size limit: 200MB

### POST /infer (Inference Service)
- JSON payload: `{ "input": "user prompt", "poolId": "...", "metadata": {...} }`
- Call OpenAI Chat Completions (GPT-4.1)
- Return: `{ "text": "model response", "tokens": 150 }`

## 🔗 Smart Contract Integration

**Move Module:** `datava::core`
- Shared `Pool` object for reward distribution
- `Contribution` objects for dataset registration
- `ModelArtifact` for model publishing
- `record_usage` function with event emission

**Key Transactions:**
- `contribute(pool, blob_cid, license, size, weight)`
- `record_usage(pool, version, tokens, fee)`

## 🚀 Local Development Setup

**One-Command Startup:**
```bash
pnpm install
./scripts/dev.sh  # Starts all services + frontend
```

**Manual Startup:**
```bash
# Terminal 1 - Ingestion
pnpm --filter services/ingestion dev

# Terminal 2 - Inference  
pnpm --filter services/inference dev

# Terminal 3 - Frontend
cd apps/web && pnpm dev
```

## 🧪 Testing & Quality

**Automated Checks:**
- ESLint + Prettier configuration
- Jest tests for frontend components
- Integration tests for upload/inference flows
- GitHub Actions CI/CD pipeline

**Security Measures:**
- Never commit `.env` files
- CORS restrictions for production
- File size validation
- Rate limiting on inference endpoint
- Input sanitization


**0:00-0:30** - Intro: "DATAVA enables data contributors to earn rewards when their datasets power AI inference"

**0:30-1:00** - Connect wallet + show pool creation (environment setup)

**1:00-1:30** - Upload sample dataset → display Walrus CID

**1:30-2:00** - Sign `contribute()` transaction → show TX digest

**2:00-2:45** - Run GPT-4.1 inference → display output → sign `record_usage()`

**2:45-3:00** - Close: Show usage events and explain reward distribution

## 📋 Acceptance Criteria

- [ ] Monorepo runs with `pnpm install && pnpm dev`
- [ ] File upload returns valid Walrus CID
- [ ] Frontend signs `contribute()` and shows TX digest
- [ ] Inference service calls GPT-4.1 and returns response
- [ ] `record_usage()` transaction executes successfully
- [ ] Neon UI is responsive and polished
- [ ] README includes complete setup instructions
- [ ] No secrets committed to repository

## 🎁 Deliverables

1. **Complete GitHub repository** with monorepo structure
2. **Working frontend** at `localhost:3000`
3. **Backend services** running on ports 5051-5052
4. **Sui Move contracts** deployable to testnet
5. **Comprehensive README** with:
   - Environment setup
   - Contract deployment commands
   - Demo script
   - Troubleshooting guide

**Priority:** Demo reliability > Speed > Feature completeness  
**Security:** Zero committed secrets, proper environment variable handling  
**UX:** Minimal clicks to complete full workflow, clear status feedback

---


# Prompt: Build DATAVA AI Data Marketplace

## 📋 Project Overview
Create **DATAVA** - a decentralized AI data marketplace where users can upload datasets, register them on-chain, and earn rewards when their data is used for AI inference.

## 🎯 Core Requirements

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Neon UI theme
- **Blockchain**: Sui Move contracts + @mysten/dapp-kit
- **Storage**: Walrus decentralized storage
- **AI**: OpenAI GPT-4.1 inference backend
- **Architecture**: Monorepo with pnpm workspaces

### Must-Have Features
1. **Wallet Integration**: Connect Sui wallet with dapp-kit
2. **Dataset Upload**: File → Walrus → CID generation
3. **On-chain Registration**: Contribute datasets to pool via Move calls
4. **AI Inference**: GPT-4.1 backend with usage tracking
5. **Usage Rewards**: Record usage on-chain for contributor payments
6. **Polished Neon UI**: Dark theme with cyan/pink gradients

## 📁 Repository Structure
```
DATAVA/
├── apps/web/                 # Next.js frontend (port 3000)
├── services/ingestion/       # Walrus upload service (port 5051)  
├── services/inference/       # OpenAI service (port 5052)
├── contracts/               # Sui Move smart contracts
├── packages/sdk/            # TypeScript contract helpers
└── scripts/                 # Dev utilities
```

## 🔥 Critical User Flows

### Flow 1: Dataset Contribution
```
Connect Wallet → Upload File → Get Walrus CID → Sign contribute() TX → Show Success
```

### Flow 2: AI Inference & Payment
```
Input Prompt → Call GPT-4.1 → Display Output → Sign record_usage() TX → Track Rewards
```

## 🎨 UI/UX Specifications
- **Theme**: Neon futurism (dark bg, cyan/pink gradients, glass cards)
- **Layout**: Three main cards (Upload → Contribute → Run Model)
- **Status**: Real-time toasts for uploads, transactions, inference
- **Responsive**: Mobile-first, accessible design

## 🔐 Environment Setup
Create `.env.example` files with:
- Frontend: Package IDs, Walrus relay, inference URL
- Services: Ports, OpenAI key, Walrus endpoints
- **Security**: Never commit actual keys

## 🚀 Demo Readiness
- **One-command startup**: `./scripts/dev.sh`
- **3-minute demo script** included in README
- **Transaction feedback**: Clear success/error states
- **Polish**: Professional, hackathon-ready presentation

## 📋 Acceptance Criteria
- [ ] Full monorepo runs locally with pnpm
- [ ] File upload returns Walrus CID
- [ ] Move calls execute successfully (contribute, record_usage)
- [ ] GPT-4.1 inference works end-to-end
- [ ] Neon UI is responsive and polished
- [ ] Complete documentation and setup guide

---

**Priority**: Demo reliability > Speed > Feature completeness  
**Focus**: Make the core flows work flawlessly for presentation  
**Security**: Zero secrets in repo, proper environment handling

*Ready to build a production-ready demo that showcases decentralized AI data economy on Sui blockchain.*