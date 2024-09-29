import type { NextPage } from "next";
import { Game as GameType } from "phaser";
import { useEffect, useRef, useState } from "react";
import styles from "./styles/Home.module.css";
import WalletConnection from "./WalletConnection";

const Home: NextPage = () => {
  const [game, setGame] = useState<GameType | null>(null);
  const [portraitMode, setPortraitMode] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const gameRef = useRef<GameType | null>(null);

  // Handle wallet connection and pass the address to the scene
  const handleWalletConnect = (address: string) => {
    setWalletAddress(address); // Update wallet state
    console.log("Wallet connected in index.tsx:", address);

    // Pass the address to Phaser EndingScene if the game is initialized
    if (gameRef.current) {
      const startScene = gameRef.current.scene.getScene("start") as any;
      if (startScene && typeof startScene.setWalletAddress === "function") {
        console.log("Passing address to EndingScene:", address); // Log to confirm passing
        startScene.setWalletAddress(address); // Pass address to the scene
      } else {
        console.log("EndingScene not ready or setWalletAddress is not a function");
      }
    }
  };

  const isMobile = () => {
    if (typeof window === "undefined") {
      return false;
    }

    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobileDevice = /android|iphone|ipad|ipod|windows phone|blackberry|opera mini|iemobile|mobile/i.test(userAgent);
    const isSmallScreen = window.innerWidth <= 800 && window.innerHeight <= 600;

    return isMobileDevice || isSmallScreen;
  };

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import("phaser");

      const { default: StartScene } = await import("../components/StartScene");
      const { default: PlatformerScene } = await import("../components/PlatformerScene");
      const { default: EndingScene } = await import("../components/EndingScene");

      if (game) {
        return;
      }

      const mobile = isMobile() != null;

      const createPhaserGame = () => {
        const phaserGame = new Phaser.Game({
          type: Phaser.AUTO,
          parent: "app",
          width: 800,
          height: 550,
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 200, x: 10 },
              debug: false,
            },
          },
          dom: {
            createContainer: true,
          },
          scale: mobile
            ? {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.NO_CENTER,
                width: "100%",
                height: "100%",
              }
            : undefined,
          scene: [StartScene, PlatformerScene, EndingScene],
        });

        gameRef.current = phaserGame; // Store the game instance in ref

        // Ensure the game is properly scaled when mobile
        if (mobile) {
          window.addEventListener("resize", () => {
            phaserGame.scale.refresh();
          });
        }

        setGame(phaserGame);

        // Pass wallet address to the startScene if it's already connected
        if (walletAddress) {
          const startScene = phaserGame.scene.getScene("start") as any;
          if (startScene && typeof startScene.setWalletAddress === "function") {
            startScene.setWalletAddress(walletAddress);
          }
        }
      };

      const handleResize = () => {
        if (window.innerWidth > window.innerHeight) {
          setPortraitMode(false);
          document.getElementById("portrait-warning")?.remove();
          if (!game) {
            createPhaserGame();
          }
        } else {
          setPortraitMode(true);
          document.getElementById("app")?.remove();
        }
      };

      handleResize();
      window.onresize = handleResize;
    }

    initPhaser();

    // If on mobile, remove extra elements
    if (isMobile()) {
      document.querySelector("dev")?.remove();
      document.querySelector(".header")?.remove();
      document.querySelector("p")?.remove();
      document.querySelector("a")?.remove();
      document.querySelector("span")?.remove();
    }
  }, [game, walletAddress]);

  // Conditional rendering to show content only if the wallet is connected
  if (!walletAddress) {
    return (
      <div className={styles.container}>
        <span className="header"><h1 className={styles.h1}>BUK Bash</h1></span>
        
        {/* Wallet connection component */}
        <WalletConnection onWalletConnect={handleWalletConnect} />

        {/* Optionally, add a message indicating that the user should connect their wallet */}
        <p>Please connect your wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <span className="header"><h1 className={styles.h1}>BUK Bash</h1></span>
      
      {/* Render game content only if wallet is connected */}
      <div id="app" key="app" className={styles.appMobile}>
        {/* The game will be rendered here */}
      </div>

      <div id="portrait-warning">
        <img src="/assets/rotate.png" width="100%" alt="Rotate your device" />
      </div>

      <p>Arrows to move left and right, down arrow to punch.</p>
      <a href="http://www.buk.world"> <h3>www.buk.world</h3></a>
    </div>
  );
};

export default Home;
