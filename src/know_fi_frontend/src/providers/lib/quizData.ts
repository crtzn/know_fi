export const quizData = [
  // ICP Category (reused from previous artifact)
  {
    question: 'What is the primary goal of the Internet Computer (ICP)?',
    options: [
      'To create a centralized cloud computing platform',
      'To build a decentralized, scalable blockchain for running applications',
      'To replace traditional cryptocurrencies like Bitcoin',
      'To provide a peer-to-peer file-sharing network',
    ],
    correct_answer: 'To build a decentralized, scalable blockchain for running applications',
    explanation:
      'The Internet Computer, developed by DFINITY, aims to extend the functionality of the public internet by providing a decentralized blockchain platform where developers can build and deploy scalable, secure applications and smart contracts, known as canisters.',
    difficulty: 'easy',
    token_reward: 0.5,
    category: 'Internet Computer Protocol',
  },
  {
    question: 'Who founded the DFINITY Foundation, the organization behind ICP?',
    options: ['Vitalik Buterin', 'Dominic Williams', 'Satoshi Nakamoto', 'Gavin Andresen'],
    correct_answer: 'Dominic Williams',
    explanation:
      'Dominic Williams founded the DFINITY Foundation, which launched the Internet Computer in May 2021. He is a key figure in its development and vision for decentralized computing.',
    difficulty: 'easy',
    token_reward: 0.5,
    category: 'Internet Computer Protocol',
  },
  {
    question: "What is a 'canister' in the context of the Internet Computer?",
    options: [
      'A type of cryptocurrency wallet',
      "A smart contract that runs on ICP's blockchain",
      'A hardware device for securing ICP tokens',
      'A governance token for voting',
    ],
    correct_answer: "A smart contract that runs on ICP's blockchain",
    explanation:
      'Canisters are the computational units on the Internet Computer, functioning as smart contracts that can store data, execute code, and serve web content, enabling developers to build scalable applications.',
    difficulty: 'medium',
    token_reward: 1.5,
    category: 'Internet Computer Protocol',
  },
  {
    question: 'Which protocol does ICP use to achieve consensus among its nodes?',
    options: [
      'Proof of Work (PoW)',
      'Proof of Stake (PoS)',
      'Internet Computer Consensus (ICC)',
      'Delegated Proof of Stake (DPoS)',
    ],
    correct_answer: 'Internet Computer Consensus (ICC)',
    explanation:
      'ICP uses a unique consensus mechanism called Internet Computer Consensus (ICC), which combines cryptographic techniques and a threshold relay to achieve fast, secure, and scalable consensus across its decentralized network.',
    difficulty: 'medium',
    token_reward: 1.5,
    category: 'Internet Computer Protocol',
  },
  {
    question: 'What is the role of the Network Nervous System (NNS) in ICP?',
    options: [
      'It mines new ICP tokens',
      'It governs the Internet Computer through decentralized voting',
      'It secures the network against cyber attacks',
      'It compiles canister code for developers',
    ],
    correct_answer: 'It governs the Internet Computer through decentralized voting',
    explanation:
      'The Network Nervous System (NNS) is ICP’s decentralized governance system, where token holders stake ICP to vote on proposals that determine network upgrades, canister management, and other operational decisions.',
    difficulty: 'hard',
    token_reward: 3,
    category: 'Internet Computer Protocol',
  },
  {
    question: 'How does ICP handle data storage compared to traditional blockchains?',
    options: [
      'It stores all data off-chain to reduce costs',
      'It uses orthogonal persistence to store data directly in canisters',
      'It relies on centralized cloud providers for storage',
      'It limits data storage to transaction records only',
    ],
    correct_answer: 'It uses orthogonal persistence to store data directly in canisters',
    explanation:
      'ICP employs orthogonal persistence, allowing canisters to store and manage data directly on the blockchain, unlike traditional blockchains that often rely on off-chain storage or have limited data capacity.',
    difficulty: 'hard',
    token_reward: 3,
    category: 'Internet Computer Protocol',
  },
  {
    question: 'Which of the following is a key feature of ICP’s WebSpeed capability?',
    options: [
      'Serving web content directly from the blockchain',
      'Mining tokens faster than other blockchains',
      'Encrypting all user data by default',
      'Running machine learning models on-chain',
    ],
    correct_answer: 'Serving web content directly from the blockchain',
    explanation:
      'ICP’s WebSpeed feature allows canisters to serve web content (e.g., HTML, CSS, JavaScript) directly from the blockchain, enabling fully decentralized web applications without relying on centralized servers.',
    difficulty: 'Extreme',
    token_reward: 5,
    category: 'Internet Computer Protocol',
  },
  {
    question: "What is the significance of ICP’s 'reverse gas model' for developers?",
    options: [
      'Developers pay high gas fees to deploy canisters',
      'Users pay gas fees instead of developers',
      'Canisters run without any gas fees',
      'Developers prepay cycles to power canister computations',
    ],
    correct_answer: 'Developers prepay cycles to power canister computations',
    explanation:
      "ICP’s reverse gas model requires developers to prepay 'cycles' (a computational resource) to run canisters, making it free for end-users to interact with applications, unlike Ethereum’s model where users pay gas fees.",
    difficulty: 'Extreme',
    token_reward: 5,
    category: 'Internet Computer Protocol',
  },
  // Trading Category
  {
    question: "What is a 'bull market' in trading?",
    options: [
      'A market where prices are falling',
      'A market where prices are rising',
      'A market with no price movement',
      'A market exclusive to commodities',
    ],
    correct_answer: 'A market where prices are rising',
    explanation:
      'A bull market is characterized by rising asset prices, typically driven by investor optimism and increased buying activity. It’s the opposite of a bear market, where prices decline.',
    difficulty: 'easy',
    token_reward: 0.5,
    category: 'Trading',
  },
  {
    question: "What does the term 'liquidity' refer to in trading?",
    options: [
      'The total profit from a trade',
      'The ease of buying or selling an asset without affecting its price',
      'The amount of debt in a trading account',
      'The speed of executing a trade',
    ],
    correct_answer: 'The ease of buying or selling an asset without affecting its price',
    explanation:
      'Liquidity refers to how easily an asset can be bought or sold in the market without causing significant price changes. High liquidity means tight spreads and fast trade execution.',
    difficulty: 'easy',
    token_reward: 0.5,
    category: 'Trading',
  },
  {
    question: "What is a 'stop-loss order' used for in trading?",
    options: [
      'To automatically buy an asset at a set price',
      'To limit losses by selling an asset when it reaches a certain price',
      'To guarantee a profit on a trade',
      'To borrow funds for trading',
    ],
    correct_answer: 'To limit losses by selling an asset when it reaches a certain price',
    explanation:
      'A stop-loss order is a risk management tool that automatically sells an asset when its price falls to a predetermined level, helping traders limit potential losses.',
    difficulty: 'medium',
    token_reward: 1.5,
    category: 'Trading',
  },
  {
    question: "What is the purpose of a 'margin call' in trading?",
    options: [
      'To invite traders to a market event',
      'To demand additional funds when a margin account falls below a threshold',
      'To close all open trades automatically',
      'To increase the leverage on a trade',
    ],
    correct_answer: 'To demand additional funds when a margin account falls below a threshold',
    explanation:
      'A margin call occurs when a broker demands that a trader deposits additional funds or securities into their margin account to meet the minimum maintenance margin, typically due to losses in leveraged positions.',
    difficulty: 'medium',
    token_reward: 1.5,
    category: 'Trading',
  },
  {
    question: "What is 'technical analysis' in trading?",
    options: [
      'Analyzing a company’s financial statements',
      'Using historical price and volume data to predict future price movements',
      'Studying global economic trends',
      'Evaluating a trader’s psychological state',
    ],
    correct_answer: 'Using historical price and volume data to predict future price movements',
    explanation:
      'Technical analysis involves analyzing past market data, such as price and volume, using charts and indicators (e.g., moving averages, RSI) to forecast future price trends.',
    difficulty: 'hard',
    token_reward: 3,
    category: 'Trading',
  },
  {
    question: "What does 'short selling' involve in trading?",
    options: [
      'Buying an asset and holding it long-term',
      'Selling an asset you don’t own, expecting its price to fall',
      'Trading only during short market sessions',
      'Investing in low-priced stocks',
    ],
    correct_answer: 'Selling an asset you don’t own, expecting its price to fall',
    explanation:
      'Short selling involves borrowing an asset, selling it at the current price, and buying it back later at a lower price to return it, profiting from the price difference.',
    difficulty: 'hard',
    token_reward: 3,
    category: 'Trading',
  },
  {
    question: "What is a 'candlestick chart' used for in trading?",
    options: [
      'Tracking trading volume only',
      'Visualizing price movements over time with open, high, low, and close prices',
      'Calculating dividend payouts',
      'Monitoring broker fees',
    ],
    correct_answer: 'Visualizing price movements over time with open, high, low, and close prices',
    explanation:
      'A candlestick chart displays an asset’s price movements over a specific period, showing the opening, closing, high, and low prices in a visual format, often used in technical analysis.',
    difficulty: 'Extreme',
    token_reward: 5,
    category: 'Trading',
  },
  {
    question: "What is the 'Bollinger Bands' indicator used for in trading?",
    options: [
      'Measuring market volatility and identifying overbought or oversold conditions',
      'Calculating the average trading volume',
      'Predicting corporate earnings',
      'Tracking interest rate changes',
    ],
    correct_answer: 'Measuring market volatility and identifying overbought or oversold conditions',
    explanation:
      'Bollinger Bands are a technical analysis tool consisting of a moving average and two standard deviation bands, used to measure volatility and identify potential overbought or oversold market conditions.',
    difficulty: 'Extreme',
    token_reward: 5,
    category: 'Trading',
  },
  // Programming Category
  {
    question: 'What is a variable in programming?',
    options: [
      'A fixed value that cannot change',
      'A named storage location for data that can be modified',
      'A function that performs calculations',
      'A type of programming language',
    ],
    correct_answer: 'A named storage location for data that can be modified',
    explanation:
      'A variable is a named container in a program’s memory that holds data, which can be changed during execution, allowing developers to store and manipulate values.',
    difficulty: 'easy',
    token_reward: 0.5,
    category: 'Programming',
  },
  {
    question: "What does 'IDE' stand for in programming?",
    options: [
      'Integrated Data Environment',
      'Interactive Development Engine',
      'Integrated Development Environment',
      'Internal Debugging Extension',
    ],
    correct_answer: 'Integrated Development Environment',
    explanation:
      'An IDE (Integrated Development Environment) is a software suite that provides tools like a code editor, debugger, and compiler to streamline software development.',
    difficulty: 'easy',
    token_reward: 0.5,
    category: 'Programming',
  },
  {
    question: "What is the purpose of a 'for loop' in programming?",
    options: [
      'To handle user input',
      'To execute a block of code a specific number of times',
      'To define a function',
      'To connect to a database',
    ],
    correct_answer: 'To execute a block of code a specific number of times',
    explanation:
      'A for loop is a control structure used to repeat a block of code a predetermined number of times, often used for iterating over arrays or ranges.',
    difficulty: 'medium',
    token_reward: 1.5,
    category: 'Programming',
  },
  {
    question: 'What is object-oriented programming (OOP)?',
    options: [
      'A programming style focused on procedures',
      'A paradigm that organizes code into objects with properties and methods',
      'A method for optimizing database queries',
      'A technique for parallel processing',
    ],
    correct_answer: 'A paradigm that organizes code into objects with properties and methods',
    explanation:
      'OOP is a programming paradigm that uses objects, which combine data (properties) and behavior (methods), to model real-world entities and promote code reuse.',
    difficulty: 'medium',
    token_reward: 1.5,
    category: 'Programming',
  },
  {
    question: "What is a 'closure' in programming?",
    options: [
      'A function that terminates a program',
      'A function that retains access to its lexical scope even when executed outside it',
      'A method to secure API endpoints',
      'A data structure for storing key-value pairs',
    ],
    correct_answer: 'A function that retains access to its lexical scope even when executed outside it',
    explanation:
      'A closure is a function that remembers the variables in its outer scope, even after the outer function has finished executing, allowing for data encapsulation.',
    difficulty: 'hard',
    token_reward: 3,
    category: 'Programming',
  },
  {
    question: "What does 'polymorphism' mean in programming?",
    options: [
      'Writing code in multiple languages',
      'Allowing different data types to share the same interface or behavior',
      'Optimizing code for faster execution',
      'Storing data in multiple formats',
    ],
    correct_answer: 'Allowing different data types to share the same interface or behavior',
    explanation:
      'Polymorphism, a core OOP concept, allows objects of different classes to be treated as instances of a common superclass, enabling shared behaviors through methods like overriding.',
    difficulty: 'hard',
    token_reward: 3,
    category: 'Programming',
  },
  {
    question: "What is the purpose of a 'mutex' in concurrent programming?",
    options: [
      'To optimize memory usage',
      'To prevent multiple threads from accessing shared resources simultaneously',
      'To compile code faster',
      'To handle HTTP requests',
    ],
    correct_answer: 'To prevent multiple threads from accessing shared resources simultaneously',
    explanation:
      'A mutex (mutual exclusion) is a synchronization primitive used in concurrent programming to ensure that only one thread can access a shared resource at a time, preventing race conditions.',
    difficulty: 'Extreme',
    token_reward: 5,
    category: 'Programming',
  },
  {
    question: "What is 'functional programming' characterized by?",
    options: [
      'Using mutable state and side effects',
      'Emphasizing immutable data and pure functions',
      'Focusing on hardware-level operations',
      'Prioritizing object-oriented design',
    ],
    correct_answer: 'Emphasizing immutable data and pure functions',
    explanation:
      'Functional programming is a paradigm that treats computation as the evaluation of mathematical functions, emphasizing immutability, pure functions (no side effects), and higher-order functions.',
    difficulty: 'Extreme',
    token_reward: 5,
    category: 'Programming',
  },
  // Artificial Intelligence Category
  {
    question: 'What is the main goal of artificial intelligence (AI)?',
    options: [
      'To replace all human jobs',
      'To create systems that can perform tasks requiring human intelligence',
      'To design faster computer hardware',
      'To automate manual data entry',
    ],
    correct_answer: 'To create systems that can perform tasks requiring human intelligence',
    explanation:
      'AI aims to develop systems that can mimic human cognitive abilities, such as reasoning, learning, and problem-solving, to perform tasks like image recognition or natural language processing.',
    difficulty: 'easy',
    token_reward: 0.5,
    category: 'Artificial Intelligence',
  },
  {
    question: "What is a 'neural network' in AI?",
    options: [
      'A network of physical computers',
      'A computational model inspired by the human brain',
      'A database for storing AI data',
      'A programming language for AI',
    ],
    correct_answer: 'A computational model inspired by the human brain',
    explanation:
      'A neural network is a series of algorithms that mimic the human brain’s structure, using layers of interconnected nodes to process data and learn patterns for tasks like classification.',
    difficulty: 'easy',
    token_reward: 0.5,
    category: 'Artificial Intelligence',
  },
  {
    question: "What is 'supervised learning' in AI?",
    options: [
      'Training a model with labeled data to make predictions',
      'Allowing a model to learn without any data',
      'Using AI to supervise human workers',
      'Training a model to generate random outputs',
    ],
    correct_answer: 'Training a model with labeled data to make predictions',
    explanation:
      'Supervised learning involves training an AI model on a dataset with input-output pairs (labeled data) to predict outcomes, such as classifying images or predicting prices.',
    difficulty: 'medium',
    token_reward: 1.5,
    category: 'Artificial Intelligence',
  },
  {
    question: "What does 'overfitting' mean in machine learning?",
    options: [
      'A model performing poorly on all data',
      'A model learning too much from training data, failing to generalize',
      'A model with too few parameters',
      'A model that trains too quickly',
    ],
    correct_answer: 'A model learning too much from training data, failing to generalize',
    explanation:
      'Overfitting occurs when an AI model learns the training data too well, including noise, resulting in poor performance on new, unseen data due to lack of generalization.',
    difficulty: 'medium',
    token_reward: 1.5,
    category: 'Artificial Intelligence',
  },
  {
    question: "What is the purpose of a 'loss function' in AI?",
    options: [
      'To measure the accuracy of a model’s predictions',
      'To encrypt AI model outputs',
      'To store training data',
      'To optimize hardware performance',
    ],
    correct_answer: 'To measure the accuracy of a model’s predictions',
    explanation:
      'A loss function quantifies the difference between a model’s predicted outputs and the actual target values, guiding the optimization process during training to minimize errors.',
    difficulty: 'hard',
    token_reward: 3,
    category: 'Artificial Intelligence',
  },
  {
    question: "What is 'reinforcement learning' in AI?",
    options: [
      'Training a model with labeled datasets',
      'Learning through trial and error to maximize a reward',
      'Using pre-trained models for predictions',
      'Optimizing neural network layers',
    ],
    correct_answer: 'Learning through trial and error to maximize a reward',
    explanation:
      'Reinforcement learning involves an agent learning to make decisions by trying actions in an environment to maximize a cumulative reward, used in applications like game playing or robotics.',
    difficulty: 'hard',
    token_reward: 3,
    category: 'Artificial Intelligence',
  },
  {
    question: "What is the role of 'backpropagation' in neural networks?",
    options: [
      'To encrypt data during training',
      'To compute gradients for updating model weights',
      'To generate synthetic training data',
      'To reduce the size of the neural network',
    ],
    correct_answer: 'To compute gradients for updating model weights',
    explanation:
      'Backpropagation is an algorithm used in training neural networks to calculate the gradient of the loss function with respect to the model’s weights, enabling optimization via gradient descent.',
    difficulty: 'Extreme',
    token_reward: 5,
    category: 'Artificial Intelligence',
  },
  {
    question: "What is a 'transformer' model in AI?",
    options: [
      'A hardware component for AI',
      'A model architecture for processing sequential data',
      'A programming framework for AI',
      'A database for storing AI models',
    ],
    correct_answer: 'A model architecture for processing sequential data',
    explanation:
      'A transformer is a neural network architecture that uses self-attention mechanisms to process sequential data, widely used in natural language processing tasks like those in GPT and BERT models.',
    difficulty: 'Extreme',
    token_reward: 5,
    category: 'Artificial Intelligence',
  },
];
