import React from "react";

const Wallet = ({ account, connectWallet }) => {
  return (
    <div className="mt-4">
      {account ? (
        <p className="text-lg">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-violet-200 to-violet-600 text-transparent cursor-pointer bg-clip-text border border-neutral-500 px-6 py-2 rounded-lg"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default Wallet;
