import Player from "../entities/player.js";
// import Monster from "../entities/monster";

export default class LastLevel extends Phaser.Scene{
    constructor() {
        super('LastLevel');
    }

    preload(){
        this.load.image('tiles-level-last', 'assets/tilemaps/level_last_template.png');
        this.load.tilemapTiledJSON('map-level-last', 'assets/tilemaps_json/level_last_template.json');
        this.load.spritesheet('player-level-last', 'assets/sprites/player.png', {frameWidth: 16, frameHeight: 16});
    }

    create(){
        const map = this.make.tilemap({key: 'map-level-last'})
        const tileset = map.addTilesetImage('last_map', 'tiles-level-last')

        const worldLayer = map.createLayer('World', tileset, 0, 0)
        const belowLayer = map.createLayer('Below', tileset, 0, 0);
        const decorationLayer = map.createLayer('Decoration', tileset, 0, 0);
        // const aboveLayer = map.createLayer('Above', tileset, 0, 0);
        // const above1Layer = map.createLayer('Above1', tileset, 0, 0);

        worldLayer.setCollisionByProperty({ collider: true });
        belowLayer.setCollisionByProperty({ collider: true });
        decorationLayer.setCollisionByProperty({ collider: true });
        decorationLayer.setDepth(10);
        // above1Layer.setDepth(10);

        // Create the player with physics
        const spawnPoint = map.findObject("object", obj => obj.name === "object");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player-level-last');

        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, decorationLayer);
        this.physics.add.collider(this.player, belowLayer)


        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('LevelZero');
        });
    }

    update(){
        const speed = 80;
        this.player.update(this.cursors, speed);
    }
}