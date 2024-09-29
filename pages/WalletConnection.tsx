import { client } from "../components/thirdwebconstants";
import { inAppWallet } from "thirdweb/wallets";
import { ConnectEmbed, useActiveAccount } from "thirdweb/react"; // Make sure to import useActiveAccount
import React from "react";

interface WalletConnectionProps {
  onWalletConnect: (address: string) => void; // Callback to pass wallet address to Phaser
}

const wallets = [
  inAppWallet({
    auth: {
      options: ["telegram", "email", "phone", "passkey"],
    },
  }),
];

const WalletConnection: React.FC<WalletConnectionProps> = ({ onWalletConnect }) => {
  const activeAccount = useActiveAccount(); // This hook will give you the currently active account
  const address = activeAccount?.address; // Get the wallet address

  // Effect to trigger onWalletConnect when address changes
  React.useEffect(() => {
    if (address) {
      console.log("Wallet connected:", address); // Log the connected address
      onWalletConnect(address); // Pass the address to the parent component or Phaser
    }
  }, [address, onWalletConnect]); // Only run when address or onWalletConnect changes

  return (
    <ConnectEmbed
      client={client} // Make sure this `client` is passed down correctly
      wallets={wallets}
      onConnect={(walletData) => {
        console.log("Wallet connected data:", walletData); // Log any additional wallet data
      }}
    />
  );
};

export default WalletConnection;
