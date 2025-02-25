// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RollDiceGame {
    struct Player {
        uint256 points;
        uint256 rollsToday;
        bool eliminated;
    }

    mapping(address => Player) public players;
    uint256 public lastResetTime;
    
    event DiceRolled(address indexed player, uint256 result, uint256 newPoints);

    constructor() {
        lastResetTime = block.timestamp;
    }

    modifier checkDailyReset() {
        if (block.timestamp >= lastResetTime + 1 days) {
            lastResetTime = block.timestamp;
            for (address user : getAllPlayers()) {
                players[user].rollsToday = 0;
                players[user].eliminated = false;
            }
        }
        _;
    }

    function rollDice() public checkDailyReset {
        require(players[msg.sender].rollsToday < 10, "Max rolls exceeded");
        require(!players[msg.sender].eliminated, "Eliminated for today");

        uint256 roll = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 38; // 0-36 + special cases
        if (roll == 0) {
            players[msg.sender].points = 0;
            players[msg.sender].eliminated = true;
        } else if (roll == 37) {
            players[msg.sender].points *= 2; // ⭐ Star
        } else if (roll == 36) {
            players[msg.sender].points /= 2; // 👻 Ghost
        } else {
            players[msg.sender].points += roll;
        }

        players[msg.sender].rollsToday++;
        emit DiceRolled(msg.sender, roll, players[msg.sender].points);
    }

    function getPlayerData(address player) public view returns (uint256, uint256, bool) {
        return (players[player].points, players[player].rollsToday, players[player].eliminated);
    }
}
