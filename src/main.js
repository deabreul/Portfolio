window.onload = function() {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
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

  let player;
  let platforms;
  let panels;
  let keys;

  function preload() {
    // Chargement des assets pour le panneau Minecraft
    this.load.image('sign', 'https://i.imgur.com/8kZ5J3X.png'); // Image d'un panneau Minecraft
    this.load.image('paper', 'https://i.imgur.com/5g8Z9vB.png'); // Image d'une affiche
  }

  function create() {
    platforms = this.physics.add.staticGroup();

    let ground = this.add.rectangle(400, 580, 800, 40, 0x654321);
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    let platform1 = this.add.rectangle(200, 450, 150, 20, 0x654321);
    this.physics.add.existing(platform1, true);
    platforms.add(platform1);

    let platform2 = this.add.rectangle(600, 350, 150, 20, 0x654321);
    this.physics.add.existing(platform2, true);
    platforms.add(platform2);

    player = this.add.rectangle(100, 500, 40, 40, 0xff0000);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    player.body.setBounce(0.2);

    this.physics.add.collider(player, platforms);

    // Création du panneau style Minecraft
    panels = this.physics.add.staticGroup();
    let sign = this.add.sprite(400, 540, 'sign').setScale(0.5);
    let paper = this.add.sprite(400, 530, 'paper').setScale(0.3);
    this.physics.add.existing(sign, true);
    panels.add(sign);

    keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      interact: Phaser.Input.Keyboard.KeyCodes.A
    });

    // Création de l'élément HTML pour le PDF (hors du canvas Phaser)
    createPDFModal();
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

    if (Phaser.Input.Keyboard.JustDown(keys.interact)) {
      panels.children.each(function(panel) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), panel.getBounds())) {
          showPDFModal();
        }
      }, this);
    }
  }

  // Création de la fenêtre modale pour le PDF
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

    // Bouton de fermeture (croix)
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

    // Iframe pour afficher le PDF
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

    // Événements de fermeture
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

    // Remplacez cette URL par le chemin de votre PDF
    iframe.src = '../assets/DeAbreu_Louanne_CV.pdf'; // Exemple de PDF
    modal.style.display = 'flex';
  }

  function hidePDFModal() {
    const modal = document.getElementById('pdfModal');
    modal.style.display = 'none';
    const iframe = document.getElementById('pdfIframe');
    iframe.src = ''; // Réinitialise l'iframe pour éviter de consommer des ressources
  }
};