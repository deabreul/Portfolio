window.onload = function() {
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    // backgroundColor: '#87CEEB',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 280 },
        debug: true
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
    this.load.image('sign', 'https://static.vecteezy.com/system/resources/previews/031/426/665/non_2x/pastel-brown-notepaper-journal-sticker-with-transparent-background-png.png');
    this.load.image('paper', 'https://lh4.googleusercontent.com/proxy/4xh7BjoM3cSL-zrK84NK75ff5fUCiHl_TzOEN2syGLFOl8OUhrc6gjLAB-ZtjwQgiVpsJ3dCtVFg6EvVJct9oeYv0mikekqpdvnNAQ');
    this.load.image('frame', '../assets/placeholder.jpg'); // Image unique pour "image" (à créer)
    this.load.image('play', '../assets/placeholder.jpg'); // Image unique pour "youtube" (à créer)
    this.load.spritesheet('player', '../assets/player_spritesheet3.png', { frameWidth: 64, frameHeight: 64 });
    this.load.json('portfolio', '../assets/portfolio.json');

    // Fonds parallax
    this.load.image('background', '../assets/background/1.png');
    this.load.image('second', '../assets/background/2.png');
    this.load.image('third', '../assets/background/3.png');
    this.load.image('fourth', '../assets/background/4.png');
    this.load.image('fifth', '../assets/background/5.png');
    this.load.image('foreground', '../assets/background/6.png');

  }

  function create() {
    this.physics.world.setBounds(0, 0, 4000, 1080);
    this.cameras.main.setBounds(0, 0, 4000, 1080);

    // Fonds parallax
    const gameHeight = 1080; // Hauteur du monde
    background = this.add.tileSprite(2000, gameHeight / 2, 4000, gameHeight, 'background').setOrigin(0.5, 0.5).setDepth(-6);
    second = this.add.tileSprite(2000, gameHeight / 2, 4000, gameHeight, 'second').setOrigin(0.5, 0.5).setDepth(-5);
    third = this.add.tileSprite(2000, gameHeight / 2, 4000, gameHeight, 'third').setOrigin(0.5, 0.5).setDepth(-4);
    fourth = this.add.tileSprite(2000, gameHeight / 2, 4000, gameHeight, 'fourth').setOrigin(0.5, 0.5).setDepth(-3);
    fifth = this.add.tileSprite(2000, gameHeight / 2, 4000, gameHeight, 'fifth').setOrigin(0.5, 0.5).setDepth(-2);
    foreground = this.add.tileSprite(2000, gameHeight / 2, 4000, gameHeight, 'foreground').setOrigin(0.5, 0.5).setDepth(-1);

    // Plateformes
    platforms = this.physics.add.staticGroup();
    let ground = this.add.rectangle(2000, 1080, 4000, 40, 0x654321); // Sol au bas du monde
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    let platform1 = this.add.rectangle(200, 900, 150, 20, 0x654321);
    this.physics.add.existing(platform1, true);
    platforms.add(platform1);

    let platform2 = this.add.rectangle(600, 700, 150, 20, 0x654321);
    this.physics.add.existing(platform2, true);
    platforms.add(platform2);

    let platform3 = this.add.rectangle(1200, 500, 150, 20, 0x654321);
    this.physics.add.existing(platform3, true);
    platforms.add(platform3);

    // Joueur
    player = this.physics.add.sprite(200, 1000, 'player');
    player.body.setCollideWorldBounds(true);
    player.body.setBounce(0.1);
    this.physics.add.collider(player, platforms);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // Animations
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 1 }),
      frameRate: 10,
      repeat: -1
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

    // Panneaux avec positions depuis le JSON
    portfolioData = this.cache.json.get('portfolio');
    if (portfolioData) {
      panels = this.physics.add.staticGroup();
      portfolioData.forEach((item) => {
        let [x, y] = item.position; // Récupère x et y depuis le JSON
        let panel = this.add.sprite(x, y, item.sprite).setScale(0.2);
        this.physics.add.existing(panel, true);
        panels.add(panel);
        if (item.type === 'pdf') {
          this.add.sprite(x, y - 10, 'paper').setScale(0.05);
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
          let item = portfolioData.find(i => i.sprite === panel.texture.key);
          if (item) {
            showPortfolioModal(item); // Passe l'item correspondant
          }
        }
      }, this);
    }

    background.tilePositionX = 0; // Très lent
    second.tilePositionX = this.cameras.main.scrollX * 0.05;
    third.tilePositionX = this.cameras.main.scrollX * 0.1;
    fourth.tilePositionX = this.cameras.main.scrollX * 0.2;
    fifth.tilePositionX = this.cameras.main.scrollX * 0.3;
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