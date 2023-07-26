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

        this.load.image('note1', 'assets/level0/notas1.png');
        this.load.image('note2', 'assets/level0/notas2.png');
        this.load.image('note3', 'assets/level0/notas3.png');
        this.load.image('note4', 'assets/level0/notafinal.png');
        this.load.image('card', 'assets/level0/card.png');


        this.load.audio('level0_music', 'assets/sounds/level0_music.mp3');
        this.load.audio('walker_sound', 'assets/sounds/walker.mp3');
        this.load.audio('scream', 'assets/sounds/scream_sound_effect.mp3');

    }

    create(data) {
        this.startTime = this.time.now / 1000;
        this.playerInfo = data.playerInfo;
        this.playerInfo.map = 'LevelZero';

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(2000);

        this.themeSong = this.sound.add('level0_music', { volume: 0.1, loop: true });
        this.walkerSound = this.sound.add('walker_sound', { volume: 0.0, loop: true });
        this.scream = this.sound.add('scream', { volume: 0.2, loop: false });
        this.themeSong.play();
        this.walkerSound.play();

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

        // Add player physics
        this.physics.add.collider(this.player, [worldLayer, decorationLayer]);
        this.player.createFogOfWar(this, 'vision', 0.5, 0.7)

        // Add monsters of the map
        const spawnPoints = map.filterObjects("Spawnpoints", obj => obj.name.startsWith("Monster"));
        this.allMonsters = this.physics.add.group();

        spawnPoints.forEach((spawnPoint, index) => {
            const monster = new Monster(this, spawnPoint.x, spawnPoint.y, 'walker');
            monster.setSize(10, 16);
            this.allMonsters.add(monster);
        });
        this.physics.add.collider(this.player, this.allMonsters, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.allMonsters, [worldLayer, decorationLayer]);


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

        // show notes for player
        let moveMonster = this.showNotes()


        // show card
        if (this.hasCard) {
            this.card.setVisible(true);
            this.card.x = this.cameras.main.scrollX + 40;
            this.card.y = this.cameras.main.scrollY + 20;
        }

        // Update player movement
        this.player.updateFogOfWar()
        if (this.player.body.enable)
            this.player.update(this.cursors, 80);

        this.updateMonsterMovement(moveMonster);
    }

    updateMonsterMovement(moveMonster) {
        this.timeMovement++;

        if (!moveMonster){
            this.allMonsters.getChildren().forEach(monster => {
                monster.body.setVelocity(0, 0);
            })
            return;
        }

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
                this.scene.start('TextScene', { text: randomDeathMessage, nextScene: 'LevelZero', timeText: 3000, playerInfo: this.playerInfo });
            });
        }
    }

    showNotes() {
        const playerLocation = { x: this.player.x, y: this.player.y };

        const cameraLocation = { x: this.cameras.main.scrollX + 150, y: this.cameras.main.scrollY + 150 };
        const notes = [this.note1, this.note2, this.note3, this.note4, this.card];
        const notesLocation = this.notesPosition;

        let moveMonster = true;
        notes.forEach((note, index) => {
            const noteLocation = notesLocation[index];
            if (index === 4 && note.visible) {
                this.hasCard = true;
            }
            if (Math.abs(playerLocation.x - noteLocation.x) <= 32 && Math.abs(playerLocation.y - noteLocation.y) <= 32) {
                note.setVisible(true);
                note.x = cameraLocation.x;
                note.y = cameraLocation.y;
                moveMonster = false;
            }
            else {
                note.setVisible(false);
            }
        })
        return moveMonster
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
                // Atualizar jogador no banco de dados
                let timePassed = (this.time.now / 1000) - this.startTime;
                let playerInfo = this.playerInfo;
                playerInfo.totalTime += timePassed;
                playerInfo.lastTime = timePassed;
                playerInfo.map = 'LevelZero'

                this.themeSong.stop();
                this.walkerSound.stop();
                this.end = true;
                this.cameras.main.fadeOut(2000);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('TextScene', { text: 'Descubra o enigma enquanto houver luz.\nNa escuridão, CORRA !', nextScene: 'LevelOne' , playerInfo: playerInfo});
                });
            }
        }
    }
}