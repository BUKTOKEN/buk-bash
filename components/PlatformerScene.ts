import Phaser from "phaser";

export default class PlatformerScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  enemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
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
    this.load.atlas('enemy', 'assets/enemy.png', 'assets/enemyAttack.json');
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

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.enemy, platforms);
    this.physics.add.collider(this.player, this.enemy);
    this.physics.add.overlap(this.player, this.enemy, this.handleCollision, undefined, this);

    // Make enemy walk forward
    this.enemy.setVelocityX(-50); // Walk towards the player at a slow speed
  }

  maybeAttack(): void {
    // Randomly decide whether to attack
    if (Phaser.Math.Between(0, 1) === 1 && !this.gameover) {
      this.enemy?.play('attack');
      this.enemy?.on('animationcomplete', () => {
        this.enemy?.play('enemyStand'); // Reset to frame2 after attack
      }, this);
    }
  }

  update(time: number): void {
    if (!this.player || !this.cursors) return;

    // Game over
    if (this.playerHealth <= 0 && !this.gameover) {
      this.gameover = true;
      this.player.play("bukKo");
      this.player.setVelocityX(0);
      this.enemy?.play('enemyStand');
      this.enemy?.setVelocityX(0); // Stop the enemy

      const gameOverText = this.add.text(400, 300, "GAME OVER!", {
        fontSize: "32px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: {
          x: 20,
          y: 10,
        },
      });
      gameOverText.setOrigin(0.5);
      gameOverText.setInteractive();

      gameOverText.on("pointerup", () => {
        this.scene.restart();
      });

      return; // Prevent further update logic
    }

    if (this.gameover) return; // Prevent player movement when game is over

    if (this.enemyHealth <= 0) {
      this.scene.start("ending", {
        playerHealth: this.playerHealth,
        enemyHealth: this.enemyHealth,
        recordTime: time.toFixed(),
        playerWallet: this.playerWallet,
        userAddress: this.userAddress
      });
    }

    // Check if the player and enemy exist before accessing their frames
    if (this.player?.anims?.currentFrame) {
      const playerFrame = this.player.anims.currentFrame.frame.name;
      if (this.frameSizes[playerFrame]) {
        this.player.setSize(this.frameSizes[playerFrame].width, this.frameSizes[playerFrame].height);
      }
    }

    // if (this.enemy?.anims?.currentFrame) {
    //   const enemyFrame = this.enemy.anims.currentFrame.frame.name;
    //   if (this.enemyFrameSizes[enemyFrame]) {
    //     this.enemy.setSize(this.enemyFrameSizes[enemyFrame].width, this.enemyFrameSizes[enemyFrame].height);
    //   }
    // }

    // Controls
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityX(0);
      this.player.anims.play("bukPunch", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("stand", true);
    }
  }

  handleCollision(
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    enemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    console.log('handleCollision triggered');
    if (this.gameover) return; // Prevent player movement when game is over
    if (!this.playerHealthText || !this.enemyHealthText) return;

    let isEnemyAttacking = false;
    const isPlayerPunching = player.anims.currentAnim.key === 'bukPunch';
    if (enemy.anims && enemy.anims.currentAnim) {
      isEnemyAttacking = enemy.anims.currentAnim.key === 'attack';
    }

    // Check if player is punching
    if (!this.enemyHitCooldown && isPlayerPunching) {
      this.enemyHealth -= 10;
      this.enemyHealthText.setText("Ninja: " + this.enemyHealth + "%");
      // Apply knockback to the enemy
      enemy.setVelocityX(160); // Knockback enemy to the right
      this.enemyHitCooldown = true; // Set cooldown flag
      this.time.addEvent({ delay: 500, callback: () => { this.enemyHitCooldown = false; }, callbackScope: this }); // Reset flag after 500ms
    }

    // Check if enemy is attacking
    if (!this.playerHitCooldown && isEnemyAttacking) {
      this.playerHealth -= 10;
      this.playerHealthText.setText("BUK: " + this.playerHealth + "%");

      // Determine knockback direction based on player and enemy positions
      this.player?.anims.play("bukPunched", true);
      const knockbackDirection = player.x < enemy.x ? -160 : 160; // Knockback player in the opposite direction of the enemy
      player.setVelocityX(knockbackDirection);

      this.playerHitCooldown = true; // Set cooldown flag
      this.player?.setVelocityX(0); // Stop player movement when hit

      // Reset player state after bukPunched animation completes
      this.player?.once('animationcomplete', () => {
        this.player?.anims.play('stand', true); // Reset to stand animation
      });

      this.time.addEvent({ delay: 500, callback: () => { this.playerHitCooldown = false; }, callbackScope: this }); // Reset flag after 500ms
    }
  }
}