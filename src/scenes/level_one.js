import Player from '../entities/player.js';
export default class LevelOne extends Phaser.Scene {
    constructor() {
        super('LevelOne')
    }

    preload() {
        this.load.image('tiles-level-one', 'assets/tilemaps/level1_v2.png');
        this.load.tilemapTiledJSON('map-level-one', 'assets/tilemaps_json/level1_v2.json');
        this.load.spritesheet('player-level-one', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        const map = this.make.tilemap({ key: 'map-level-one' });
        const tileset = map.addTilesetImage('level1-v2', 'tiles-level-one');

        const worldLayer = map.createLayer('World', tileset, 0, 0);
        const wallLayer = map.createLayer('Wall', tileset, 0, 0);
        const aboveLayer = map.createLayer('Above', tileset, 0, 0);
        const decorationLayer = map.createLayer('Decoration', tileset, 0, 0);
        const borderLayer = map.createLayer('Border', tileset, 0, 0);

        worldLayer.setCollisionByProperty({ collider: true });
        decorationLayer.setCollisionByProperty({ collider: true });
        wallLayer.setCollisionByProperty({ collider: true });
        borderLayer.setDepth(10);

        // Create the player with physics
        const spawnPoint = map.findObject("player", obj => obj.name === "spawn point");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player-level-one');

        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, decorationLayer);
        this.physics.add.collider(this.player, wallLayer);

        // make camera follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('LevelTwo');
        });
    }

    update() {
        const speed = 80; // pixels per second
        this.player.update(this.cursors, speed);
    }
}
