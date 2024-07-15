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

  const isMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isOpera = navigator.userAgent.indexOf('OPR/') >= 0; // Check for Opera
    return /android|iphone|ipad|ipod/i.test(userAgent) || (window.innerWidth <= 800 && window.innerHeight <= 600) || isOpera;
  };

  useEffect(() => {
    // import dynamically phaser sdk
    async function initPhaser() {
      const Phaser = await import("phaser");

      // import dynamically game scenes
      const { default: StartScene } = await import(
        "../components/StartScene"
      );

      const { default: PlatformerScene } = await import(
        "../components/PlatformerScene"
      );

      const { default: EndingScene } = await import(
        "../components/EndingScene"
      );

      // run only once
      if (game) {
        return;
      }

      // Determine if the user is on a mobile device
      const mobile = isMobile();

      // create new phaser game
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
    }

    initPhaser();

    // If on mobile, remove extra elements
    if (isMobile()) {
      document.querySelector(".header")?.remove();
      document.querySelector("p")?.remove();
      document.querySelector("a")?.remove();
    }
  }, [game]);

  return (
    <div className={styles.container}>
      <span className="header"><h1 className={styles.h1}>BUK Bash</h1></span>
      <div id="app" key="app">
        {/* the game will be rendered here */}
      </div>
      <p>Arrows to move left and right, down arrow to punch.</p>
      <a href="http://www.buk.world"> <h3>www.buk.world</h3></a>
    </div>
  );
};

export default Home;
