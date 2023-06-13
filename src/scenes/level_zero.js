import Player from '../entities/player.js';
import Monster from '../entities/monster.js';
import TextScene from './text_scene.js';
export default class LevelZero extends Phaser.Scene {
    constructor() {
        super('LevelZero');
        this.timeMovement = 0;
    }

    preload() {
        this.load.image('tiles', 'assets/tilemaps/level0_template.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps_json/level0_template.json');
        this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('walker', 'assets/sprites/walker.png', { frameWidth: 16, frameHeight: 16 })
        this.load.image('vision', 'assets/mask.png')
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(2000);
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('level0_template', 'tiles');

        // Create layers and set collision
        const belowLayer = map.createLayer('Below', tileset, 0, 0);
        const worldLayer = map.createLayer('World', tileset, 0, 0);
        const decorationLayer = map.createLayer('Decoration', tileset, 0, 0);
        const aboveLayer = map.createLayer('Above', tileset, 0, 0);
        const above1Layer = map.createLayer('Above1', tileset, 0, 0);
        worldLayer.setCollisionByProperty({ collider: true });
        decorationLayer.setCollisionByProperty({ collider: true });
        aboveLayer.setDepth(10);
        above1Layer.setDepth(10);

        // Create sprites for map
        const spawnPoint = map.findObject("Spawnpoints", obj => obj.name === "Player");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player');
        // Ajustar tamanho do personagem para colisão
        this.player.body.setSize(10, 14);
        // Make fog of war effect
        this.player.createFogOfWar(this, 'vision')


        // Add monsters of the map
        const spawnPointMonster1 = map.findObject("Spawnpoints", obj => obj.name === "Monster1");
        this.monster1 = new Monster(this, spawnPointMonster1.x, spawnPointMonster1.y, 'walker');
        this.monster1.setSize(10, 16);

        const spawnPointMonster2 = map.findObject("Spawnpoints", obj => obj.name === "Monster2");
        this.monster2 = new Monster(this, spawnPointMonster2.x, spawnPointMonster2.y, 'walker');
        this.monster2.setSize(10, 16);

        const spawnPointMonster3 = map.findObject("Spawnpoints", obj => obj.name === "Monster3");
        this.monster3 = new Monster(this, spawnPointMonster3.x, spawnPointMonster3.y, 'walker');
        this.monster3.setSize(10, 16);

        const spawnPointMonster4 = map.findObject("Spawnpoints", obj => obj.name === "Monster4");
        this.monster4 = new Monster(this, spawnPointMonster4.x, spawnPointMonster4.y, 'walker');
        this.monster4.setSize(10, 16);

        const spawnPointMonster5 = map.findObject("Spawnpoints", obj => obj.name === "Monster5");
        this.monster5 = new Monster(this, spawnPointMonster5.x, spawnPointMonster5.y, 'walker');
        this.monster5.setSize(10, 16);

        const spawnPointMonster6 = map.findObject("Spawnpoints", obj => obj.name === "Monster6");
        this.monster6 = new Monster(this, spawnPointMonster6.x, spawnPointMonster6.y, 'walker');
        this.monster6.setSize(10, 16);

        this.monster7 = new Monster(this, spawnPointMonster5.x, spawnPointMonster5.y, 'walker');
        this.monster7.setSize(10, 16);

        this.monster8 = new Monster(this, spawnPointMonster5.x, spawnPointMonster5.y, 'walker');
        this.monster8.setSize(10, 16);

        this.monster9 = new Monster(this, spawnPointMonster5.x, spawnPointMonster5.y, 'walker');
        this.monster9.setSize(10, 16);

        this.monster10 = new Monster(this, spawnPointMonster5.x, spawnPointMonster5.y, 'walker');
        this.monster10.setSize(10, 16);

        this.monster11 = new Monster(this, spawnPointMonster5.x, spawnPointMonster5.y, 'walker');
        this.monster11.setSize(10, 16);

        // Add player physics
        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, decorationLayer);

        // Add collision between monster and world/decoration
        this.physics.add.collider(this.monster1, worldLayer);
        this.physics.add.collider(this.monster1, decorationLayer);
        this.physics.add.collider(this.monster2, worldLayer);
        this.physics.add.collider(this.monster2, decorationLayer);
        this.physics.add.collider(this.monster3, worldLayer);
        this.physics.add.collider(this.monster3, decorationLayer);
        this.physics.add.collider(this.monster4, worldLayer);
        this.physics.add.collider(this.monster4, decorationLayer);
        this.physics.add.collider(this.monster5, worldLayer);
        this.physics.add.collider(this.monster5, decorationLayer);
        this.physics.add.collider(this.monster6, worldLayer);
        this.physics.add.collider(this.monster6, decorationLayer);
        this.physics.add.collider(this.monster7, worldLayer);
        this.physics.add.collider(this.monster7, decorationLayer);
        this.physics.add.collider(this.monster8, worldLayer);
        this.physics.add.collider(this.monster8, decorationLayer);
        this.physics.add.collider(this.monster9, worldLayer);
        this.physics.add.collider(this.monster9, decorationLayer);
        this.physics.add.collider(this.monster10, worldLayer);
        this.physics.add.collider(this.monster10, decorationLayer);
        this.physics.add.collider(this.monster11, worldLayer);
        this.physics.add.collider(this.monster11, decorationLayer);

        // Add collision between player and monster
        this.physics.add.collider(this.player, this.monster1, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster2, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster3, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster4, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster5, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster6, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster7, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster8, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster9, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster10, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster11, this.handleMonsterCollision, null, this);

        // Make camera follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Add player movement
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('TextScene', { text: 'Descubra o enigma enquanto houver luz.\nNa escuridão, CORRA !', nextScene: 'LevelOne' });
        });
    }

    update() {
        // Update player movement
        if (this.player.body.enable)
            this.player.update(this.cursors, 80);

        // Update player fog of war effect
        this.player.updateFogOfWar();

        // Update monster movement
        this.timeMovement++;
        this.monster1.random_movement(30, this.timeMovement);
        this.monster2.random_movement(30, this.timeMovement);
        this.monster3.random_movement(30, this.timeMovement);
        this.monster4.random_movement(30, this.timeMovement);
        this.monster5.random_movement(30, this.timeMovement);
        this.monster6.random_movement(30, this.timeMovement);
        this.monster7.random_movement(30, this.timeMovement);
        this.monster8.random_movement(30, this.timeMovement);
        this.monster9.random_movement(30, this.timeMovement);
        this.monster10.random_movement(30, this.timeMovement);
        this.monster11.random_movement(30, this.timeMovement);
    }

    handleMonsterCollision() {
        this.player.disableInteractive();
        this.player.body.enable = false; // Disable player physics
        this.player.setTint(0xff0000); // Set player tint to red
        this.player.anims.play(this.player.idle, true); // Play player idle animation

        this.cameras.main.fadeOut(2000);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('TextScene', { text: 'Você morreu. Tente novamente.', nextScene: 'LevelZero' });
        });
    }
}