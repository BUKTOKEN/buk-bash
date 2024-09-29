import Phaser from "phaser";

export default class EndingScene extends Phaser.Scene {
  walletAddress!: string | null;
  constructor() {
    super({ key: "ending" });
  }

  init(data: any) {
    this.walletAddress = data.playerWallet;
  }

  create() {
    // Create a button to mint NFT
    const mintButton = this.add.text(400, 200, "Mint NFT", {
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
      this.mintNFT();
    });
  }

  mintNFT = async () => {
    if (!this.walletAddress) {
      console.error("Wallet not connected");
      return;
    }

    try {
      // Call the thirdweb SDK to mint NFT
      console.log(`Minting NFT for address: ${this.walletAddress}`);

        //   this.wallet = new CoinbaseWallet({ appName: "buk-bash" });
  //   await this.wallet.connect(BaseSepoliaTestnet.chainId);
  //   const signer = await this.wallet.getSigner();
  //   this.userAddress = await signer.getAddress();
  //    // Fetch the NFT collection contract
  //    const sdk = ThirdwebSDK.fromSigner(signer, BaseSepoliaTestnet, { clientId: process.env.NEXT_PUBLIC_CLIENT_ID });
  //    const nftCollection = await sdk.getContract(
  //      process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS || "",
  //      "nft-collection"
  //    );

  //    // Mint NFT with signature
  //    const nft = await nftCollection.mint({
  //      name: "Level Completion NFT",
  //      description: "Completed level 1",
  //      image: "ipfs://QmP31GBJov6Us7iHyGv4JWcPiiLmJbJWsUXAd7pfMMbYTe", 
  //      properties: {
  //        level: 1
  //      }
  //    })
  //    if (nft) {
  //      this.nftTitle?.setText("NFT minted successfully!");
  //    } else {
  //      this.nftTitle?.setText("Failed to mint NFT");
  //    }
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };
}