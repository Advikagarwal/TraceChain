# AgriTrust: Decentralized Agricultural Supply Chain Platform

A comprehensive blockchain-based platform that revolutionizes agricultural supply chains through transparency, AI-powered quality assessment, and ethical farming verification.

## 🌱 Overview

AgriTrust combines cutting-edge blockchain technology with artificial intelligence to create a transparent, fair, and sustainable agricultural ecosystem. From farm to table, every step is verified and recorded on an immutable ledger.

## ✨ Key Features

- **Blockchain Verification**: Immutable supply chain records using ERC-721 NFTs
- **AI Quality Assessment**: Computer vision-powered quality scoring
- **Fairness Verification**: Comprehensive evaluation of labor and environmental practices
- **Real-time Tracking**: Complete traceability from farm to consumer
- **Market Analytics**: Price forecasting and market trend analysis
- **Producer Network**: Verified farmer registration and certification system
- **Mobile-First Design**: Optimized for field use with offline capabilities

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Ethers.js for Web3 integration
- **State Management**: React Query for server state
- **Animations**: Framer Motion for smooth interactions
- **Build Tool**: Vite for fast development

### Backend (Python + FastAPI)
- **Framework**: FastAPI with async/await support
- **Database**: MongoDB with Motor async driver
- **Validation**: Pydantic models for type safety
- **AI Services**: Custom quality assessment algorithms
- **Blockchain**: Web3.py for smart contract interaction

### Blockchain (Solidity + Hardhat)
- **Smart Contracts**: Solidity with OpenZeppelin libraries
- **Development**: Hardhat for testing and deployment
- **Standards**: ERC-721 NFTs for batch tokenization
- **Oracles**: AI-powered quality and fairness assessment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+ and pip
- MongoDB 6.0+
- MetaMask browser extension

### Installation

1. **Clone and setup the project**:
```bash
git clone <repository-url>
cd agritrust-platform
npm install
```

2. **Setup the backend**:
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
```

3. **Setup blockchain development**:
```bash
cd blockchain
npm install
cp .env.example .env
# Add your private key and RPC URLs
```

4. **Start MongoDB**:
```bash
mongod --dbpath /path/to/your/db
```

### Development

1. **Start the backend server**:
```bash
cd backend
python main.py
```

2. **Deploy smart contracts** (optional for local development):
```bash
cd blockchain
npx hardhat node  # Start local blockchain
npx hardhat run scripts/deploy.js --network localhost
```

3. **Start the frontend**:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage

### For Producers

1. **Register**: Complete the producer registration form with farm details
2. **Verification**: Submit certifications for platform verification
3. **Create Batches**: Register new produce batches with harvest information
4. **Quality Assessment**: Upload images for AI-powered quality scoring
5. **Track Progress**: Monitor your products through the supply chain

### For Consumers

1. **Browse Marketplace**: Explore verified agricultural products
2. **Track Products**: Use batch IDs or QR codes to trace product journey
3. **Verify Quality**: View AI-assessed quality and fairness scores
4. **Make Informed Choices**: Access complete transparency data

### For Distributors

1. **Monitor Supply Chain**: Track products through distribution network
2. **Verify Authenticity**: Confirm product provenance via blockchain
3. **Update Status**: Record handling and transportation events
4. **Quality Control**: Maintain product integrity throughout distribution

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_CONTRACT_ADDRESS=0x...
VITE_NETWORK_ID=1337
```

**Backend (.env)**:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=agritrust
RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=0x...
SECRET_KEY=your-secret-key
```

**Blockchain (.env)**:
```env
PRIVATE_KEY=0x...
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
MAINNET_RPC_URL=https://mainnet.infura.io/v3/...
ETHERSCAN_API_KEY=...
```

## 🧪 Testing

### Frontend Tests
```bash
npm run test
```

### Backend Tests
```bash
cd backend
pytest
```

### Smart Contract Tests
```bash
cd blockchain
npx hardhat test
```

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Backend (Docker)
```bash
cd backend
docker build -t agritrust-api .
docker run -p 8000:8000 agritrust-api
```

### Smart Contracts (Mainnet)
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network mainnet
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- The Ethereum community for blockchain infrastructure
- Agricultural experts who provided domain knowledge
- Open source contributors who made this project possible

## 📞 Support

For support, email support@agritrust.com or join our Discord community.

---

**AgriTrust** - Building a transparent, fair, and sustainable food system through blockchain technology.