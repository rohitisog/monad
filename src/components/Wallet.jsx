import React from "react";

const Wallet = ({ account, connectWallet }) => {
  return (
    <div className="mt-4">
      {account ? (
        <p className="text-lg">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      ) : (
        <button onClick={connectWallet} className="bg-green-500 px-6 py-2 rounded-lg">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default Wallet;
