import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./contract";

const App = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [rollsLeft, setRollsLeft] = useState(5);
  const [milestone, setMilestone] = useState("None");
  const [isEliminated, setIsEliminated] = useState(false);

  // Connect to wallet and set contract instance
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        setAccount(accounts[0]);
        setContract(contractInstance);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Fetch player data from contract
  const fetchPlayerData = async () => {
    if (!contract || !account) return;
    try {
      const data = await contract.getPlayerData(account);
      setPoints(Number(data[0]));
      setRollsLeft(5 - Number(data[1]));
      setIsEliminated(data[2]);

      const milestoneData = await contract.getMilestone(account);
      setMilestone(milestoneData);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  // Roll Dice Function
  const rollDice = async () => {
    if (!contract) return;
    try {
      const tx = await contract.rollDice();
      await tx.wait();
      fetchPlayerData();
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  };

  useEffect(() => {
    if (contract) fetchPlayerData();
  }, [contract, account]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Roll Dice Fun Game 🎲</h1>
      {account ? (
        <>
          <p className="mt-2 text-lg">Points: {points}</p>
          <p>Rolls Left: {rollsLeft}</p>
          <p>Milestone: {milestone}</p>
          {isEliminated ? (
            <p className="text-red-500">You are eliminated for today. Try again tomorrow!</p>
          ) : (
            <button
              className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
              onClick={rollDice}
              disabled={rollsLeft <= 0}
            >
              Roll Dice 🎲
            </button>
          )}
        </>
      ) : (
        <button onClick={connectWallet} className="bg-green-500 px-6 py-2 rounded-lg mt-4">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default App;
