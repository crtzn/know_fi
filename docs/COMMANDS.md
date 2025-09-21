# ⚡ KnowFi Commands & Scripts Reference

This document provides a comprehensive reference for all commands and scripts used in KnowFi development, deployment, and maintenance.

## 📋 Table of Contents

- [Project Setup](#-project-setup)
- [Development Commands](#-development-commands)
- [Canister Management](#-canister-management)
- [Frontend Commands](#-frontend-commands)
- [Testing Commands](#-testing-commands)
- [Deployment Commands](#-deployment-commands)
- [Maintenance Commands](#-maintenance-commands)
- [Troubleshooting Commands](#-troubleshooting-commands)

## 🚀 Project Setup

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/crtzn/know_fi.git
cd know_fi

# Install DFX (DFINITY Canister SDK)
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Install Node.js dependencies
yarn install

# Install frontend dependencies
cd src/know_fi_frontend
yarn install
cd ../..

# Check installations
dfx --version
node --version
yarn --version
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env

# Verify environment
cat .env
```

## 🔧 Development Commands

### Starting Development Environment

```bash
# Start local Internet Computer replica
dfx start --clean --background

# Alternative: Start in foreground (for debugging)
dfx start --clean

# Check replica status
dfx ping

# Stop replica
dfx stop
```

### Identity Management

```bash
# Check current identity
dfx identity whoami

# List all identities
dfx identity list

# Create new identity
dfx identity new developer

# Switch identity
dfx identity use developer

# Get principal ID
dfx identity get-principal

# Export identity (backup)
dfx identity export alice > alice-identity.pem

# Import identity
dfx identity import bob bob-identity.pem
```

## 🏗️ Canister Management

### Deployment Commands

```bash
# Deploy all canisters
dfx deploy

# Deploy specific canister
dfx deploy auth
dfx deploy profile
dfx deploy courses
dfx deploy quiz
dfx deploy quests
dfx deploy forum
dfx deploy icrc7
dfx deploy internet_identity
dfx deploy know_fi_frontend

# Deploy with arguments
dfx deploy auth --argument '()'

# Deploy to specific network
dfx deploy --network local
dfx deploy --network ic
dfx deploy --network staging
```

### Canister Status & Information

```bash
# Check status of all canisters
dfx canister status --all

# Check specific canister status
dfx canister status auth

# Get canister ID
dfx canister id auth

# List all canisters
dfx canister list

# Get canister info
dfx canister info auth
```

### Canister Operations

```bash
# Start canister
dfx canister start auth

# Stop canister
dfx canister stop auth

# Delete canister
dfx canister delete auth

# Install canister (after creation)
dfx canister install auth

# Upgrade canister
dfx canister install auth --mode upgrade

# Reinstall canister (fresh start)
dfx canister install auth --mode reinstall
```

### Canister Method Calls

```bash
# Call canister methods directly

# Authentication canister
dfx canister call auth initializeOwner
dfx canister call auth assignRole '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai", variant { admin })'
dfx canister call auth getUserRole '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai")'
dfx canister call auth hasRole '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai", variant { admin })'

# Profile canister
dfx canister call profile getProfile
dfx canister call profile getUserByUsername '("john_doe")'

# Courses canister
dfx canister call courses getCourses
dfx canister call courses getCourseById '(1)'
dfx canister call courses getCoursesByCategory '("blockchain")'
dfx canister call courses searchCourses '("motoko")'
dfx canister call courses approveCourse '(1)'

# Quiz canister
dfx canister call quiz getRandomQuiz '(opt "blockchain")'
dfx canister call quiz getUserTokenBalance
dfx canister call quiz getUserQuizHistory

# Quests canister
dfx canister call quests completeQuest
dfx canister call quests dailyClaim

# Forum canister
dfx canister call forum getPosts
dfx canister call forum getPostById '(1)'

# ICRC7 canister
dfx canister call icrc7 getUserTokens '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai")'
```

### Canister Logs & Debugging

```bash
# View canister logs
dfx canister logs auth
dfx canister logs courses

# Install canister with debug mode
dfx deploy auth --mode install --argument '()' --yes

# Call with debug output
dfx canister call auth getUserRole '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai")' --output raw
```

## 🎨 Frontend Commands

### Development Server

```bash
# Navigate to frontend directory
cd src/know_fi_frontend

# Start development server
yarn dev

# Start development server on specific port
yarn dev -p 3001

# Start with turbo mode
yarn dev:turbo

# Build for production
yarn build

# Start production server
yarn start

# Serve static files
yarn start:static
```

### Code Quality

```bash
# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# Format staged files only
yarn format:staged

# Type check
yarn type-check

# Check all (lint + type check)
yarn check-all
```

### Package Management

```bash
# Install dependencies
yarn install

# Add new dependency
yarn add @radix-ui/react-dialog

# Add dev dependency
yarn add -D @types/react

# Remove dependency
yarn remove lodash

# Update dependencies
yarn upgrade

# Check outdated packages
yarn outdated

# Clean node_modules
rm -rf node_modules && yarn install
```

## 🧪 Testing Commands

### Frontend Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run specific test file
yarn test CourseCard.test.tsx

# Run tests matching pattern
yarn test --testNamePattern="Course"
```

### Canister Tests

```bash
# Test canister functionality directly
dfx canister call courses getCourses
dfx canister call auth initializeOwner

# Run custom test scripts
./scripts/test-auth.sh
./scripts/test-courses.sh
./scripts/test-integration.sh

# Load test data
./scripts/load-test-data.sh
```

### End-to-End Tests

```bash
# Run E2E tests (if configured)
yarn test:e2e

# Run specific E2E test
yarn test:e2e --grep "course creation"

# Run E2E tests headlessly
yarn test:e2e --headless
```

## 🚀 Deployment Commands

### Local Deployment

```bash
# Full local deployment
dfx start --clean --background
dfx deploy
cd src/know_fi_frontend && yarn build && cd ../..
dfx deploy know_fi_frontend

# Quick redeploy after changes
dfx deploy courses  # After backend changes
yarn build && dfx deploy know_fi_frontend  # After frontend changes
```

### Mainnet Deployment

```bash
# Check wallet balance
dfx wallet --network ic balance

# Deploy to mainnet
dfx deploy --network ic

# Deploy specific canister to mainnet
dfx deploy --network ic courses

# Upgrade canister on mainnet
dfx canister --network ic install courses --mode upgrade
```

### Staging Deployment

```bash
# Deploy to staging
dfx deploy --network staging

# Check staging canisters
dfx canister --network staging status --all
```

### Cycles Management

```bash
# Check wallet balance
dfx wallet balance

# Top up canister with cycles
dfx canister deposit-cycles 1000000000000 courses

# Check canister cycles
dfx canister status courses | grep "Balance"

# Transfer cycles between wallets
dfx wallet send 1000000000000 rrkah-fqaaa-aaaaa-aaaaq-cai
```

## 🔧 Maintenance Commands

### Database Operations

```bash
# Backup canister data
dfx canister call courses getCourses > backups/courses_$(date +%Y%m%d).json
dfx canister call profile getAllProfiles > backups/profiles_$(date +%Y%m%d).json

# Reset canister state (destructive!)
dfx canister install courses --mode reinstall

# Migrate data (custom script)
./scripts/migrate-data.sh
```

### Monitoring & Analytics

```bash
# Check canister performance
dfx canister status --all

# Monitor logs continuously
dfx canister logs courses --follow

# Check error rates
./scripts/check-error-rates.sh

# Generate usage report
./scripts/usage-report.sh
```

### Updates & Upgrades

```bash
# Update DFX
dfx upgrade

# Update Node.js dependencies
yarn upgrade

# Update frontend dependencies
cd src/know_fi_frontend && yarn upgrade

# Check for security vulnerabilities
yarn audit

# Fix security issues
yarn audit fix
```

## 🔍 Troubleshooting Commands

### Network Issues

```bash
# Reset local replica
dfx stop
dfx start --clean

# Check network connectivity
dfx ping
curl -I https://ic0.app

# Reset network state
rm -rf .dfx/network/local/

# Force clean restart
dfx stop && rm -rf .dfx && dfx start --clean
```

### Canister Issues

```bash
# Check canister cycles
dfx canister status courses | grep Balance

# View detailed canister info
dfx canister info courses --verbose

# Force stop stuck canister
dfx canister stop courses --force

# Reinstall problematic canister
dfx canister install courses --mode reinstall --yes
```

### Frontend Issues

```bash
# Clear Next.js cache
cd src/know_fi_frontend
rm -rf .next
yarn build

# Clear all caches
rm -rf node_modules .next yarn.lock
yarn install

# Check build output
yarn build --debug

# Analyze bundle size
yarn build --analyze
```

### Development Issues

```bash
# Check port usage
lsof -i :4943  # DFX port
lsof -i :3000  # Next.js port

# Kill processes
pkill -f dfx
pkill -f next

# Clear all state
dfx stop
rm -rf .dfx
rm -rf src/know_fi_frontend/.next
rm -rf node_modules
yarn install
dfx start --clean
dfx deploy
```

## 📊 Utility Scripts

### Custom Scripts

Create these in the `/scripts` directory:

```bash
# scripts/quick-deploy.sh
#!/bin/bash
dfx deploy courses
cd src/know_fi_frontend && yarn build && cd ../..
dfx deploy know_fi_frontend
echo "Deployment complete!"

# scripts/backup-data.sh
#!/bin/bash
mkdir -p backups
dfx canister call courses getCourses > "backups/courses_$(date +%Y%m%d_%H%M).json"
dfx canister call profile getAllProfiles > "backups/profiles_$(date +%Y%m%d_%H%M).json"
echo "Backup complete!"

# scripts/load-test-data.sh
#!/bin/bash
dfx canister call auth initializeOwner
dfx canister call courses createCourse '(record { ... })'
echo "Test data loaded!"

# Make scripts executable
chmod +x scripts/*.sh
```

### Performance Scripts

```bash
# scripts/performance-check.sh
#!/bin/bash
echo "Checking canister performance..."
for canister in auth profile courses quiz quests forum icrc7; do
    echo "=== $canister ==="
    dfx canister status $canister
    echo ""
done

# scripts/cycle-monitor.sh
#!/bin/bash
echo "Monitoring cycles usage..."
while true; do
    date
    dfx canister status --all | grep -A 2 -B 2 "Balance"
    sleep 300  # Check every 5 minutes
done
```

## 🚀 Quick Reference

### Most Used Commands

```bash
# Development workflow
dfx start --clean --background
dfx deploy
cd src/know_fi_frontend && yarn dev

# After making changes
dfx deploy courses              # Backend changes
yarn build && dfx deploy know_fi_frontend  # Frontend changes

# Debugging
dfx canister logs courses
dfx canister status --all
dfx canister call courses getCourses

# Testing
yarn test                       # Frontend tests
dfx canister call auth initializeOwner  # Backend test

# Deployment
dfx deploy --network ic         # Mainnet
dfx deploy --network staging    # Staging
```

### Environment Variables

```bash
# Common environment variables
export DFX_NETWORK=local
export NODE_ENV=development
export REACT_APP_IC_HOST=http://localhost:4943

# Network-specific
export DFX_NETWORK=ic          # For mainnet
export DFX_NETWORK=staging     # For staging
```

## 📚 Additional Resources

- [DFX Command Reference](https://internetcomputer.org/docs/current/references/cli-reference/)
- [Motoko Documentation](https://internetcomputer.org/docs/current/motoko/main/getting-started/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Yarn Documentation](https://yarnpkg.com/getting-started)

---

💡 **Pro Tip**: Create aliases for frequently used commands:

```bash
# Add to your ~/.bashrc or ~/.zshrc
alias dfxs="dfx start --clean --background"
alias dfxd="dfx deploy"
alias dfxl="dfx canister logs"
alias dfxst="dfx canister status --all"

# Reload shell configuration
source ~/.bashrc
```

🎯 **Quick Start**: `dfx start --clean --background && dfx deploy && cd src/know_fi_frontend && yarn dev`
