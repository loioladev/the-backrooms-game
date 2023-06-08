import Player from '../entities/player.js';
import Monster from '../entities/monster.js';

const TILESIZE = 16;

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
        this.load.image('vision', 'assets/mask.png');

        this.load.image('note1', 'assets/level0/notas1.png');
        this.load.image('note2', 'assets/level0/notas2.png');
        this.load.image('note3', 'assets/level0/notas3.png');
        this.load.image('note4', 'assets/level0/notafinal.png');
        this.load.image('card', 'assets/level0/card.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(2000);

        this.card = this.add.image(0, 0, 'card');
        this.hasCard = false;

        this.note1 = this.add.sprite(0, 0, 'note1');
        this.note2 = this.add.sprite(0, 0, 'note2');
        this.note3 = this.add.sprite(0, 0, 'note3');
        this.note4 = this.add.sprite(0, 0, 'note4');
        this.card.setVisible(false);
        this.note1.setVisible(false);
        this.note2.setVisible(false);
        this.note3.setVisible(false);
        this.note4.setVisible(false);
        this.note1.setDepth(101);
        this.note2.setDepth(101);
        this.note3.setDepth(101);
        this.note4.setDepth(101);
        this.card.setDepth(101);

        this.notesPosition = [
            { x: 47 * TILESIZE, y: 97 * TILESIZE },
            { x: 4 * TILESIZE, y: 57 * TILESIZE },
            { x: 52 * TILESIZE, y: 48 * TILESIZE },
            { x: 79 * TILESIZE, y: 7 * TILESIZE },
            { x: 67 * TILESIZE, y: 6 * TILESIZE } // card location
        ]

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
        this.player.body.setSize(10, 16);
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
    }

    update() {
        // verify if player is in the door
        this.endingDoor()
        // show notes for player
        this.showNotes()

        // show card
        if (this.hasCard) {
            this.card.setVisible(true);
            this.card.x = this.cameras.main.scrollX + 40;
            this.card.y = this.cameras.main.scrollY + 20;
        }

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

    showNotes() {
        const playerLocation = { x: this.player.x, y: this.player.y };
        const notesLocation = this.notesPosition;
        const cameraLocation = { x: this.cameras.main.scrollX + 150, y: this.cameras.main.scrollY + 150};
        if (Math.abs(playerLocation.x - notesLocation[0].x) <= 32 && Math.abs(playerLocation.y - notesLocation[0].y) <= 32) {
            this.note1.setVisible(true);
            this.note1.x = cameraLocation.x
            this.note1.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - notesLocation[1].x) <= 32 && Math.abs(playerLocation.y - notesLocation[1].y) <= 32) {
            this.note2.setVisible(true);
            this.note2.x = cameraLocation.x
            this.note2.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - notesLocation[2].x) <= 32 && Math.abs(playerLocation.y - notesLocation[2].y) <= 32) {
            this.note3.setVisible(true);
            this.note3.x = cameraLocation.x
            this.note3.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - notesLocation[3].x) <= 32 && Math.abs(playerLocation.y - notesLocation[3].y) <= 32) {
            this.note4.setVisible(true);
            this.note4.x = cameraLocation.x
            this.note4.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - notesLocation[4].x) <= 32 && Math.abs(playerLocation.y - notesLocation[4].y) <= 32) {
            this.hasCard = true;
        }
        else {
            this.note1.setVisible(false);
            this.note2.setVisible(false);
            this.note3.setVisible(false);
            this.note4.setVisible(false);
        }
    }

    endingDoor() {
        const doorLocation = [{ x: 72 * TILESIZE, y: 47 * TILESIZE }, { x: 72 * TILESIZE, y: 48 * TILESIZE },
        { x: 72 * TILESIZE, y: 49 * TILESIZE }];
        const playerLocation = { x: this.player.x, y: this.player.y };

        if (!this.hasCard) {
            return;
        }

        for (var i = 0; i < doorLocation.length; i++) {
            if (Math.abs(playerLocation.x - doorLocation[i].x) <= 16 && Math.abs(playerLocation.y - doorLocation[i].y) <= 16) {
                this.cameras.main.fadeOut(2000);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('LevelOne');
                });
            }
        }
    }
}