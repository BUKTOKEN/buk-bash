import Phaser from "phaser";
import { isMobile } from "./utils"; // Import the utility function

export default class PlatformerScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  enemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  touchControls: { left: Phaser.GameObjects.Zone, right: Phaser.GameObjects.Zone, punch: Phaser.GameObjects.Zone } | undefined;
  playerHealth = 100;
  enemyHealth = 100;
  playerHealthText: Phaser.GameObjects.Text | undefined;
  enemyHealthText: Phaser.GameObjects.Text | undefined;
  playerWallet: any = "";
  userAddress: string = "";
  gameover: boolean = false;
  playerHitCooldown = false; // Flag for player hit cooldown
  enemyHitCooldown = false; // Flag for enemy hit cooldown

  frameSizes: any;
  enemyFrameSizes: any;

  constructor() {
    super({ key: "platformer" });
  }

  init(data: any) {
    this.playerWallet = data.playerWallet;
    this.userAddress = data.userAddress;
  }

  preload() {
    this.load.image("bg", "assets/bukring.jpg");
    this.load.atlas('buk', 'assets/buk.png', 'assets/buk.json');
    this.load.atlas('enemy', 'assets/Enemy.png', 'assets/enemyAttack.json');
  }

  create() {
    // Background
    this.add.image(400, 280, "bg");

    // Platform
    const platforms = this.physics.add.staticGroup();

    // Player
    this.player = this.physics.add.sprite(100, 450, "buk", 'frame1');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Enemy
    this.enemy = this.physics.add.sprite(800, 450, 'enemy', 'frame1');
    this.enemy.setBounce(0.2);
    this.enemy.setCollideWorldBounds(true);
    this.enemy.setScale(3); // Scale as needed
    this.enemy.flipX = true; // Face right
    this.enemy.setOrigin(0.5, 1); // Set the origin point to the bottom center

    // Animations
    this.anims.create({
      key: 'attack',
      frames: [
        { key: 'enemy', frame: 'frame1' },
        { key: 'enemy', frame: 'frame2' },
        { key: 'enemy', frame: 'frame3' },
        { key: 'enemy', frame: 'frame4' }
      ],
      frameRate: 10,
      repeat: 0 // Do not repeat
    });

    this.anims.create({
      key: 'enemyStand',
      frames: [
        { key: 'enemy', frame: 'frame2' }
      ],
      frameRate: 10,
      repeat: 0 // Do not repeat
    });

    this.anims.create({
      key: 'bukPunch',
      frames: [
        { key: 'buk', frame: 'frame4' },
        { key: 'buk', frame: 'frame5' },
        { key: 'buk', frame: 'frame6' }
      ],
      frameRate: 10,
      repeat: 0 // Do not repeat
    });

    this.anims.create({
      key: 'bukPunched',
      frames: [
        { key: 'buk', frame: 'frame1' },
        { key: 'buk', frame: 'frame10' },
        { key: 'buk', frame: 'frame1' }
      ],
      frameRate: 10,
      repeat: 0 // Do not repeat
    });

    this.anims.create({
      key: 'bukKo',
      frames: [
        { key: 'buk', frame: 'frame7' },
        { key: 'buk', frame: 'frame8' },
        { key: 'buk', frame: 'frame9' }
      ],
      frameRate: 10,
      repeat: 0 // Do not repeat
    });

    this.anims.create({
      key: 'stand',
      frames: [
        { key: 'buk', frame: 'frame1' }
      ],
      frameRate: 10,
      repeat: 0 // Do not repeat
    });

    this.anims.create({
      key: 'left',
      frames: [
        { key: 'buk', frame: 'frame11' },
        { key: 'buk', frame: 'frame12' },
        { key: 'buk', frame: 'frame13' },
        { key: 'buk', frame: 'frame14' }
      ],
      frameRate: 10,
      repeat: -1 // Repeat indefinitely
    });

    this.anims.create({
      key: 'right',
      frames: [
        { key: 'buk', frame: 'frame2' },
        { key: 'buk', frame: 'frame3' },
        { key: 'buk', frame: 'frame4' },
      ],
      frameRate: 10,
      repeat: -1 // Repeat indefinitely
    });

    // Frame sizes mapping
    this.frameSizes = {
      'frame1': { width: 180, height: 238 },
      'frame2': { width: 120, height: 238 },
      'frame3': { width: 220, height: 238 },
      'frame4': { width: 125, height: 238 },
      'frame5': { width: 210, height: 238 },
      'frame6': { width: 245, height: 238 },
      'frame7': { width: 186, height: 238 },
      'frame8': { width: 230, height: 238 },
      'frame9': { width: 225, height: 238 },
      'frame10': { width: 225, height: 238 },
      'frame11': { width: 160, height: 238 },
      'frame12': { width: 165, height: 238 },
      'frame13': { width: 165, height: 238 },
      'frame14': { width: 168, height: 238 },
    };

    this.enemyFrameSizes = {
      'frame1': { width: 150, height: 225 },
      'frame2': { width: 225, height: 225 },
      'frame3': { width: 315, height: 225 },
      'frame4': { width: 270, height: 225 },
    };
    // Periodically check to trigger attack
    this.time.addEvent({
      delay: 2000, // Check every 2 seconds
      callback: this.maybeAttack,
      callbackScope: this,
      loop: true
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    // Texts
    this.playerHealthText = this.add.text(16, 16, "BUK: 100%", {
      fontSize: "32px",
      color: "#fff",
    });
    this.enemyHealthText = this.add.text(580, 16, "Ninja: 100%", {
      fontSize: "32px",
      color: "#fff",
    });

    // this.physics.add.collider(this.enemy, platforms);
    this.physics.add.collider(this.player, this.enemy);

    this.physics.add.overlap(this.player, this.enemy, (player, enemy) => {
      console.log('handleCollision triggered');
      if (this.gameover) return; // Prevent player movement when game is over
      if (!this.playerHealthText || !this.enemyHealthText) return;

      // Cast to expected types
      const playerSprite = player as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      const enemySprite = enemy as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

      let isEnemyAttacking = false;
      const isPlayerPunching = playerSprite.anims.currentAnim.key === 'bukPunch';
      if (enemySprite.anims && enemySprite.anims.currentAnim) {
        isEnemyAttacking = enemySprite.anims.currentAnim.key === 'attack';
      }

      // Check if player is punching
      if (!this.enemyHitCooldown && isPlayerPunching) {
        this.enemyHealth -= 10;
        this.enemyHealthText.setText("Ninja: " + this.enemyHealth + "%");
        this.enemyHitCooldown = true; // Activate cooldown

        // Set a timeout to reset the cooldown after 0.3 seconds (300 milliseconds)
        this.time.delayedCall(300, () => {
          this.enemyHitCooldown = false; // Reset cooldown
        });

        if (this.enemyHealth <= 0) {
          this.enemyHealth = 0;
          this.enemyHealthText.setText("Ninja: 0%");
          enemySprite.anims.play("enemyStand", true);
          this.gameover = true;
          setTimeout(() => {
            this.scene.start("ending", {
              playerWallet: this.playerWallet,
              userAddress: this.userAddress,
            });
          }, 1000); // Delay for 1 second before starting the "ending" scene
        }
      }

      // Check if enemy is attacking
      if (!this.playerHitCooldown && isEnemyAttacking) {
        this.playerHealth -= 10;
        this.playerHealthText.setText("BUK: " + this.playerHealth + "%");
        this.playerHitCooldown = true; // Activate cooldown

        // Set a timeout to reset the cooldown after 0.3 seconds (300 milliseconds)
        this.time.delayedCall(300, () => {
          this.playerHitCooldown = false; // Reset cooldown
        });

        if (this.playerHealth <= 0) {
          this.playerHealth = 0;
          this.playerHealthText.setText("BUK: 0%");
          playerSprite.anims.play("bukKo", true);
          this.gameover = true;
          setTimeout(() => {
            this.scene.start("ending", {
              playerWallet: this.playerWallet,
              userAddress: this.userAddress,
            });
          }, 1000); // Delay for 1 second before starting the "ending" scene
        }
      }
    });

          // Handle screen resize
          this.scale.on('resize', this.resize, this);
          this.resize({ width: this.scale.width, height: this.scale.height }); // Initial resize
          
    // Touch controls for mobile devices
    if (isMobile()) {
      this.touchControls = {
        left: this.add.zone(0, 0, this.cameras.main.width / 2, this.cameras.main.height).setOrigin(0).setInteractive(),
        right: this.add.zone(this.cameras.main.width / 2, 0, this.cameras.main.width / 2, this.cameras.main.height).setOrigin(0).setInteractive(),
        punch: this.add.zone(0, this.cameras.main.height - 100, this.cameras.main.width, 100).setOrigin(0).setInteractive()
      };

      this.touchControls.left.on('pointerdown', () => {
        this.cursors!.left!.isDown = true;
      });
      this.touchControls.left.on('pointerup', () => {
        this.cursors!.left!.isDown = false;
      });

      this.touchControls.right.on('pointerdown', () => {
        this.cursors!.right!.isDown = true;
      });
      this.touchControls.right.on('pointerup', () => {
        this.cursors!.right!.isDown = false;
      });

      this.touchControls.punch.on('pointerdown', () => {
        this.cursors!.down!.isDown = true;
      });
      this.touchControls.punch.on('pointerup', () => {
        this.cursors!.down!.isDown = false;
      });
    }
  }

  update() {
    if (this.gameover) return; // Prevent player movement when game is over

    if (this.cursors?.left?.isDown) {
      this.player?.setVelocityX(-160);
      this.player?.anims.play("left", true);
    } else if (this.cursors?.right?.isDown) {
      this.player?.setVelocityX(160);
      this.player?.anims.play("right", true);
    } else {
      this.player?.setVelocityX(0);
      this.player?.anims.play("stand");
    }

    if (this.cursors?.down?.isDown) {
      this.player?.anims.play("bukPunch", true);
    }
  }

  resize(gameSize: any) {
    const width = gameSize.width;
    const height = gameSize.height;

    // Adjust your game elements based on the new width and height
    if (this.touchControls) {
      this.touchControls.left.setPosition(width * 0.1, height * 0.9);
      this.touchControls.right.setPosition(width * 0.3, height * 0.9);
      this.touchControls.punch.setPosition(width * 0.8, height * 0.9);

      this.touchControls.left.setSize(width * 0.2, height * 0.1);
      this.touchControls.right.setSize(width * 0.2, height * 0.1);
      this.touchControls.punch.setSize(width * 0.2, height * 0.1);
    }
  }

  maybeAttack() {
    if (!this.enemy) return;

    if (Math.random() < 0.5) { // 50% chance to attack
      this.enemy.anims.play('attack', true);
    } else {
      this.enemy.anims.play('enemyStand', true);
    }
  }
}
