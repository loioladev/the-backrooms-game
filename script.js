let cursors;
let player;

function preload() {
    this.load.image('tiles', 'assets/tilemaps/level0_template.png');
    this.load.tilemapTiledJSON('map', 'level0_tiled/tilemap_collision.json');
    this.load.image('player', 'assets/player.png');
}

function create() {
    // use the tiles, map and player to create the level
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

    // Create the player with physics
    spawnPoint = map.findObject("Object", obj => obj.name === "Spawnpoint");
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');

    this.physics.add.collider(player, worldLayer);
    this.physics.add.collider(player, decorationLayer);

    // make camera follow player
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    const speed = 80; // pixels per second

    // Move the player left or right when the corresponding arrow key is pressed
    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.setVelocityX(speed);
    } else {
        player.setVelocityX(0);
    }

    // Move the player up or down when the corresponding arrow key is pressed
    if (cursors.up.isDown) {
        player.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        player.setVelocityY(speed);
    } else {
        player.setVelocityY(0);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    parent: "game-container",
    backgroundColor: '#ffffff',
    pixelArt: true,
    zoom: 3,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 } // Top down game, so no gravity
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }

};

const game = new Phaser.Game(config);