import type { NextPage } from "next";
import { Game as GameType } from "phaser";
import { useEffect, useRef, useState } from "react";
import styles from "./styles/Home.module.css";
import WalletConnection from "./WalletConnection";

const Home: NextPage = () => {
  const [game, setGame] = useState<GameType>();
  const [portraitMode, setPortraitMode] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const gameRef = useRef<GameType | null>(null);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address); // Update wallet state

    // Pass the address to Phaser EndingScene if the game is initialized
    if (gameRef.current) {
      const endingScene = gameRef.current.scene.getScene("ending") as any;
      if (endingScene && typeof endingScene.setWalletAddress === "function") {
        endingScene.setWalletAddress(address); // Pass address to the scene
      }
    }
  };

  const isMobile = () => {
    if (typeof window === "undefined") {
      // This check ensures that the code is only run on the client side
      return false;
    }
  
    const userAgent = navigator.userAgent || navigator.vendor;
  
    // Check for mobile devices by user agent
    const isMobileDevice = /android|iphone|ipad|ipod|windows phone|blackberry|opera mini|iemobile|mobile/i.test(userAgent);
  
    // Fallback check for screen dimensions (useful for tablets or if user agent check fails)
    const isSmallScreen = window.innerWidth <= 800 && window.innerHeight <= 600;
  
    return isMobileDevice || isSmallScreen;
  };

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import("phaser");

      const { default: StartScene } = await import(
        "../components/StartScene"
      );

      const { default: PlatformerScene } = await import(
        "../components/PlatformerScene"
      );

      const { default: EndingScene } = await import(
        "../components/EndingScene"
      );

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
              gravity: { y: 200, x: 10},
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
              width: '100%',
              height: '100%',
            }
            : undefined, // No scaling for desktop
          scene: [StartScene, PlatformerScene, EndingScene],
        });

        if (mobile) {
          window.addEventListener("resize", () => {
            phaserGame.scale.refresh();
          });
        }

        setGame(phaserGame);
      };

      const handleResize = () => {
        if (window.innerWidth > window.innerHeight) {
          // Landscape mode
          setPortraitMode(false);
          document.getElementById("portrait-warning")?.remove();
          if (!game) {
            createPhaserGame();
          }
        } else {
          // Portrait mode
          setPortraitMode(true);
          document.getElementById("app")?.remove();
        }
      };

      // Initial check
      handleResize();

      // Listen to resize event
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
  }, [game]);

  return (
    <div className={styles.container}>
      <span className="header"><h1 className={styles.h1}>BUK Bash</h1></span>			
      <WalletConnection onWalletConnect={handleWalletConnect} />
      <div id="app" key="app" className={styles.appMobile}>
        {/* the game will be rendered here */}
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
