window.onload = function() {
  // Mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    const mobileMessage = document.createElement('div');
    mobileMessage.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #57160d;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 4vw;
      padding: 5vw;
      box-sizing: border-box;
      overflow: hidden;
    `;
    mobileMessage.innerHTML = `
      <div>
        <img src="../assets/Sprite.gif" alt="Sprite animé">
        <h1>Désolé !</h1>
        <p>Ce portfolio interactif est conçu pour être joué sur un ordinateur avec un clavier.<br>
        Il n’est pas compatible avec les téléphones ou tablettes pour le moment.<br>
        Merci de le consulter depuis un PC !<br>
        En attendant tu peux jeter un oeil à mon <a href="https://louanne-deabreu.fr">site vitrine</a></p>
      </div>
    `;
    document.body.appendChild(mobileMessage);
    return; // Stop tout
  }

  // Si pas mobile on continue
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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
  let isJumping = false;
  let tooltip;

  // Chargement des assets ---------------------------------------------------------------------------------------------
  function preload() {
    // Important
    this.load.spritesheet('player', '../assets/player_spritesheet.png', { frameWidth: 64, frameHeight: 64 });
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

    // Textures

    this.load.image('wood_left', '../assets/textures/wood_left.png');
    this.load.image('wood_middle', '../assets/textures/wood_middle.png');
    this.load.image('wood_right', '../assets/textures/wood_right.png');
    this.load.image('ground', '../assets/textures/ground.png');

  }

  // Créations de tout -------------------------------------------------------------------------------------------------
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

    // Plateformes -----------------------------------------------------------------------------------------------------
    platforms = this.physics.add.staticGroup();

    // Sol
    let ground = this.add.tileSprite(1500, 1080, 3000, 48,'ground'); // Sol au bas du monde
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    // Plateforme de jeu en bois
    createWoodPlatform.call(this, 400, 900, 200, 20);
    createWoodPlatform.call(this, 60, 760, 200, 20);
    createWoodPlatform.call(this, 500, 600, 200, 20);
    createWoodPlatform.call(this, 200, 460, 150, 20);
    createWoodPlatform.call(this, 550, 320, 80, 20);
    createWoodPlatform.call(this, 880, 320, 80, 20);
    createWoodPlatform.call(this, 1210, 320, 80, 20);
    createWoodPlatform.call(this, 200, 160, 200, 20);
    createWoodPlatform.call(this, 1540, 320, 80, 20);
    createWoodPlatform.call(this, 1800, 480, 100, 20);
    createWoodPlatform.call(this, 1780, 160, 80, 20);
    createWoodPlatform.call(this, 2050, 120, 200, 20);
    createWoodPlatform.call(this, 2390, 650, 150, 20);
    createWoodPlatform.call(this, 1715 + 100, 800 + 10, 200, 20);
    createWoodPlatform.call(this, 2910 + 16, 115, 200, 20);
    createWoodPlatform.call(this, 2828 + 16, 905 - 10, 32, 20);
    createWoodPlatform.call(this, 2700 + 16, 768 - 10, 32, 20);
    createWoodPlatform.call(this, 2828 + 16, 640 - 10, 32, 20);
    createWoodPlatform.call(this, 2700 + 16, 512 - 10, 32, 20);
    createWoodPlatform.call(this, 2828 + 16, 384 - 10, 32, 20);
    createWoodPlatform.call(this, 2700 + 16, 256 - 10, 32, 20);

    // Plateforme caché dans la maison pour les hitbox
    let platform13 = this.add.rectangle(1368, 963, 111, 1, 0x0).setOrigin(0, 0);
    this.physics.add.existing(platform13, true);
    platforms.add(platform13);

    let platform14 = this.add.rectangle(1135, 748, 230, 1, 0x00000000).setOrigin(0, 0);
    this.physics.add.existing(platform14, true);
    platforms.add(platform14);

    let platform15 = this.add.rectangle(1370, 700, 75, 1, 0x654321).setOrigin(0, 0);
    this.physics.add.existing(platform15, true);
    platforms.add(platform15);


    // Joueur ----------------------------------------------------------------------------------------------------------
    player = this.physics.add.sprite(120, 1000, 'player');
    player.body.setCollideWorldBounds(true);
    player.body.setBounce(0);
    this.physics.add.collider(player, platforms);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // Animations
    this.anims.create({
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

    // Deco ------------------------------------------------------------------------------------------------------------
    this.add.sprite(1000, 1059, 'house').setOrigin(0, 1).setScale(1).setDepth(-1);

    // Animations
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

    // Afficher les coordonnées ----------------------------------------------------------------------------------------
    this.input.on('pointerdown', (pointer) => {
      const worldX = pointer.worldX; // Coordonnée x dans le monde
      const worldY = pointer.worldY; // Coordonnée y dans le monde
      console.log(`Clic à : x = ${worldX}, y = ${worldY}`);
    });

    // Créer les panneaux avec le json ---------------------------------------------------------------------------------
    portfolioData = this.cache.json.get('portfolio');
    if (portfolioData) {
      panels = this.physics.add.staticGroup();
      portfolioData.forEach((item) => {
        let [x, y] = item.position;
        let panel = this.add.sprite(x, y, item.sprite).setOrigin(0, 1).setDepth(-1);
        this.physics.add.existing(panel, true);
        panels.add(panel);

        // Animation suivant le sprite
        if (item.sprite === 'sign') {
          panel.anims.play('sign_anim', true);
        } else if (item.sprite === 'fish') {
          panel.anims.play('fish_anim', true);
        }

      });
    } else {
      console.error("Erreur : portfolio.json n'a pas été chargé correctement.");
    }

    // Contrôles -------------------------------------------------------------------------------------------------------
    keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      interact: Phaser.Input.Keyboard.KeyCodes.F
    });



    tooltip = createTooltip();
    createPortfolioModal();
    createIntroModal();
    createControlsDisplay();
  }

  function update() {

    // Déplacement -----------------------------------------------------------------------------------------------------

    // Fixe
    player.body.setVelocityX(0);

    // Gauche Droite
    if (keys.left.isDown) {
      player.body.setVelocityX(-160);
    } else if (keys.right.isDown) {
      player.body.setVelocityX(160);
    }

    // Saut
    if (Phaser.Input.Keyboard.JustDown(keys.jump) && player.body.touching.down) {
      // Début du saut
      isJumping = true;
      jumpVelocity = -200; // Saut court
      player.body.setVelocityY(jumpVelocity);
    }

    if (keys.jump.isDown && isJumping && player.body.velocity.y <= 0) {
      // Touche maintenu pour saut long
      if (jumpVelocity > -285) {
        jumpVelocity -= 5;
        player.body.setVelocityY(jumpVelocity);
      }
    }

    if (Phaser.Input.Keyboard.JustUp(keys.jump)) {
      // Relâchement de la touche
      isJumping = false;
    }

    // Tourner le sprite
    if (player.body.velocity.x < 0) {
      player.flipX = true;
    } else if (player.body.velocity.x > 0) {
      player.flipX = false;
    }

    // Choix de l'animation
    if (!player.body.touching.down) {
      player.anims.play('jump', true);
    } else if (player.body.velocity.x !== 0) {
      player.anims.play('walk', true);
    } else {
      player.anims.play('idle', true);
    }

    // Interaction avec les éléments du monde --------------------------------------------------------------------------
    if (Phaser.Input.Keyboard.JustDown(keys.interact)) {
      panels.children.each(function(panel) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), panel.getBounds())) {
          let item = portfolioData.find(i =>
              i.position[0] === panel.x && i.position[1] === panel.y
          );
          if (item) {
            showPortfolioModal(item);
          }
        }
      }, this);
    }

    // Affichage du tooltip à l'approche -------------------------------------------------------------------------------
    let tooltipShown = false;
    panels.children.each(function(panel) {
      const playerBounds = player.getBounds();
      const panelBounds = panel.getBounds();
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, panelBounds)) {
        let item = portfolioData.find(i =>
            i.position[0] === panel.x && i.position[1] === panel.y
        );
        if (item && item.name) {
          // console.log(`Près de ${item.name} à x=${panel.x}, y=${panel.y}`);
          // console.log(`Taille panneau : width=${panel.width}, height=${panel.height}`);
          const tooltipX = panel.x + panel.width / 2 - 30;
          const tooltipY = panel.y - panel.height - 30;
          const screenX = tooltipX - this.cameras.main.scrollX;
          const screenY = tooltipY - this.cameras.main.scrollY;
          // console.log(`Position écran : x=${screenX}, y=${screenY}`);
          tooltip.style.left = `${screenX}px`;
          tooltip.style.top = `${screenY}px`;
          tooltip.textContent = item.name;
          tooltip.style.display = 'block';
          // console.log(`Tooltip affiché : ${tooltip.style.display}`);
          tooltipShown = true;
        }
      }
    }, this);

    if (!tooltipShown) {
      tooltip.style.display = 'none';
    }

    // Fond parallaxe --------------------------------------------------------------------------------------------------
    background.tilePositionX = 0;
    second.tilePositionX = this.cameras.main.scrollX * 0.05;
    third.tilePositionX = this.cameras.main.scrollX * 0.1;
    fourth.tilePositionX = this.cameras.main.scrollX * 0.15;
    fifth.tilePositionX = this.cameras.main.scrollX * 0.2;
    foreground.tilePositionX = 0;

  }

  // Fonctions pour la modale ------------------------------------------------------------------------------------------
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

  function createIntroModal() {
    const introModal = document.createElement('div');
    introModal.id = 'introModal';
    introModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

    const content = document.createElement('div');
    content.style.cssText = `
    font-family: "Poppins", Arial;
    font-weight: semibold;
    border: 5px solid #280505;
    color: white;
    position: relative;
    width: 60%;
    max-height: 80%;
    background: #57160d;
    padding: 20px;
    text-align: center;
    overflow-y: auto;
  `;

    // Modale d'accueil ------------------------------------------------------------------------------------------------

    const title = document.createElement('h2');
    title.textContent = 'Bienvenue dans mon Portfolio !';

    const text = document.createElement('p');
    text.innerHTML = `
    Salut ! Bienvenue chez moi ! J'ai éparpillé les éléments de mon portfolio un peu partout, si tu veux les voir je te laisse fouiller !<br>
    - Utilise <strong>Q</strong> et <strong>D</strong> pour te déplacer à gauche ou à droite.<br>
    - Appuie sur <strong>ESPACE</strong> pour sauter.<br>
    - Approche toi des éléments du décor et utilise <strong>F</strong> pour interagir.<br>
    - Explore pour découvrir mes projets !<br><br>
    Pour avoir plus d'info, rend toi sur mon site : <a href="https://www.louanne-deabreu.fr">https://www.louanne-deabreu.fr</a><br>
    Et si tu veux me retrouver sur GitHub c'est <a href="https://github.com/deabreul/Portfolio">par ici !</a><br>
  `;

    const startButton = document.createElement('button');
    startButton.textContent = 'Commencer';
    startButton.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
  `;

    content.appendChild(title);
    content.appendChild(text);
    content.appendChild(startButton);
    introModal.appendChild(content);
    document.body.appendChild(introModal);

    startButton.onclick = () => {
      introModal.style.display = 'none';
    };
  }

  // Boite avec les contrôles ------------------------------------------------------------------------------------------
  function createControlsDisplay() {
    const controls = document.createElement('div');
    controls.id = 'controlsDisplay';
    controls.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 1000;
  `;
    controls.innerHTML = `
    <strong>Contrôles :</strong><br>
    Q : Gauche<br>
    D : Droite<br>
    Espace : Sauter<br>
    F : Interagir
  `;
    document.body.appendChild(controls);
  }

  // Fonction pour ajouter le sprite des plateforme --------------------------------------------------------------------
  function createWoodPlatform(x, y, width, height) {
    const tileSize = 20;

    if (width <= tileSize * 2) {
      // Plateformes très courtes : juste les bords
      const leftEdge = this.add.sprite(x - tileSize / 2, y, 'wood_left').setOrigin(0.5, 0.5);
      this.physics.add.existing(leftEdge, true);
      platforms.add(leftEdge);
      const rightEdge = this.add.sprite(x + tileSize / 2, y, 'wood_right').setOrigin(0.5, 0.5);
      this.physics.add.existing(rightEdge, true);
      platforms.add(rightEdge);
      leftEdge.body.setSize(tileSize, height);
      rightEdge.body.setSize(tileSize, height);
    } else {
      // Plateformes plus longues : bords + milieu
      const leftEdge = this.add.sprite(x - width / 2 + tileSize / 2, y, 'wood_left').setOrigin(0.5, 0.5);
      this.physics.add.existing(leftEdge, true);
      platforms.add(leftEdge);

      const rightEdge = this.add.sprite(x + width / 2 - tileSize / 2, y, 'wood_right').setOrigin(0.5, 0.5);
      this.physics.add.existing(rightEdge, true);
      platforms.add(rightEdge);

      const middleWidth = width - tileSize; // Ajusté pour combler l’écart
      const middle = this.add.tileSprite(x, y, middleWidth, height, 'wood_middle').setOrigin(0.5, 0.5);
      this.physics.add.existing(middle, true);
      platforms.add(middle);

      // Ajuster les hitboxes
      leftEdge.body.setSize(tileSize, height);
      rightEdge.body.setSize(tileSize, height);
      middle.body.setSize(middleWidth, height);

      leftEdge.x = x - (width - tileSize) / 2 - tileSize / 2;
      rightEdge.x = x + (width - tileSize) / 2 + tileSize / 2;
    }
  }

  // Tooltip -----------------------------------------------------------------------------------------------------------
  function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'interactionTooltip';
    tooltip.style.cssText = `
    position: absolute;
    background: lightgreen;
    color: black;
    padding: 5px 10px;
    border-radius: 5px;
    border: 2px solid forestgreen;
    font-family: "Poppins", Arial;
    font-size: 14px;
    pointer-events: none;
    display: none;
    z-index: 1000;
  `;
    document.body.appendChild(tooltip);
    // Forcer un texte initial pour tester
    tooltip.textContent = 'Test Tooltip';
    return tooltip;
  }
};