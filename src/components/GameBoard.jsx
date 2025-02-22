import React, { useState, useEffect } from "react";

const GameBoard = ({ account, contract }) => {
  const [points, setPoints] = useState(0);
  const [rollsLeft, setRollsLeft] = useState(5);
  const [milestone, setMilestone] = useState("None");
  const [isEliminated, setIsEliminated] = useState(false);

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
    <div className="mt-6 text-center">
      <p className="text-lg">Points: {points}</p>
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
    </div>
  );
};

export default GameBoard;
