import Player from '../entities/player.js';
import Monster from '../entities/monster.js';
export default class LevelZero extends Phaser.Scene {
    constructor() {
        super('LevelZero')
    }

    preload() {
        this.load.image('tiles-level-zero', 'assets/tilemaps/level0_template.png');
        this.load.tilemapTiledJSON('map-level-zero', 'assets/tilemaps_json/level0_template.json');
        this.load.spritesheet('player-level-zero', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('vision', 'assets/mask.png')
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000'); 
        this.cameras.main.fadeIn(2000);
        const map = this.make.tilemap({ key: 'map-level-zero' });
        const tileset = map.addTilesetImage('level0_template', 'tiles-level-zero');

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
        const spawnPoint = map.findObject("Object", obj => obj.name === "Spawnpoint");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player-level-zero');
        
        // Make fog of war effect
        this.player.createFogOfWar(this, 'vision')

        // Add player physics
        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, decorationLayer);

        // Make camera follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Add player movement
        this.cursors = this.input.keyboard.createCursorKeys();

        // Change scene
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('LevelOne');
        });
    }

    update() {
        // Update player movement
        const speed = 80; // pixels per second
        this.player.update(this.cursors, speed);

        // Update fog of war effect
        this.player.updateFogOfWar()
    }
}