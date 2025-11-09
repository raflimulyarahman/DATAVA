# DATAVA - Decentralized AI Data Marketplace

🚀 **DATAVA** is a decentralized AI data marketplace that enables users to upload datasets to decentralized storage (Walrus), register them on Sui blockchain, run GPT-4.1 inference, and earn rewards through on-chain usage tracking.

## ✨ Features

- 📤 Upload datasets to decentralized storage (Walrus)
- 🔗 Register dataset ownership on Sui blockchain
- 🤖 Run GPT-4.1 inference via AI backend
- 💰 Earn rewards through on-chain usage tracking
- 🎨 Beautiful neon-themed UI with glass morphism

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router) with React 18
- Tailwind CSS with neon gradient theme
- @mysten/dapp-kit for Sui wallet integration
- Glass morphism cards, dark background, cyan/pink accents

### Backend Services
- **Ingestion Service**: Express.js for handling file uploads to Walrus relay
- **Inference Service**: Express.js for OpenAI GPT-4.1 API integration
- CORS enabled, proper error handling, environment variables

### Blockchain
- Sui Move smart contracts (`datava::core`)
- Functions: `create_pool`, `contribute`, `publish_model`, `record_usage`
- Event emission for contributions and usage

### Storage
- Walrus decentralized storage (testnet relay)
- CID generation and retrieval

## 🚀 Quick Start

### Prerequisites
- Node.js v20+ 
- pnpm installed (`npm install -g pnpm`)
- Sui CLI (optional, for contract deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DATAVA
```

2. Install dependencies:
```bash
pnpm install
```

3. Create environment files:

**Frontend (.env.local in apps/web):**
```env
NEXT_PUBLIC_PACKAGE_ID=REPLACE_WITH_PACKAGE_ID
NEXT_PUBLIC_POOL_ID=REPLACE_WITH_POOL_ID
NEXT_PUBLIC_WALRUS_RELAY=http://localhost:5051
NEXT_PUBLIC_INFERENCE_URL=http://localhost:5052
```

**Ingestion Service (.env in services/ingestion):**
```env
WALRUS_RELAY=https://upload-relay.testnet.walrus.space
PORT=5051
```

**Inference Service (.env in services/inference):**
```env
OPENAI_API_KEY=sk-your-api-key-here
PORT=5052
SYSTEM_PROMPT=You are DATAVA cooperative model. Answer concisely.
MODEL=gpt-4
```

4. Start all services with one command:
```bash
./scripts/dev.sh
```

Alternatively, start services individually:

Terminal 1 - Ingestion Service:
```bash
cd services/ingestion && pnpm dev
```

Terminal 2 - Inference Service:
```bash
cd services/inference && pnpm dev
```

Terminal 3 - Frontend:
```bash
cd apps/web && pnpm dev
```

Your DATAVA marketplace will be available at `http://localhost:3000`

## 📁 Project Structure

```
DATAVA/
├── apps/
│   └── web/                    # Next.js 14 frontend (Neon UI)
├── services/
│   ├── ingestion/              # Walrus upload service
│   └── inference/              # OpenAI inference service
├── contracts/                  # Sui Move smart contracts
├── packages/
│   └── sdk/                    # TypeScript SDK for contracts
└── scripts/
    └── dev.sh                  # One-click dev startup
```

## 🎯 Core Workflows

### 1. Wallet Connection & Pool Setup
- Connect Sui wallet via UI
- System displays PACKAGE_ID/POOL_ID
- Option to create a new pool

### 2. Dataset Contribution
- File Upload → Walrus CID generation
- Sign `contribute()` transaction
- Show transaction digest
- Emit `EContributed` events

### 3. AI Inference & Usage Tracking
- Input Prompt → GPT-4.1 Inference
- Display Output
- Sign `record_usage()` transaction
- Emit `EUsageRecorded` events

## 🔗 API Endpoints

### Ingestion Service (Port 5051)
- `POST /upload` - Upload file to Walrus storage
- Returns: `{ "cid": "walrus-cid", "filename", "size" }`

### Inference Service (Port 5052)
- `POST /infer` - Run AI inference
- Payload: `{ "input": "user prompt", "poolId": "...", "metadata": {...} }`
- Returns: `{ "text": "model response", "tokens": 150 }`

## 🏗️ Smart Contract Functions

### `datava::core` Module
- `create_pool()` - Initialize a new data pool
- `contribute(pool, blob_cid, license, size, weight)` - Register dataset
- `publish_model(pool, name, description)` - Publish AI model
- `record_usage(pool, version, tokens, fee)` - Track usage for rewards

## 🚀 Deployment

### Environment Configuration
Set appropriate environment variables for your deployment target.

### Frontend
```bash
cd apps/web
pnpm build
pnpm start
```

## 💡 Demo Script

1. **Connect Wallet** (0:00-0:30)
   - Click "Connect Wallet" button
   - Select your Sui wallet
   - Verify connection and view pool information

2. **Upload Sample Dataset** (0:30-1:00)
   - Navigate to dashboard
   - Drag & drop a dataset file
   - View the generated CID

3. **Contribute to Blockchain** (1:00-1:30)
   - Click "Contribute" button
   - Approve transaction in wallet
   - View transaction digest

4. **Run AI Inference** (1:30-2:45)
   - Enter a prompt in the inference section
   - Click "Run Inference"
   - View AI response
   - Usage is automatically recorded on-chain

5. **Usage Events** (2:45-3:00)
   - View recorded usage events
   - Understand reward distribution mechanism

## 🧪 Testing

Run tests for individual services:
```bash
# Frontend tests
cd apps/web && pnpm test

# Backend service tests
cd services/ingestion && pnpm test
cd services/inference && pnpm test
```

## 🛡️ Security

- Never commit `.env` files
- Use proper CORS restrictions for production
- Implement file size validation
- Add rate limiting on inference endpoints
- Sanitize user inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Notes

- For production use, replace the mock implementations with real API calls
- Ensure proper gas handling for Sui transactions
- The GPT-4.1 model should be available through your OpenAI account
- Testnet Sui addresses will need to be updated for mainnet deployment

---

Made with ❤️ for the decentralized future of AI data marketplaces.