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
        scene: [StartScene, PlatformerScene, EndingScene],
      });

      setGame(phaserGame);
    }
    initPhaser();
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
