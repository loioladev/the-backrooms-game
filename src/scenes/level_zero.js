import Player from '../entities/player.js';
import Monster from '../entities/monster.js';
export default class LevelZero extends Phaser.Scene {
    constructor() {
        super('LevelZero')
    }

    preload() {
        this.load.image('tiles', 'assets/tilemaps/level0_template.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps_json/level0_template.json');
        this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('devour', 'assets/sprites/devour.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('lantern', 'assets/sprites/lantern.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('walker', 'assets/sprites/walker.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('partygoer', 'assets/sprites/partygoer.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('meatball', 'assets/sprites/meatball.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('smile', 'assets/sprites/smile.png', { frameWidth: 16, frameHeight: 16 })
        this.load.image('vision', 'assets/mask.png')
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('level0_template', 'tiles');

        const belowLayer = map.createLayer('Below', tileset, 0, 0);
        const worldLayer = map.createLayer('World', tileset, 0, 0);
        const decorationLayer = map.createLayer('Decoration', tileset, 0, 0);
        const aboveLayer = map.createLayer('Above', tileset, 0, 0);
        const above1Layer = map.createLayer('Above1', tileset, 0, 0);

        worldLayer.setCollisionByProperty({ collider: true });
        decorationLayer.setCollisionByProperty({ collider: true });
        aboveLayer.setDepth(10);
        above1Layer.setDepth(10);

        // Create the player with physics
        const spawnPoint = map.findObject("Object", obj => obj.name === "Spawnpoint");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player');
        this.monster1 = new Monster(this, spawnPoint.x, spawnPoint.y, 'lantern', 'lantern');
        this.monster2 = new Monster(this, spawnPoint.x + 32, spawnPoint.y + 32, 'devour', 'devour');
        this.monster3 = new Monster(this, spawnPoint.x, spawnPoint.y + 32, 'walker', 'walker')
        this.monster4 = new Monster(this, spawnPoint.x + 32, spawnPoint.y, 'partygoer', 'partygoer')
        this.monster5 = new Monster(this, spawnPoint.x - 32, spawnPoint.y, 'meatball', 'meatball')
        this.monster6 = new Monster(this, spawnPoint.x, spawnPoint.y + 64, 'smile', 'smile')

        const width = this.scale.width * 2
        const height = this.scale.height * 2

        // make a RenderTexture that is the size of the screen
        this.rt = this.make.renderTexture({
            width,
            height
        }, true)


        // fill it with black
        this.rt.fill(0x000000, 0.9)
        this.rt.setDepth(100)

        this.vision = this.make.image({
            x: this.player.x,
            y: this.player.y,
            key: 'vision',
            add: false
        })
        this.vision.scale = 0.4
        this.vision.setPosition(this.player.x, this.player.y)

        this.rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision)
        this.rt.mask.invertAlpha = true
        // this.rt.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, decorationLayer);

        // make camera follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 80; // pixels per second
        this.player.update(this.cursors, speed);

        this.rt.x = this.player.x;
        this.rt.y = this.player.y;
        this.vision.x = this.player.x;
        this.vision.y = this.player.y;
    }
}
