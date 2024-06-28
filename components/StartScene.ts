import Phaser from "phaser";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import { CoinbaseWallet } from "@thirdweb-dev/wallets";

export default class StartScene extends Phaser.Scene {
  wallet: CoinbaseWallet | undefined;
  userAddress: string | undefined;

  constructor() {
    super({ key: "start" });
  }

  preload() {
    this.load.image("beachbg", "assets/bukbeachbg.jpg");
  }

  create() {
    this.add.image(400, 280, "beachbg");

    // Create a button to connect wallet
    const connectButton = this.add.text(400, 300, "Connect Wallet", {
      fontSize: "32px",
      fontFamily: "Arial",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: {
        x: 20,
        y: 10,
      },
    });
    connectButton.setOrigin(0.5);
    connectButton.setInteractive();

    connectButton.on("pointerup", () => {
      this.connectWallet();
    });
  }

  connectWallet = async () => {
    if (!window.ethereum) {
      this.displayMessage("Please install MetaMask or other wallet");
      return;
    }

    try {
      this.wallet = new CoinbaseWallet({ appName: "buk-bash" });
      await this.wallet.connect(BaseSepoliaTestnet.chainId);
      const signer = await this.wallet.getSigner();
      this.userAddress = await signer.getAddress();
      this.startGame();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      this.displayMessage("Error connecting wallet");
    }
  };

  startGame = async () => {
    if (!this.wallet || !this.userAddress) {
      this.displayMessage("Please connect your wallet first");
      return;
    }

    this.scene.start("platformer", {
      playerWallet: this.wallet,
      userAddress: this.userAddress,
    });
  };

  displayMessage(message: string) {
    this.add.text(400, 450, message, {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#000",
    }).setOrigin(0.5);
  }
}