import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import "../styles/globals.css";
require("dotenv").config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // De-structure the arguments we passed in out of the request body
    const { playerAddress } = JSON.parse(req.body);

    if (!process.env.PRIVATE_KEY || !process.env.PRIVATE_SECRET_KEY) {
      throw new Error("Missing PRIVATE_KEY or PRIVATE_SECRET_KEY in environment variables.");
    }

    // Initialize the Thirdweb SDK on the server-side
    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.PRIVATE_KEY as string,
      "https://rpc.sepolia.org",
      { secretKey: process.env.PRIVATE_SECRET_KEY as string }
    );

    // Load the NFT Collection via its contract address using the SDK
    const nftCollection = await sdk.getContract(
      process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!,
      "nft-collection"
    );

    // Return the signed payload to the client
    res.status(200).json({});//{ signedPayload });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ error: `Server error: ${e}` });
  }
}
