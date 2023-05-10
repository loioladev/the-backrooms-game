import Player from '../entities/player.js';
export default class LevelTwo extends Phaser.Scene {
    constructor() {
        super('LevelTwo')
    }

    preload() {
        this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('tiles', 'assets/tilemaps/level2_tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps_json/level2.json');
        this.load.image('vision', 'assets/mask.png')
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('level2_tileset', 'tiles');

        // Create layers and set collision
        const belowLayer = map.createLayer('Below', tileset, 0, 0);
        const floorLayer = map.createLayer('Floor', tileset, 0, 0);
        const waterLayer = map.createLayer('Water', tileset, 0, 0);
        const floorDecorationLayer = map.createLayer('Floor Decoration', tileset, 0, 0);
        const wallLayer = map.createLayer('Walls', tileset, 0, 0);
        const wallDecorationLayer = map.createLayer('Wall Decoration', tileset, 0, 0);
        const pipesLayer = map.createLayer('Pipes', tileset, 0, 0);
        const ceilingLayer = map.createLayer('Ceiling', tileset, 0, 0);
        wallLayer.setCollisionByProperty({ collider: true });
        pipesLayer.setCollisionByProperty({ collider: true });
        belowLayer.setDepth(0);
        floorLayer.setDepth(1);
        waterLayer.setDepth(2);
        floorDecorationLayer.setDepth(3);
        wallLayer.setDepth(4);
        wallDecorationLayer.setDepth(5);
        pipesLayer.setDepth(6);
        ceilingLayer.setDepth(7);

        // Create sprites for map
        const spawnPoint = map.findObject("Spawnpoint", obj => obj.name === "player");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player');
        //this.player.setSize(14, 15, true);
        this.player.setDepth(4);

        // Make fog of war effect
        this.player.createFogOfWar(this, 'vision')

        // Add player physics
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.player, pipesLayer);

        // Make camera follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Add player movement
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Update player movement
        const speed = 80; // pixels per second
        this.player.update(this.cursors, speed);

        // Update fog of war effect
        this.player.updateFogOfWar()
    }
}
