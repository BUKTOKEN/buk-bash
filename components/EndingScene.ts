import Phaser from "phaser";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import { CoinbaseWallet } from "@thirdweb-dev/wallets";

export default class EndingScene extends Phaser.Scene {
  wallet: CoinbaseWallet | undefined;
  userAddress: string | undefined;
  nftTitle: Phaser.GameObjects.Text | undefined;

  constructor() {
    super({ key: "ending" });
  }

  init(data: any) {
    this.wallet = data.playerWallet;
    this.userAddress = data.userAddress;
  }

  preload() {
    this.load.image("bg", "assets/bukbeachbg.jpg");
  }

  create() {
    this.add.image(400, 280, "bg");

    // Create a button to mint NFT
    const mintButton = this.add.text(400, 300, "Mint NFT", {
      fontSize: "32px",
      fontFamily: "Arial",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: {
        x: 20,
        y: 10,
      },
    });
    mintButton.setOrigin(0.5);
    mintButton.setInteractive();

    mintButton.on("pointerup", () => {
      this.mintWithSignature();
    });

    // Text to display minting result
    this.nftTitle = this.add.text(400, 400, "", {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#000",
    });
    this.nftTitle.setOrigin(0.5);
  }

  mintWithSignature = async () => {
    if (!this.wallet || !this.userAddress) {
      this.nftTitle?.setText("Wallet not connected");
      return;
    }

    try {
      const signer = await this.wallet.getSigner();

      // Make request to server for signed payload
      // const signedPayloadReq = await fetch(`/api/server`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     playerAddress: this.userAddress,
      //   }),
      // });

      // const json = await signedPayloadReq.json();

      // if (!signedPayloadReq.ok) {
      //   this.nftTitle?.setText(json.error || "Failed to fetch signed payload");
      //   return;
      // }
     
      // const signedPayload = json.signedPayload;

      // Fetch the NFT collection contract
      const sdk = ThirdwebSDK.fromSigner(signer, BaseSepoliaTestnet, { clientId: process.env.NEXT_PUBLIC_CLIENT_ID });
      const nftCollection = await sdk.getContract(
        process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS || "",
        "nft-collection"
      );

      // Mint NFT with signature
      const nft = await nftCollection.mint({
        name: "Level Completion NFT",
        description: "Completed level 1",
        image: "ipfs://QmP31GBJov6Us7iHyGv4JWcPiiLmJbJWsUXAd7pfMMbYTe", 
        properties: {
          level: 1
        }
      })
      if (nft) {
        this.nftTitle?.setText("NFT minted successfully!");
      } else {
        this.nftTitle?.setText("Failed to mint NFT");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      this.nftTitle?.setText("Error minting NFT");
    }
  };
}
