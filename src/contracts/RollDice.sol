// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DiceRoll {
    struct Player {
        uint256 points;
        uint256 rollsToday;
        bool isEliminated;
        uint256 lastRollTimestamp;
    }

    mapping(address => Player) public players;

    uint256 public constant BRONZE = 100;
    uint256 public constant SILVER = 500;
    uint256 public constant GOLD = 1000;
    uint256 public constant OG = 2000;

    mapping(uint256 => uint256) public milestonePasses;

    event DiceRolled(address indexed player, uint256 roll, uint256 newPoints);
    event DailyReset(address indexed player, uint256 timestamp);

    function rollDice() external {
        Player storage player = players[msg.sender];

        // Reset daily rolls if a new day has started
        if (isNewDay(player.lastRollTimestamp)) {
            resetDailyForPlayer(msg.sender);
        }

        require(player.rollsToday < 5, "Max rolls reached today");
        require(!player.isEliminated, "You are eliminated for today");

        uint256 roll = randomRoll();

        if (roll == 0) {
            player.points = 0;
            player.isEliminated = true;
        } else if (roll == 37) { // ⭐ - Double previous points
            player.points *= 2;
        } else if (roll == 38) { // 👻 - Half previous points
            player.points /= 2;
        } else {
            player.points += roll;
        }

        player.rollsToday++;
        player.lastRollTimestamp = block.timestamp;

        checkMilestones(player.points);
        emit DiceRolled(msg.sender, roll, player.points);
    }

    function resetDailyForPlayer(address playerAddress) internal {
        players[playerAddress].rollsToday = 0;
        players[playerAddress].isEliminated = false;
        emit DailyReset(playerAddress, block.timestamp);
    }

    function isNewDay(uint256 lastTimestamp) internal view returns (bool) {
        return (block.timestamp / 1 days) > (lastTimestamp / 1 days);
    }

    function checkMilestones(uint256 points) internal {
        if (points >= OG && milestonePasses[OG] < 333) {
            milestonePasses[OG]++;
        } else if (points >= GOLD && milestonePasses[GOLD] < 2000) {
            milestonePasses[GOLD]++;
        } else if (points >= SILVER && milestonePasses[SILVER] < 20000) {
            milestonePasses[SILVER]++;
        } else if (points >= BRONZE && milestonePasses[BRONZE] < 100000) {
            milestonePasses[BRONZE]++;
        }
    }

    function randomRoll() internal view returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 39;
        return randomNumber < 37 ? randomNumber : randomNumber - 2;
    }

    function getPlayerData(address player) external view returns (uint256, uint256, bool) {
        Player memory p = players[player];
        return (p.points, p.rollsToday, p.isEliminated);
    }

    function getMilestone(address player) external view returns (string memory) {
        uint256 points = players[player].points;
        if (points >= OG) return "OG";
        if (points >= GOLD) return "Gold";
        if (points >= SILVER) return "Silver";
        if (points >= BRONZE) return "Bronze";
        return "None";
    }
}
