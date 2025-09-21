# 🚀 KnowFi Setup & Installation Guide

This guide will help you set up KnowFi for local development and deployment on the Internet Computer.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **Yarn** (v1.22.0 or higher)
- **DFX** (DFINITY Canister SDK)
- **Git**

### Install DFX (DFINITY Canister SDK)

```bash
# Install DFX
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Add DFX to your PATH
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
dfx --version
```

### Install Node.js and Yarn

```bash
# Using Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Install Yarn
npm install -g yarn

# Verify installations
node --version
yarn --version
```

## 🔧 Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/crtzn/know_fi.git
cd know_fi
```

### 2. Install Dependencies

```bash
# Install root dependencies
yarn install

# Install frontend dependencies
cd src/know_fi_frontend
yarn install
cd ../..
```

### 3. Configure Environment

```bash
# Create environment file
cp .env.example .env

# Edit environment variables (if needed)
# Most default values should work for local development
```

### 4. Start Local Internet Computer Replica

```bash
# Start the local Internet Computer replica
dfx start --clean --background

# Alternative: Start in foreground (for debugging)
dfx start --clean
```

### 5. Deploy Canisters

```bash
# Deploy all canisters
dfx deploy

# Alternative: Deploy specific canisters
dfx deploy auth
dfx deploy profile
dfx deploy quiz
dfx deploy courses
dfx deploy forum
dfx deploy quests
dfx deploy icrc7
dfx deploy internet_identity
dfx deploy know_fi_frontend
```

### 6. Initialize Authentication

```bash
# Initialize the owner (run this once after deployment)
dfx canister call auth initializeOwner
```

### 7. Start the Frontend Development Server

```bash
# Navigate to frontend directory
cd src/know_fi_frontend

# Start the development server
yarn dev

# The application will be available at http://localhost:3000
```

## 🌐 Production Deployment

### Deploy to Internet Computer Mainnet

```bash
# Add cycles to your account (you'll need ICP tokens)
dfx wallet --network ic balance

# Deploy to mainnet
dfx deploy --network ic

# Update frontend environment for production
cd src/know_fi_frontend
yarn build
cd ../..
dfx deploy --network ic know_fi_frontend
```

### Deploy to IC Staging

```bash
# Deploy to staging network
dfx deploy --network staging
```

## 🔍 Verification

### Check Canister Status

```bash
# Check if all canisters are running
dfx canister status --all

# Check specific canister
dfx canister status auth
```

### Test Authentication

```bash
# Test Internet Identity integration
dfx canister call auth getUserRole --network local
```

### Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the KnowFi landing page
3. Click "Connect with Internet Identity" to authenticate
4. Complete the onboarding process

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process using port 4943 (DFX)
lsof -ti:4943 | xargs kill -9

# Kill process using port 3000 (Next.js)
lsof -ti:3000 | xargs kill -9
```

#### 2. DFX Start Issues
```bash
# Stop and restart DFX
dfx stop
dfx start --clean
```

#### 3. Canister Deployment Failures
```bash
# Check DFX identity
dfx identity whoami

# Check wallet balance
dfx wallet balance

# Clean and redeploy
dfx stop
dfx start --clean
dfx deploy
```

#### 4. Frontend Build Issues
```bash
# Clear Next.js cache
cd src/know_fi_frontend
rm -rf .next
yarn build
```

#### 5. Internet Identity Not Working
```bash
# Ensure Internet Identity canister is deployed
dfx canister status internet_identity

# Check canister URLs in environment
cat .env
```

### Reset Everything

If you encounter persistent issues, you can reset the entire local setup:

```bash
# Stop DFX
dfx stop

# Remove local state
rm -rf .dfx

# Start fresh
dfx start --clean
dfx deploy
```

## 📚 Development Workflow

### 1. Making Changes to Backend (Motoko)
```bash
# After modifying .mo files
dfx deploy <canister_name>

# For courses canister
dfx deploy courses

# Check logs
dfx canister logs courses
```

### 2. Making Changes to Frontend
```bash
# Changes are automatically reflected with hot reload
# No additional steps needed during development

# For production build
cd src/know_fi_frontend
yarn build
```

### 3. Testing Canister Functions
```bash
# Test canister methods directly
dfx canister call courses getCourses

# Test with parameters
dfx canister call auth assignRole '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai", variant { admin })'
```

## 🔐 Security Notes

### Development Environment
- Never use production private keys in development
- Internet Identity is safe to use in local development
- Local canisters are ephemeral and reset on `dfx start --clean`

### Production Environment
- Ensure proper access controls are configured
- Backup your DFX identity
- Use hardware wallets for significant ICP holdings
- Monitor canister cycle consumption

## 📞 Getting Help

If you encounter issues not covered in this guide:

1. Check the [Internet Computer documentation](https://internetcomputer.org/docs/current/developer-docs/quickstart/hello10mins)
2. Visit the [DFINITY Developer Forum](https://forum.dfinity.org/)
3. Consult the [Motoko Documentation](https://internetcomputer.org/docs/current/motoko/main/getting-started/)
4. Open an issue in the KnowFi repository

## 🔄 Updates and Maintenance

### Keeping Dependencies Updated

```bash
# Update DFX
dfx upgrade

# Update Node.js dependencies
yarn upgrade

# Update frontend dependencies
cd src/know_fi_frontend
yarn upgrade
```

### Backing Up Data

```bash
# Export canister state (for migration)
dfx canister call courses getCourses > courses_backup.json

# Backup DFX identity
cp ~/.config/dfx/identity/default/identity.pem ~/dfx_identity_backup.pem
```

---

🎉 **Congratulations!** You should now have a fully functional KnowFi development environment.

Ready to start learning and earning? Visit [http://localhost:3000](http://localhost:3000) and begin your KnowFi journey!