import React, { useState, useEffect } from "react";
import Wallet from "./Wallet";
import GameBoard from "./GameBoard";
import { decodeBytes32String, ethers } from "ethers";
import { contractAddress, abi } from "../contract";

const MONAD_TESTNET_PARAMS = {
  chainId: "0x279F", // 10143 in hexadecimal
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet-explorer.monad.xyz"],
};

const Home = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [network, setNetwork] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
        setContract(contractInstance);
        checkNetwork();
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      setNetwork(chainId);

      if (chainId !== MONAD_TESTNET_PARAMS.chainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: MONAD_TESTNET_PARAMS.chainId }],
          });
          setNetwork(MONAD_TESTNET_PARAMS.chainId);
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [MONAD_TESTNET_PARAMS],
              });
            } catch (addError) {
              console.error("Failed to add Monad Testnet:", addError);
            }
          } else {
            console.error("Error switching network:", switchError);
          }
        }
      }
    }
  };

  useEffect(() => {
    checkNetwork();
    if (window.ethereum) {
      window.ethereum.on("chainChanged", checkNetwork);
      return () => {
        window.ethereum.removeListener("chainChanged", checkNetwork);
      };
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-violet-600 text-white p-4">
        <h1 className="text-3xl font-bold text-white mb-4">
          Roll Dice Fun Game 🎲
        </h1>
        <div className="w-full max-w-md shadow-lg rounded p-6 text-center border-1 bg-gradient-to-b from-violet-600 to-violet-900 border-neutral-350">
          <div className="text-7xl">🎲</div>
          {/* Show Network Error Message if NOT on Monad Testnet */}
          {network !== MONAD_TESTNET_PARAMS.chainId && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4">
              ⚠ Please switch to Monad Testnet
              <button
                className="block mt-2 bg-yellow-500 px-4 py-2 rounded-lg text-black mx-auto"
                onClick={checkNetwork}
              >
                Switch to Monad Testnet
              </button>
            </div>
          )}

          <Wallet account={account} connectWallet={connectWallet} />
          {account && network === MONAD_TESTNET_PARAMS.chainId && (
            <GameBoard account={account} contract={contract} />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

<div className="bg-indigo-600 bg-violet-300 bg-violet-600 bg-neutral-800 bg-neutral-950"></div>;
