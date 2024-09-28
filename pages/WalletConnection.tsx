import { client } from "../components/thirdwebconstants"
import { inAppWallet } from "thirdweb/wallets";
import { ConnectEmbed } from "thirdweb/react";

interface WalletConnectionProps {
  onWalletConnect: (address: string) => void; // Callback to pass wallet address to Phaser
}

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "telegram",
        "email",
        "phone",
        "passkey",
      ],
    },
  }),
];

const WalletConnection: React.FC<WalletConnectionProps> = ({ onWalletConnect }) => {
  const handleConnect = (walletData: any) => {
    const { address } = walletData;
    if (address) {
      onWalletConnect(address);
    }
  };

  return (
    <ConnectEmbed
      client={client} // Make sure this `client` is passed down correctly (configured in your main file)
      wallets={wallets}
      onConnect={handleConnect} // Handles the connect event and retrieves the wallet address
    />
  );
};

export default WalletConnection;
