# `know_fi`

Welcome to your new `know_fi` project and to the Internet Computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

---

# KnowFi: Where Knowledge and Finance Intertwine

**KnowFi** is a learn-to-earn platform. KnowFi is a Web3-focused learning management system (LMS) designed to help users easily understand and navigate the world of decentralized technologies. With a focus on Web3 and the Internet Computer Protocol (ICP), KnowFi offers structured, beginner-friendly courses, interactive modules, and hands-on projects to bridge the knowledge gap in blockchain and decentralized internet.

## 🌟 Project Overview

**KnowFi** is a Web3-focused Learning Management System (LMS) designed for anyone interested in blockchain, ICP, and decentralized internet. Whether you’re a student, developer, or simply curious, KnowFi offers:

- **Structured, beginner-friendly courses**
- **Interactive quizzes and modules**
- **Hands-on projects**
- **Community-driven support**
- **Learn-to-earn mechanics (energy system & rewards)**

## 🚀 Features

- **Seamless Onboarding:** New users are guided through a category selection to personalize their learning path.
- **Gamified Learning:** Users receive 25 "energy" (Matic) upon signup, which is spent to answer quiz questions.
- **Dashboard Experience:** After onboarding, users access a dashboard with courses, analytics, and a marketplace.
- **Web3 Integration:** Built on ICP, with a focus on decentralized, transparent, and user-owned learning.
- **Modern Frontend:** Built with Next.js, styled with Tailwind CSS, and managed with Yarn.

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

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Shadcn, Yarn
- **Backend:** Internet Computer Protocol (ICP), Motoko

## 🏁 Getting Started (Quick Reference)

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with `know_fi`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd know_fi/
dfx help
dfx canister --help
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

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor

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
