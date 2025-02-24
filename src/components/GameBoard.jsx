import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GameBoard = ({ account, contract }) => {
  const [points, setPoints] = useState(0);
  const [rollsLeft, setRollsLeft] = useState(5);
  const [milestone, setMilestone] = useState("None");
  const [isEliminated, setIsEliminated] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [resultEffect, setResultEffect] = useState(null);

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

  const rollDice = async () => {
    if (!contract || rolling) return;

    setRolling(true); // Start rolling animation
    setResultEffect(null); // Reset previous effect

    setTimeout(async () => {
      try {
        const tx = await contract.rollDice();
        await tx.wait(); // Wait for the transaction to be confirmed

        await fetchPlayerData(); // Ensure updated data is fetched
        triggerResultEffect();
      } catch (error) {
        console.error("Error rolling dice:", error);
      }
      setRolling(false); // Stop rolling animation
    }, 5000); // Roll animation duration (5 seconds)
  };

  const triggerResultEffect = () => {
    const effects = ["⭐", "💨", "🎉", "🔥"];
    setResultEffect(effects[Math.floor(Math.random() * effects.length)]);
    setTimeout(() => setResultEffect(null), 2000); // Hide effect after 2s
  };

  useEffect(() => {
    if (contract) fetchPlayerData();
  }, [contract, account]);

  return (
    <div className="mt-6 text-center">
      <div className="bg-gradient-to-l from-indigo-500 to-blue-50 text-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-2">Game Stats</h2>
        <p className="text-lg font-semibold">Points: {points}</p>
        <p className="text-lg">Rolls Left: {rollsLeft}</p>
        <p className="text-lg font-semibold text-purple-700">Milestone: {milestone}</p>

        {/* Rolling Dice Animation */}
        <motion.div
          animate={rolling ? { rotate: 360 } : { rotate: 0 }}
          transition={{ repeat: rolling ? Infinity : 0, duration: 0.5, ease: "linear" }}
          className="text-7xl mt-4"
        >
          🎲
        </motion.div>

        {/* Pop-up Effect for Result */}
        {resultEffect && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-10 right-10 text-4xl"
          >
            {resultEffect}
          </motion.div>
        )}

        {isEliminated ? (
          <p className="text-red-500 font-bold mt-2">You are eliminated for today. Try again tomorrow!</p>
        ) : (
          <button
            className="mt-4 bg-blue-500 px-6 py-2 rounded-lg text-white font-semibold hover:bg-blue-600 transition-all"
            onClick={rollDice}
            disabled={rollsLeft <= 0 || rolling}
          >
            {rolling ? "Rolling..." : "Roll Dice 🎲"}
          </button>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
