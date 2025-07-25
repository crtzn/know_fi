# KnowFi: Where Knowledge and Finance Intertwine

**KnowFi** KnowFi is learn to earn platform. KnowFi is a Web3-focused learning management system (LMS) designed to help users easily understand and navigate the world of decentralized technologies. With a focus on Web3 and the Internet Computer Protocol (ICP), KnowFi offers structured, beginner-friendly courses, interactive modules, and hands-on projects to bridge the knowledge gap in blockchain and decentralized internet.

---

## 🌟 Project Overview

**KnowFi** is a Web3-focused Learning Management System (LMS) designed for anyone interested in blockchain, ICP, and decentralized internet. Whether you’re a student, developer, or simply curious, KnowFi offers:

- **Structured, beginner-friendly courses**
- **Interactive quizzes and modules**
- **Hands-on projects**
- **Community-driven support**
- **Learn-to-earn mechanics (energy system & rewards)**

---

## 🚀 Features

- **Seamless Onboarding:** New users are guided through a category selection to personalize their learning path.
- **Gamified Learning:** Users receive 25 "energy" (Matic) upon signup, which is spent to answer quiz questions.
- **Dashboard Experience:** After onboarding, users access a dashboard with courses, analytics, and a marketplace.
- **Web3 Integration:** Built on ICP, with a focus on decentralized, transparent, and user-owned learning.
- **Modern Frontend:** Built with Next.js, styled with Tailwind CSS, and managed with Yarn.

---

## 🗺️ Project Roadmap (KnowMAP)

KnowFi is being developed in phases, with a clear vision for future growth and features. Here’s an overview of our current and upcoming milestones:

### **Phase 1: Foundation & Development**

- Begin core platform development integrated in ICP.
- Transform initial ideas into a working product.
- Establish key features and infrastructure to support learning and financial tools.

### **Phase 2: Marketplace**

- Introduce the KnowFi Marketplace—a central hub for users to buy, sell, and trade digital assets.
- Highlight its role as a key value driver within the ecosystem.

### **Phase 3: NFT Collection + Reward Staking**

- Launch a KnowFi NFT collection.
- Award NFTs for completing advanced courses or milestones. These NFTs can be traded in the marketplace.
- Enhance earning potential with staking and expanded rewards.

## More Soon!

> **Note:** Some features described above are part of our future plans and are not yet implemented. This roadmap demonstrates our commitment to continuous development and innovation.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Shadcn, Yarn
- **Backend:** Internet Computer Protocol (ICP), Motoko

---

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone <repo-url>
cd know_fi
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Start the ICP Local Replica

```bash
dfx start --background
```

### 4. Deploy Canisters

```bash
dfx deploy
```

### 5. Generate Candid Interface (if backend changes)

```bash
npm run generate
```

### 6. Start the Frontend

```bash
cd src/know_fi_frontend
yarn dev
```

---

## 🧑‍💻 How KnowFi Works

1. **User Login:**
   Users authenticate via the login page.

2. **Onboarding (Categories):**
   New users are redirected to the categories page to select their interests.

3. **Energy Allocation:**
   Upon first login, each user receives 25 "energy" (Matic).
   - **Energy** is the currency for answering quiz questions.

4. **Dashboard Entry:**
   After onboarding, users access the dashboard, which is the main entry point to the system.

5. **Learning & Earning:**
   - Users spend energy to answer quiz questions.
   - Completing quizzes and courses may unlock rewards, badges, or more energy.

6. **Marketplace & Analytics:**
   - Users can view their progress, analytics, and access a marketplace for additional resources or rewards.

---

## 📝 Project Structure

```
know_fi/
  ├── src/
  │   ├── know_fi_backend/      # Motoko backend (ICP canisters)
  │   └── know_fi_frontend/     # Next.js frontend
  ├── dfx.json                  # ICP config
  ├── package.json              # Project dependencies
  └── README.md                 # This file
```

---

## 🧩 Environment Variables

- If hosting frontend separately, set `DFX_NETWORK=ic` or configure as needed (see below).
- For local development, no extra configuration is needed.

---

## 💡 Contributing

Pull requests and suggestions are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE)

---

## 🙏 Acknowledgements

- Internet Computer Protocol (ICP)
- Motoko Language
- Next.js & React
- Hackathon organizers and community

---

**KnowFi: Where Knowledge and Finance Intertwine.**
Empowering the next generation of Web3 learners and builders.
