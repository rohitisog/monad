# Roll Dice Game - Solidity & React (ethers.js) 🎲

## Project Overview
The **Roll Dice Game** is a blockchain-based luck game where players roll a dice (0-36, ⭐, 👻) up to **5 times per day** to earn points. Players can progress through different **milestone tiers** (Bronze, Silver, Gold, OG) based on their accumulated points. The game is built using:

- **Solidity**: Smart contract logic for dice rolls, point calculation, milestone tracking, and daily resets.
- **React (ethers.js)**: Frontend for **wallet connection, dice rolling, real-time stats**, and **contract interactions**.
- **MetaMask & Ethereum**: Users sign transactions using MetaMask.

## Game Rules & Mechanics

1️⃣ **Each player can roll the dice up to 5 times per day**. Rolls reset at **UTC 00:00**.
2️⃣ The dice generates a number from **0 to 36** or a **special icon**:  
   - **0** → Resets points to **zero** & eliminates the player for that day.  
   - **⭐ (Star)** → **Doubles** the previous points.  
   - **👻 (Ghost)** → **Halves** the previous points.  
   - **1-36** → Adds the rolled number to the player’s total score.  
3️⃣ Players earn **milestones** based on their score:
   - **Bronze** (100 points) - Max **100,000** passes  
   - **Silver** (500 points) - Max **20,000** passes  
   - **Gold** (1,000 points) - Max **2,000** passes  
   - **OG** (2,000 points) - Max **333** passes  
4️⃣ Once a milestone limit is reached, **no more players can claim that tier**.

## Technical Features

✅ **Solidity Smart Contract**
- Stores player data (points, rolls, elimination status)
- Implements fair dice roll logic using `keccak256` hashing
- Tracks milestone achievements & limits claims
- Automatically resets daily rolls for players at UTC 00:00

✅ **React Frontend (ethers.js, No Wagmi)**
- **MetaMask Wallet Connection**
- **Real-time Player Stats (Points, Rolls Left, Milestones)**
- **Interact with the Smart Contract using ethers.js**
- **Dice Roll Button (Disabled if eliminated or out of rolls)**

✅ **Blockchain Security & Fairness**
- **On-chain RNG (Random Number Generation)** for fair rolls
- **Immutable smart contract logic** ensures no manipulation

## How to Clone and Run the Project

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/rohitisog/monad.git
cd monad
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Run the Development Server
```sh
npm run dev
```

### 4️⃣ Connect MetaMask & Switch to Monad Testnet
Ensure that you are connected to **Monad Testnet (Chain ID: 10143)**.
- RPC: `https://testnet-rpc.monad.xyz`
- Currency: `MON`

If not, the app will **prompt you to switch networks** automatically.

## How to Play?

1️⃣ **Connect your MetaMask wallet** on the React frontend.

2️⃣ **Click "Roll Dice"** (up to 5 times daily).

3️⃣ **Watch your points update in real-time** based on the dice roll result.

4️⃣ **If you hit a milestone**, your progress is recorded on-chain.

5️⃣ **Check back the next day** (after **UTC 00:00**) to roll again!

## Future Enhancements (Next Steps)

🚀 **Leaderboard** → Track top players & biggest milestones.  
🎁 **NFT Rewards** → Earn NFTs for achieving OG status.  
🎨 **Animated Dice Rolls** → Make rolling more interactive.  
📈 **Stats Dashboard** → Show global player rankings & activity.  

## Final Thoughts 💡
This project is a **fun, skill-based blockchain game** that combines **luck, strategy, and on-chain progression**. Built using **Solidity, React, and ethers.js**, it showcases **real-world smart contract interactions** while offering an engaging user experience. 🚀

🎲 **Ready to roll the dice?** Connect your wallet & test your luck! 🔥

