window.onload = function() {
  // Configuration de Phaser
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
    // Ici, vous pouvez charger des assets si besoin
  }

  function create() {
    // Création d'un groupe de plateformes statiques
    platforms = this.physics.add.staticGroup();

    // Sol (plateforme principale)
    let ground = this.add.rectangle(400, 580, 800, 40, 0x654321);
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    // Autres plateformes
    let platform1 = this.add.rectangle(200, 450, 150, 20, 0x654321);
    this.physics.add.existing(platform1, true);
    platforms.add(platform1);

    let platform2 = this.add.rectangle(600, 350, 150, 20, 0x654321);
    this.physics.add.existing(platform2, true);
    platforms.add(platform2);

    // Création du joueur sous forme d'un carré rouge
    player = this.add.rectangle(100, 500, 40, 40, 0xff0000);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    player.body.setBounce(0.2);

    // Collision entre le joueur et les plateformes
    this.physics.add.collider(player, platforms);

    // Création de panneaux interactifs (carrés bleus)
    panels = this.physics.add.staticGroup();
    let panel1 = this.add.rectangle(400, 520, 30, 30, 0x0000ff);
    this.physics.add.existing(panel1, true);
    panels.add(panel1);
    // Vous pouvez ajouter d'autres panneaux de la même manière

    // Définition des touches (clavier AZERTY : Z, Q, S, D pour se déplacer, Espace pour sauter et A pour interagir)
    keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      interact: Phaser.Input.Keyboard.KeyCodes.A
    });
  }

  function update() {
    // Réinitialisation de la vélocité horizontale
    player.body.setVelocityX(0);

    // Mouvement horizontal
    if (keys.left.isDown) {
      player.body.setVelocityX(-160);
    } else if (keys.right.isDown) {
      player.body.setVelocityX(160);
    }

    // Saut (vérification que le joueur touche bien une plateforme)
    if (Phaser.Input.Keyboard.JustDown(keys.jump) && player.body.touching.down) {
      player.body.setVelocityY(-330);
    }

    // Interaction avec les panneaux
    if (Phaser.Input.Keyboard.JustDown(keys.interact)) {
      panels.children.each(function(panel) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), panel.getBounds())) {
          console.log("Interaction avec le panneau à la position", panel.x, panel.y);
          // Vous pouvez ajouter ici une action (afficher du texte, ouvrir une boîte, etc.)
        }
      }, this);
    }
  }
};
