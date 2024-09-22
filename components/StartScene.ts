import Phaser from "phaser";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { EmbeddedWallet } from "@thirdweb-dev/wallets";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";

// Utility function to detect mobile devices
const isMobile = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

// Check if the Telegram Web App API is available
if (window.Telegram && window.Telegram.WebApp) {
  const telegram = window.Telegram.WebApp;
  
  // Handle the context provided by Telegram
  telegram.ready();
  document.body.style.backgroundColor = telegram.colorScheme === 'dark' ? '#000' : '#fff';
}

export default class StartScene extends Phaser.Scene {
  //wallet: CoinbaseWallet | undefined;
  userAddress: string | undefined;
  bg: Phaser.GameObjects.Image | undefined;

  private connectButton: Phaser.GameObjects.Text | undefined;
  private backgroundImage: Phaser.GameObjects.Image | undefined;

  constructor() {
    super({ key: "start" });
  }

  preload() {
    this.load.image("beachbg", "assets/bukbeachbg.jpg");
  }

  create() {
    const cameraWidth = this.cameras.main.width
    const cameraHeight = this.cameras.main.height

    this.bg = this.add.image(0, 0, 'beachbg')
      .setOrigin(0)
    this.bg.setFlipX(true);
    this.bg.setScale(Math.max(cameraWidth / this.bg.width, cameraHeight / this.bg.height))

    // Create a button to connect wallet
    this.connectButton = this.add.text(cameraWidth / this.bg.width, cameraHeight / this.bg.height, "START", {
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
const wallet = new EmbeddedWallet({
  chain: BaseSepoliaTestnet, //  chain to connect to
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID, // client ID
});
 
const authResult = await wallet.authenticate({
  strategy: "email"
});
 
const walletAddress = await wallet.connect({ authResult });

console.log(walletAddress);
    // if (!window.ethereum) {
    //   this.displayMessage("Please install MetaMask or other wallet");
    //   return;
    // }

    // try {
    //   this.wallet = new CoinbaseWallet({ appName: "buk-bash" });
    //   await this.wallet.connect(BaseSepoliaTestnet.chainId);
    //   const signer = await this.wallet.getSigner();
    //   this.userAddress = await signer.getAddress();
      this.startGame();
    // } catch (error) {
    //   console.error("Error connecting wallet:", error);
    //   this.displayMessage("Error connecting wallet");
    // }
  };

  startGame = async () => {
    // if (!this.wallet || !this.userAddress) {
    //   this.displayMessage("Please connect your wallet first");
    //   return;
    // }

    this.scene.start("platformer", {
      // playerWallet: this.wallet,
      // userAddress: this.userAddress,
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
