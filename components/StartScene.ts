import Phaser from "phaser";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import { CoinbaseWallet } from "@thirdweb-dev/wallets";

// Utility function to detect mobile devices
const isMobile = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

export default class StartScene extends Phaser.Scene {
  wallet: CoinbaseWallet | undefined;
  userAddress: string | undefined;

  private connectButton: Phaser.GameObjects.Text | undefined;
  private backgroundImage: Phaser.GameObjects.Image | undefined;

  constructor() {
    super({ key: "start" });
  }

  preload() {
    this.load.image("beachbg", "assets/bukbeachbg.jpg");
  }

  create() {
    // Add background image and flip if mobile
    this.backgroundImage = this.add.image(400, 280, "beachbg");
    if (isMobile()) {
      this.backgroundImage.setFlipX(true);
    }

    // Create a button to connect wallet
    this.connectButton = this.add.text(400, 300, "Connect Wallet", {
      fontSize: "32px",
      fontFamily: "Arial",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: {
        x: 20,
        y: 10,
      },
    });
    this.connectButton.setOrigin(0.5);
    this.connectButton.setInteractive();

    this.connectButton.on("pointerup", () => {
      this.connectWallet();
    });

    // Adjust scaling and resizing for mobile
    this.scale.on('resize', this.resize, this);
    this.resize({ width: this.scale.width, height: this.scale.height }); // Initial resize

    if (isMobile()) {
      this.scale.scaleMode = Phaser.Scale.FIT;
      this.scale.refresh();
    }
  }

  resize(gameSize: any) {
    const width = gameSize.width;
    const height = gameSize.height;

    // Reposition and resize the background image
    if (this.backgroundImage) {
      this.backgroundImage.setPosition(width / 2, height / 2).setDisplaySize(width, height);
    }

    // Reposition the connect button
    if (this.connectButton) {
      this.connectButton.setPosition(width / 2, height / 2);
    }
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
    this.add.text(this.scale.width / 2, this.scale.height * 0.8, message, {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#000",
    }).setOrigin(0.5);
  }
}
