import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";

export const appMetadata = {
  name: "BUK Bash",
  url: "https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app",
};

export const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";
export const CHAIN = baseSepolia;
export const CONTRACT_ADDR = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS || "";

export const client = createThirdwebClient({ clientId: CLIENT_ID });
export const contract = getContract({
  client,
  address: CONTRACT_ADDR,
  chain: CHAIN,
});

export const accountAbstraction = {
  chain: CHAIN,
  gasless: true,
};

export const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "passkey"],
    },
  }),
];