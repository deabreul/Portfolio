window.onload = function() {
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    // backgroundColor: '#87CEEB',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };


  const game = new Phaser.Game(config);

  window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });

  let player;
  let platforms;
  let panels;
  let keys;
  let portfolioData;

  function preload() {
    // Important
    this.load.spritesheet('player', '../assets/player_spritesheet3.png', { frameWidth: 64, frameHeight: 64 });
    this.load.json('portfolio', '../assets/portfolio.json');

    // Visuel interactif
    this.load.spritesheet('sign', '../assets/panneau.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('fish', '../assets/fish.png', { frameWidth: 64, frameHeight: 64 });

    //Visuel
    this.load.image('house', '../assets/house.png');

    // Fonds parallax
    this.load.image('background', '../assets/background/1.png');
    this.load.image('second', '../assets/background/2.png');
    this.load.image('third', '../assets/background/3.png');
    this.load.image('fourth', '../assets/background/4.png');
    this.load.image('fifth', '../assets/background/5.png');
    this.load.image('foreground', '../assets/background/6.png');

  }

  function create() {
    this.physics.world.setBounds(0, 0, 3000, 1080);
    this.cameras.main.setBounds(0, 0, 3000, 1080);

    // Fonds parallax
    const gameHeight = 1080; // Hauteur du monde
    background = this.add.tileSprite(1500, gameHeight / 2, 3000, gameHeight, 'background').setOrigin(0.5, 0.5).setDepth(-7);
    second = this.add.tileSprite(1500, gameHeight / 2, 3000, gameHeight, 'second').setOrigin(0.5, 0.5).setDepth(-6);
    third = this.add.tileSprite(1500, gameHeight / 2, 3000, gameHeight, 'third').setOrigin(0.5, 0.5).setDepth(-5);
    fourth = this.add.tileSprite(1500, gameHeight / 2, 3000, gameHeight, 'fourth').setOrigin(0.5, 0.5).setDepth(-4);
    fifth = this.add.tileSprite(1500, gameHeight / 2, 3000, gameHeight, 'fifth').setOrigin(0.5, 0.5).setDepth(-3);
    foreground = this.add.tileSprite(1500, gameHeight / 2, 3000, gameHeight, 'foreground').setOrigin(0.5, 0.5).setDepth(-2);

    // Plateformes
    platforms = this.physics.add.staticGroup();
    let ground = this.add.rectangle(1500, 1080, 3000, 48, 0x654321); // Sol au bas du monde
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    let platform1 = this.add.rectangle(400, 900, 200, 20, 0x654321);
    this.physics.add.existing(platform1, true);
    platforms.add(platform1);

    let platform2 = this.add.rectangle(60, 760, 200, 20, 0x654321);
    this.physics.add.existing(platform2, true);
    platforms.add(platform2);

    let platform3 = this.add.rectangle(500, 600, 200, 20, 0x654321);
    this.physics.add.existing(platform3, true);
    platforms.add(platform3);

    let platform4 = this.add.rectangle(200, 460, 150, 20, 0x654321);
    this.physics.add.existing(platform4, true);
    platforms.add(platform4);

    let platform5 = this.add.rectangle(550, 320, 70, 20, 0x654321);
    this.physics.add.existing(platform5, true);
    platforms.add(platform5);

    let platform6 = this.add.rectangle(880, 320, 70, 20, 0x654321);
    this.physics.add.existing(platform6, true);
    platforms.add(platform6);

    let platform7 = this.add.rectangle(1210, 320, 70, 20, 0x654321);
    this.physics.add.existing(platform7, true);
    platforms.add(platform7);

    let platform8 = this.add.rectangle(200, 160, 200, 20, 0x654321);
    this.physics.add.existing(platform8, true);
    platforms.add(platform8);

    let platform9 = this.add.rectangle(1540, 320, 70, 20, 0x654321);
    this.physics.add.existing(platform9, true);
    platforms.add(platform9);

    let platform10 = this.add.rectangle(1800, 480, 100, 20, 0x654321);
    this.physics.add.existing(platform10, true);
    platforms.add(platform10);

    let platform11 = this.add.rectangle(1780, 160, 70, 20, 0x654321);
    this.physics.add.existing(platform11, true);
    platforms.add(platform11);

    let platform12 = this.add.rectangle(2050, 120, 200, 20, 0x654321);
    this.physics.add.existing(platform12, true);
    platforms.add(platform12);

    let platform13 = this.add.rectangle(1368, 963, 111, 1, 0x0).setOrigin(0, 0);
    this.physics.add.existing(platform13, true);
    platforms.add(platform13);

    let platform14 = this.add.rectangle(1135, 748, 230, 1, 0x00000000).setOrigin(0, 0);
    this.physics.add.existing(platform14, true);
    platforms.add(platform14);

    let platform15 = this.add.rectangle(1370, 700, 75, 1, 0x654321).setOrigin(0, 0);
    this.physics.add.existing(platform15, true);
    platforms.add(platform15);

    let platform16 = this.add.rectangle(1715, 800, 200, 20, 0x654321).setOrigin(0, 0);
    this.physics.add.existing(platform16, true);
    platforms.add(platform16);

    let platform17 = this.add.rectangle(2860, 1056, 500, 950, 0xC0C0C0).setOrigin(0, 1);
    this.physics.add.existing(platform17, true);
    platforms.add(platform17);

    let platform18 = this.add.rectangle(2828, 896, 32, 20, 0xC0C0C0).setOrigin(0, 1);
    this.physics.add.existing(platform18, true);
    platforms.add(platform18);

    let platform19 = this.add.rectangle(2390, 650, 150, 20, 0x654321);
    this.physics.add.existing(platform19, true);
    platforms.add(platform19);

    let platform23 = this.add.rectangle(2700, 768, 32, 20, 0xC0C0C0).setOrigin(0, 1);
    this.physics.add.existing(platform23, true);
    platforms.add(platform23);

    let platform20 = this.add.rectangle(2828, 640, 32, 20, 0xC0C0C0).setOrigin(0, 1);
    this.physics.add.existing(platform20, true);
    platforms.add(platform20);

    let platform21 = this.add.rectangle(2700, 512, 32, 20, 0xC0C0C0).setOrigin(0, 1);
    this.physics.add.existing(platform21, true);
    platforms.add(platform21);

    let platform22 = this.add.rectangle(2828, 384, 32, 20, 0xC0C0C0).setOrigin(0, 1);
    this.physics.add.existing(platform22, true);
    platforms.add(platform22);

    let platform24 = this.add.rectangle(2700, 256, 32, 20, 0xC0C0C0).setOrigin(0, 1);
    this.physics.add.existing(platform24, true);
    platforms.add(platform24);


    // Joueur
    player = this.physics.add.sprite(200, 1000, 'player');
    player.body.setCollideWorldBounds(true);
    player.body.setBounce(0);
    this.physics.add.collider(player, platforms);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // Deco

    this.add.sprite(1000, 1059, 'house').setOrigin(0, 1).setScale(1).setDepth(-1);

    // Animations
    this.anims.create({
      key: 'idle',
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 1 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 4 }),
      frameRate: 10,
      repeat: 0
    });

    player.anims.play('idle', true);

    // Decoration animation
    this.anims.create({
      key: 'sign_anim',
      frames: this.anims.generateFrameNumbers('sign', { start: 0, end: 1 }), // Frames 0 à 1
      frameRate: 2,
      repeat: -1
    });

    this.anims.create({
      key: 'fish_anim',
      frames: this.anims.generateFrameNumbers('fish', { start: 0, end: 1 }), // Frames 0 à 1
      frameRate: 2, //
      repeat: -1 //
    });

    // Détection des clics pour afficher les coordonnées
    this.input.on('pointerdown', (pointer) => {
      const worldX = pointer.worldX; // Coordonnée x dans le monde
      const worldY = pointer.worldY; // Coordonnée y dans le monde
      console.log(`Clic à : x = ${worldX}, y = ${worldY}`);
    });

    // Panneaux avec positions depuis le JSON
    portfolioData = this.cache.json.get('portfolio');
    if (portfolioData) {
      panels = this.physics.add.staticGroup();
      portfolioData.forEach((item) => {
        let [x, y] = item.position; // Récupère x et y depuis le JSON
        let panel = this.add.sprite(x, y, item.sprite).setOrigin(0, 1).setDepth(-1);
        this.physics.add.existing(panel, true);
        panels.add(panel);

        // Jouer l'animation en fonction du sprite
        if (item.sprite === 'sign') {
          panel.anims.play('sign_anim', true);
        } else if (item.sprite === 'fish') {
          panel.anims.play('fish_anim', true);
        }

      });
    } else {
      console.error("Erreur : portfolio.json n'a pas été chargé correctement.");
    }

    // Contrôles
    keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      interact: Phaser.Input.Keyboard.KeyCodes.A
    });

    createPortfolioModal();
  }

  function update() {
    player.body.setVelocityX(0);

    if (keys.left.isDown) {
      player.body.setVelocityX(-160);
    } else if (keys.right.isDown) {
      player.body.setVelocityX(160);
    }

    if (Phaser.Input.Keyboard.JustDown(keys.jump) && player.body.touching.down) {
      player.body.setVelocityY(-330);
    }

    if (player.body.velocity.x < 0) {
      player.flipX = true;
    } else if (player.body.velocity.x > 0) {
      player.flipX = false;
    }

    if (!player.body.touching.down) {
      player.anims.play('jump', true);
    } else if (player.body.velocity.x !== 0) {
      player.anims.play('walk', true);
    } else {
      player.anims.play('idle', true);
    }

    if (Phaser.Input.Keyboard.JustDown(keys.interact)) {
      panels.children.each(function(panel) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), panel.getBounds())) {
          let item = portfolioData.find(i =>
              i.position[0] === panel.x && i.position[1] === panel.y
          );
          if (item) {
            showPortfolioModal(item); // Passe l'item correspondant
          }
        }
      }, this);
    }

    background.tilePositionX = 0; // Très lent
    second.tilePositionX = this.cameras.main.scrollX * 0.05;
    third.tilePositionX = this.cameras.main.scrollX * 0.1;
    fourth.tilePositionX = this.cameras.main.scrollX * 0.15;
    fifth.tilePositionX = this.cameras.main.scrollX * 0.2;
    foreground.tilePositionX = 0;

  }

  // Fonctions pour la modale
  function createPortfolioModal() {
    const modal = document.createElement('div');
    modal.id = 'portfolioModal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      position: relative;
      width: 80%;
      height: 80%;
      background: white;
      padding: 20px;
    `;

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '✖';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 24px;
      color: black;
      cursor: pointer;
    `;

    const display = document.createElement('iframe');
    display.id = 'portfolioDisplay';
    display.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `;

    content.appendChild(closeButton);
    content.appendChild(display);
    modal.appendChild(content);
    document.body.appendChild(modal);

    closeButton.onclick = hidePortfolioModal;
    modal.onclick = (e) => {
      if (e.target === modal) hidePortfolioModal();
    };
    document.addEventListener('keydown', (e) => {
      if (e.key === 'a' && modal.style.display === 'flex') hidePortfolioModal();
    });
  }

  function showPortfolioModal(item) {
    const modal = document.getElementById('portfolioModal');
    const display = document.getElementById('portfolioDisplay');

    if (item.type === 'pdf') {
      display.src = item.path;
    } else if (item.type === 'image') {
      display.remove();
      const img = document.createElement('img');
      img.id = 'portfolioDisplay';
      img.src = item.path;
      img.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';
      modal.querySelector('div').appendChild(img);
    } else if (item.type === 'youtube') {
      display.src = item.path;
    }

    modal.style.display = 'flex';
  }

  function hidePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    const display = document.getElementById('portfolioDisplay');
    modal.style.display = 'none';
    if (display.tagName === 'IMG') {
      display.remove();
      const iframe = document.createElement('iframe');
      iframe.id = 'portfolioDisplay';
      iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
      modal.querySelector('div').appendChild(iframe);
    } else {
      display.src = '';
    }
  }
};