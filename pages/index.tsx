import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useNFTs,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { Game as GameType } from "phaser";
import { useEffect, useState } from "react";
import styles from "./styles/Home.module.css";

const Home: NextPage = () => {
  const [game, setGame] = useState<GameType>();
  const [portraitMode, setPortraitMode] = useState(false);

  const isMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isOpera = navigator.userAgent.indexOf('OPR/') >= 0; // Check for Opera
    return /android|iphone|ipad|ipod/i.test(userAgent) || (window.innerWidth <= 800 && window.innerHeight <= 600) || isOpera;
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

      const mobile = isMobile();

      const createPhaserGame = () => {
        const phaserGame = new Phaser.Game({
          type: Phaser.AUTO,
          parent: "app",
          width: 800,
          height: 550,
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 200 },
              debug: false,
            },
          },
          dom: {
            createContainer: true,
          },
          scale: mobile
            ? {
              mode: Phaser.Scale.FIT,
              autoCenter: Phaser.Scale.CENTER_BOTH,
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
     //     document.getElementById("app")?.classList.remove("hidden");

          if (!game) {
            createPhaserGame();
          }
        } else {
          // Portrait mode
          setPortraitMode(true);
        //  document.getElementById("portrait-warning")?.classList.add("hidden");
          document.getElementById("app")?.remove();//.classList.add("hidden");
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
      <div id="app" key="app">
        {/* the game will be rendered here */}
      </div>
      <div id="portrait-warning" className="hidden">
        <img src="/assets/rotate.png" alt="Rotate your device" />
      </div>
      <p>Arrows to move left and right, down arrow to punch.</p>
      <a href="http://www.buk.world"> <h3>www.buk.world</h3></a>
    </div>
  );
};

export default Home;
