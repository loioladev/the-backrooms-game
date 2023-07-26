import Player from '../entities/player.js';
import Monster from '../entities/monster.js';

const deathMessages = [
    "Você foi devorado pelo monstro!\nTenha mais cuidado da próxima vez.",
    "O monstro te encontrou e acabou com você.\nBoa sorte na próxima.",
    "A escuridão te engoliu, você não resistiu.\nTente novamente.",
    "Você não conseguiu escapar do monstro.\nBoa sorte na próxima.",
    "O monstro te pegou, não houve escapatória.\nTente novamente.",
    "O monstro se aproximou silenciosamente e atacou.\nTenha mais cuidado da próxima vez.",
    "O terror das sombras te levou para sempre.\nTente novamente.",
    "Você foi vítima das criaturas das trevas.\nTenha mais cuidado da próxima vez.",
    "O monstro estava à espreita e te pegou desprevenido.\nBoa sorte na próxima.",
    "Os olhos brilhantes do monstro foram a última coisa que viu.\nTenha mais cuidado da próxima vez.",
    "Sua luz se apagou nas garras do monstro.\nTente novamente.",
];
const TILESIZE = 16;

export default class LevelTwo extends Phaser.Scene {
    constructor() {
        super('LevelTwo')
    }

    preload() {
        this.load.image('tiles-level-two', 'assets/tilemaps/level2_tileset.png');
        this.load.tilemapTiledJSON('map-level-two', 'assets/tilemaps_json/level2.json');
        
        this.load.spritesheet('player-level-two', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('walker', 'assets/sprites/walker.png', { frameWidth: 16, frameHeight: 16 })
        this.load.image('vision', 'assets/mask.png')
        
        this.load.audio('scream', 'assets/sounds/scream_sound_effect.mp3');
        this.load.audio('walker_sound', 'assets/sounds/walker.mp3');
        this.load.audio('ambient', 'assets/sounds/Level1Ambience.mp3');
    }

    create(data) {
        this.startTime = this.time.now / 1000;
        this.playerInfo = data.playerInfo;

        this.walkerSound = this.sound.add('walker_sound', { volume: 0.0, loop: true });
        this.scream = this.sound.add('scream', { volume: 0.2, loop: false });
        this.themeSong = this.sound.add('ambient', { volume: 0.1, loop: true });
        this.walkerSound.play();
        this.themeSong.play();

        const map = this.make.tilemap({ key: 'map-level-two' });
        const tileset = map.addTilesetImage('level2_tileset', 'tiles-level-two');

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
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player-level-two');
        this.player.setSize(10, 16);
        this.player.setDepth(4);

        // Make fog of war effect
        this.player.createFogOfWar(this, 'vision')

        // Add player physics
        this.physics.add.collider(this.player, [wallLayer, pipesLayer]);
        this.player.createFogOfWar(this, 'vision', 0.5, 0.7)

        // Add monsters of the map
        const spawnPoints = map.filterObjects("Monsters", obj => obj.name.startsWith("m"));
        this.allMonsters = this.physics.add.group();

        spawnPoints.forEach((sp, _) => {
            const monster = new Monster(this, sp.x, sp.y, 'walker');
            monster.setSize(10, 16);
            this.allMonsters.add(monster);
        });
        this.physics.add.collider(this.player, this.allMonsters, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.allMonsters, [wallLayer, pipesLayer]);

        // Make camera follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Add player movement
        this.cursors = this.input.keyboard.createCursorKeys();

        this.end = false;
        this.dead = false;
    }

    update() {
        // verify if player is in the door
        if (!this.end){
            this.endingDoor()
        }

        // Update player movement
        this.player.updateFogOfWar()
        if (this.player.body.enable)
            this.player.update(this.cursors, 100);

        this.updateMonsterMovement();
    }

    updateMonsterMovement() {
        this.timeMovement++;

        this.allMonsters.getChildren().forEach(monster => {
            monster.random_movement(30, this.timeMovement);
        })

        let playSong = false;
        let songVolume = 1.0;
        this.allMonsters.getChildren().forEach(monster => {
            let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, monster.x, monster.y);
            if (distance <= 100) {
                playSong = true;
                songVolume = 0.6 - Math.min((distance / 100), 0.6);
            }
        })
        if (playSong) {
            this.walkerSound.volume = songVolume;
        }
        else {
            this.walkerSound.volume = 0.0;
        }
    }

    handleMonsterCollision() {
        if (!this.dead) {
            this.scream.play();
            this.player.disableInteractive();
            this.player.body.enable = false; // Disable player physics
            this.player.setTint(0xff0000); // Set player tint to red
            this.player.anims.play(this.player.idle, true); // Play player idle animation
            this.dead = true;
            this.themeSong.stop();
            this.walkerSound.stop();
            const randomDeathMessage = Phaser.Math.RND.pick(deathMessages);
            this.cameras.main.fadeOut(2000);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('TextScene', { text: randomDeathMessage, nextScene: 'LevelTwo', timeText: 3000, playerInfo: this.playerInfo });
            });
        }
    }

    endingDoor() {
        const doorLocation = [{ x: 2405, y: 1210 }];
        const playerLocation = { x: this.player.x, y: this.player.y };

        if (!this.hasCard) {
            return;
        }
        for (var i = 0; i < doorLocation.length; i++) {
            if (Math.abs(playerLocation.x - doorLocation[i].x) <= 16 && Math.abs(playerLocation.y - doorLocation[i].y) <= 16) {
                // Atualizar jogador no banco de dados
                let timePassed = (this.time.now / 1000) - this.startTime;
                let playerInfo = this.playerInfo;
                playerInfo.totalTime += timePassed;
                playerInfo.lastTime = timePassed;
                playerInfo.map = 'level0'

                this.themeSong.stop();
                this.walkerSound.stop();
                this.end = true;
                this.cameras.main.fadeOut(2000);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('TextScene', { text: '...', nextScene: 'LastLevel' , playerInfo: playerInfo});
                });
            }
        }
    }
}
