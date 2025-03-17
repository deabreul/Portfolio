window.onload = function() {
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#87CEEB',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: true // Garde ça pour voir les hitbox
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

  function preload() {
    this.load.image('paper', 'https://static.vecteezy.com/system/resources/previews/031/426/665/non_2x/pastel-brown-notepaper-journal-sticker-with-transparent-background-png.png');
    this.load.image('sign', 'https://lh4.googleusercontent.com/proxy/4xh7BjoM3cSL-zrK84NK75ff5fUCiHl_TzOEN2syGLFOl8OUhrc6gjLAB-ZtjwQgiVpsJ3dCtVFg6EvVJct9oeYv0mikekqpdvnNAQ');
    this.load.spritesheet('player', '../assets/player_spritesheet2.png', { frameWidth: 64, frameHeight: 64 })
  }

  function create() {
    // Définir les limites du monde et de la caméra
    this.physics.world.setBounds(0, 0, 2000, 1200);
    this.cameras.main.setBounds(0, 0, 2000, 1200);

    // Plateformes -----------------------------------------------------------------------------------------------------
    platforms = this.physics.add.staticGroup();
    let ground = this.add.rectangle(1000, 1180, 2000, 40, 0x654321);
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

    // Joueur ----------------------------------------------------------------------------------------------------------
    player = this.physics.add.sprite(100, 1100, 'player');
    player.body.setCollideWorldBounds(true);
    player.body.setBounce(0.2);
    this.physics.add.collider(player, platforms);

    // Caméra
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // Animations ------------------------------------------------------------------------------------------------------
    this.anims.create({
      key: 'idle', // Animation de repos
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 1 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'walk', // Animation de marche
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', { start: 3, end: 3 }),
      frameRate: 10,
      repeat: 0
    });

    // Anim par défaut
    player.anims.play('idle', true);

    // Panneaux --------------------------------------------------------------------------------------------------------
    panels = this.physics.add.staticGroup();
    let sign1 = this.add.sprite(400, 1115, 'sign').setScale(0.2);
    let paper1 = this.add.sprite(400, 1105, 'paper').setScale(0.05);
    this.physics.add.existing(sign1, true);
    panels.add(sign1);

    let sign2 = this.add.sprite(1200, 460, 'sign').setScale(0.5);
    let paper2 = this.add.sprite(1200, 450, 'paper').setScale(0.3);
    this.physics.add.existing(sign2, true);
    panels.add(sign2);

    // Contrôles -------------------------------------------------------------------------------------------------------
    keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      interact: Phaser.Input.Keyboard.KeyCodes.A
    });

    // Ouverture des fichiers ------------------------------------------------------------------------------------------
    createPDFModal();
  }


  // Gestion des touches -----------------------------------------------------------------------------------------------
  function update() {
    player.body.setVelocityX(0); // Réinitialise par défaut

    if (keys.left.isDown) {
      player.body.setVelocityX(-160);
    } else if (keys.right.isDown) {
      player.body.setVelocityX(160);
    }

    // Saut (actif seulement au sol)
    if (Phaser.Input.Keyboard.JustDown(keys.jump) && player.body.touching.down) {
      player.body.setVelocityY(-330);
    }

    // Gestion du retournement (flipX) selon la direction, même en l’air
    if (player.body.velocity.x < 0) {
      player.flipX = true; // Tourne à gauche
    } else if (player.body.velocity.x > 0) {
      player.flipX = false; // Tourne à droite
    }

    // Gestion des animations (après le mouvement)
    if (!player.body.touching.down) {
      // En l’air : saut
      player.anims.play('jump', true);
    } else if (player.body.velocity.x !== 0) {
      // Au sol et en mouvement : marche
      player.anims.play('walk', true);
    } else {
      // Au sol et immobile : repos
      player.anims.play('idle', true);
    }

    if (Phaser.Input.Keyboard.JustDown(keys.interact)) {
      panels.children.each(function(panel) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), panel.getBounds())) {
          showPDFModal();
        }
      }, this);
    }
  }

  // Fonctions PDF -----------------------------------------------------------------------------------------------------
  function createPDFModal() {
    const modal = document.createElement('div');
    modal.id = 'pdfModal';
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

    const iframe = document.createElement('iframe');
    iframe.id = 'pdfIframe';
    iframe.style.cssText = `
          width: 100%;
          height: 100%;
          border: none;
        `;

    content.appendChild(closeButton);
    content.appendChild(iframe);
    modal.appendChild(content);
    document.body.appendChild(modal);

    closeButton.onclick = hidePDFModal;
    modal.onclick = (e) => {
      if (e.target === modal) hidePDFModal();
    };
    document.addEventListener('keydown', (e) => {
      if (e.key === 'a' && modal.style.display === 'flex') hidePDFModal();
    });
  }

  function showPDFModal() {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfIframe');
    iframe.src = '../assets/DeAbreu_Louanne_CV.pdf'; // Vérifie ce chemin
    modal.style.display = 'flex';
  }

  function hidePDFModal() {
    const modal = document.getElementById('pdfModal');
    modal.style.display = 'none';
    const iframe = document.getElementById('pdfIframe');
    iframe.src = '';
  }
};