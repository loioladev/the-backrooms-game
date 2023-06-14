import Player from "../entities/player.js";
import Monster from "../entities/monster.js";

const TILESIZE = 16;


export default class LastLevel extends Phaser.Scene {
    constructor() {
        super('LastLevel');
    }

    preload() {
        this.load.image('tiles-level-last', 'assets/tilemaps/level_last_template.png');
        this.load.tilemapTiledJSON('map-level-last', 'assets/tilemaps_json/level_last_template.json');
        this.load.spritesheet('player-level-last', 'assets/sprites/player.png', {frameWidth: 16, frameHeight: 16});
        this.load.image('vision', 'assets/mask.png');
        this.load.spritesheet('lantern', 'assets/sprites/lantern.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('devour', 'assets/sprites/devour.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('walker', 'assets/sprites/walker.png', {frameWidth: 16, frameHeight: 16})
        this.load.spritesheet('meatball', 'assets/sprites/meatball.png', {frameWidth: 16, frameHeight: 16})
        this.load.spritesheet('partygoer', 'assets/sprites/partygoer.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('smile', 'assets/sprites/smile.png', {frameWidth: 16, frameHeight: 16})


    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(2000);
        const map = this.make.tilemap({key: 'map-level-last'})
        const tileset = map.addTilesetImage('last_map', 'tiles-level-last')
        const worldLayer = map.createLayer('World', tileset, 0, 0)
        const belowLayer = map.createLayer('Below', tileset, 0, 0);
        const decorationLayer = map.createLayer('Decoration', tileset, 0, 0);
        const copyOfDecoration = map.createLayer('CopyOfDecoration', tileset, 0, 0);
        const upOthers = map.createLayer('UpOthers', tileset, 0, 0);
        this.player_speed = 80;
        this.monster_speed = 77.5;

        worldLayer.setCollisionByProperty({collider: true});
        belowLayer.setCollisionByProperty({collider: true});
        decorationLayer.setCollisionByProperty({collider: true});
        copyOfDecoration.setCollisionByProperty({collider: true});

        copyOfDecoration.setDepth(5);
        decorationLayer.setDepth(8);
        belowLayer.setDepth(7);
        upOthers.setDepth(10);

        const spawnPoint = map.findObject("object", obj => obj.name === "object");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player-level-last');
        this.player.body.setSize(10, 14);
        this.player.createFogOfWar(this, 'vision')
        this.player.setDepth(6);
        const spawnPointMonster1 = map.findObject("monsters", obj => obj.name === "monster1");
        const spawnPointMonster2 = map.findObject("monsters", obj => obj.name === "monster2");
        const spawnPointMonster3 = map.findObject("monsters", obj => obj.name === "monster3");
        const spawnPointMonster4 = map.findObject("monsters", obj => obj.name === "monster4");
        const spawnPointMonster5 = map.findObject("monsters", obj => obj.name === "monster5");
        const spawnPointMonster6 = map.findObject("monsters", obj => obj.name === "monster6");

        this.monster1 = new Monster(this, spawnPointMonster1.x, spawnPointMonster1.y, 'walker', 'walker');
        this.monster2 = new Monster(this, spawnPointMonster5.x, spawnPointMonster5.y, 'lantern', 'lantern');
        this.monster3 = new Monster(this, spawnPointMonster3.x, spawnPointMonster3.y, 'devour', 'devour');
        this.monster4 = new Monster(this, spawnPointMonster4.x, spawnPointMonster4.y, 'meatball', 'meatball');
        this.monster5 = new Monster(this, spawnPointMonster2.x, spawnPointMonster2.y, 'partygoer', 'partygoer');
        this.monster6 = new Monster(this, spawnPointMonster6.x, spawnPointMonster6.y, 'smile', 'smile');

        var allMonsters = this.physics.add.group();
        allMonsters.add(this.monster1);
        allMonsters.add(this.monster2);
        allMonsters.add(this.monster3);
        allMonsters.add(this.monster4);
        allMonsters.add(this.monster5);
        allMonsters.add(this.monster6);

        allMonsters.setDepth(9);
        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, decorationLayer);
        this.physics.add.collider(this.player, belowLayer)

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.player.body.enable)
            this.player.update(this.cursors, this.player_speed);
        if (this.player.body.enable && Phaser.Geom.Rectangle.Overlaps(this.monster3.getBounds(), this.player.getBounds())) {
            var distance = Phaser.Math.Distance.Between(this.monster3.x, this.monster3.y, this.player.x, this.player.y);
            if (distance <= 20) {
                this.handleMonsterCollision();
            }
        }
        this.endingDoor()
        this.player.updateFogOfWar();
        this.physics.moveToObject(this.monster1, this.player, this.monster_speed);
        this.physics.moveToObject(this.monster2, this.player, this.monster_speed);
        this.physics.moveToObject(this.monster3, this.player, this.monster_speed);
        this.physics.moveToObject(this.monster4, this.player, this.monster_speed);
        this.physics.moveToObject(this.monster5, this.player, this.monster_speed);
        this.physics.moveToObject(this.monster6, this.player, this.monster_speed);


    }

    handleMonsterCollision() {
        this.player.disableInteractive();
        this.player.body.enable = false; // Disable player physics
        this.player.setTint(0xff0000); // Set player tint to red
        this.player.anims.play(this.player.idle, true); // Play player idle animation

        this.cameras.main.fadeOut(2000);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('TextScene', {text: 'Você morreu. Tente novamente.', nextScene: 'LastLevel'});
        });
    }

    endingDoor() {
        const doorLocation = [
            {x: 595 * TILESIZE, y: 4 * TILESIZE},
            {x: 595 * TILESIZE, y: 5 * TILESIZE},
            {x: 595 * TILESIZE, y: 6 * TILESIZE},
            {x: 595 * TILESIZE, y: 7 * TILESIZE},
            {x: 595 * TILESIZE, y: 8 * TILESIZE}
        ];

        const playerLocation = {x: this.player.x, y: this.player.y};

        const byPassMap = () => {
            for (var i = 0; i < doorLocation.length; i++) {
                if (Math.abs(playerLocation.x - doorLocation[i].x) <= 30 && Math.abs(playerLocation.y - doorLocation[i].y) <= 30) {
                    this.monster_speed = 20;
                    this.player_speed = 25;
                    this.cameras.main.fadeOut(2000);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('TextScene');
                    });
                }
            }
        }
        if (playerLocation?.x) {
            const sleep = ms => new Promise(r => setTimeout(r, ms));
            sleep(100).then(res => byPassMap());
        } else {
            byPassMap()
        }
    }


}