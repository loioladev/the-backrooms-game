import PlayerOne from '../entities/player_level_one.js';
import MonsterOne from '../entities/monster_level_one.js';

/*
1 - Arrumar sprite monstros
2 - Arrumar quadro -Done
3 - Nota com dicas -Done
4 - Vê um tempo ideal -Done
5 - Luz no lantern
6 - Sons -Done
7 - API
*/ 

// Definir as constantes de configuração para os monstros
const devourConfig = {
    key: 'devour',
    huntingEndFrame: 8,
    frameRate: 8,
    idleFrame: 19,
    leftStartFrame: 8,
    leftEndFrame: 15,
    rightStartFrame: 0,
    rightEndFrame: 7,
    upStartFrame: 24,
    upEndFrame: 31,
    downStartFrame: 16,
    downEndFrame: 23,
};

const lanternConfig = {
    key: 'lantern',
    huntingEndFrame: 6,
    frameRate: 6,
    idleFrame: 12,
    leftStartFrame: 6,
    leftEndFrame: 11,
    rightStartFrame: 0,
    rightEndFrame: 5,
    upStartFrame: 18,
    upEndFrame: 23,
    downStartFrame: 12,
    downEndFrame: 17,
};

const TILESIZE = 16;

export default class LevelOne extends Phaser.Scene {
    constructor() {
        super('LevelOne');
    }

    preload() {
        this.load.image('tiles-level-one', 'assets/tilemaps/level1_template.png');
        this.load.tilemapTiledJSON('map-level-one', 'assets/tilemaps_json/level1.json');
        this.load.spritesheet('player-level-one', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('lantern-level-one', 'assets/sprites/lantern_level1.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('devour-level-one', 'assets/sprites/devour_level1.png', { frameWidth: 32, frameHeight: 32 })
        this.load.image('dark', 'assets/mask.png');
        this.load.spritesheet('lantern_player', 'assets/sprites/lantern_player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('painting1', 'assets/level1/carro_beje_quadro.png');
        this.load.image('painting2', 'assets/level1/five_F1.png');
        this.load.image('painting3', 'assets/level1/four_elephants.png');
        this.load.image('painting4', 'assets/level1/one_party_monster.png');
        this.load.image('painting5', 'assets/level1/six_cats.png');
        this.load.image('painting6', 'assets/level1/trigemeos.png');
        this.load.image('painting7', 'assets/level1/two_trees.png');
        this.load.image('coverImage', 'assets/level1/black_image.png');
        this.load.image('desvende', 'assets/level1/desvende.png');
        this.load.image('sala', 'assets/level1/encontre_sala.png');
        this.load.image('saida', 'assets/level1/encontre_saida.png');
        this.load.image('pressionar', 'assets/level1/pressionar.png');
        this.load.image('nota', 'assets/level1/nota_dicas.png');
        this.load.audio('chave_sound', 'assets/sounds/chave.mp3')
        this.load.audio('entity_sound', 'assets/sounds/backrooms-entity.mp3')
        this.load.audio('ambience_sound', 'assets/sounds/Level1Ambience.mp3')
        this.load.audio('paper_sound', 'assets/sounds/paper_sound.mp3')
        this.load.audio('button_sound', 'assets/sounds/pressing-a-button.mp3')
        this.load.audio('soundtrack', 'assets/sounds/level1_soundtrack.mp3')
    }

    create() {
        this.msgDesvende = this.add.image(0, 0, 'desvende');
        this.msgSala = this.add.image(0, 0, 'sala');
        this.msgSaida = this.add.image(0, 0, 'saida');
        this.msgPressionar = this.add.image(0, 0, 'pressionar');
        this.nota = this.add.image(0, 0, 'nota');
        this.painting1 = this.add.sprite(0, 0, 'painting1');
        this.painting2 = this.add.sprite(0, 0, 'painting2');
        this.painting3 = this.add.sprite(0, 0, 'painting3');
        this.painting4 = this.add.sprite(0, 0, 'painting4');
        this.painting5 = this.add.sprite(0, 0, 'painting5');
        this.painting6 = this.add.sprite(0, 0, 'painting6');
        this.painting7 = this.add.sprite(0, 0, 'painting7');
        this.msgDesvende.setVisible(false);
        this.nota.setVisible(false);
        this.msgSala.setVisible(false);
        this.msgSaida.setVisible(false);
        this.msgPressionar.setVisible(false);
        this.painting1.setVisible(false);
        this.painting2.setVisible(false);
        this.painting3.setVisible(false);
        this.painting4.setVisible(false);
        this.painting5.setVisible(false);
        this.painting6.setVisible(false);
        this.painting7.setVisible(false);
        this.msgDesvende.setDepth(101);
        this.nota.setDepth(101);
        this.msgSala.setDepth(101);
        this.msgSaida.setDepth(101);
        this.msgPressionar.setDepth(101);
        this.painting1.setDepth(101);
        this.painting2.setDepth(101);
        this.painting3.setDepth(101);
        this.painting4.setDepth(101);
        this.painting5.setDepth(101);
        this.painting6.setDepth(101);
        this.painting7.setDepth(101);

        this.buttonState = [false, false, false, false, false, false];
        this.buttonSequence = new Set();
        this.answer = false;
        this.msgState = 1;
        this.hasKey = false;
        this.next = false;
        this.dead = false;

        this.paintingsPosition = [
            { x: 43 * TILESIZE, y: 63 * TILESIZE },
            { x: 12 * TILESIZE, y: 46 * TILESIZE },
            { x: 53 * TILESIZE, y: 63 * TILESIZE },
            { x: 33 * TILESIZE, y: 63 * TILESIZE },
            { x: 41 * TILESIZE, y: 3 * TILESIZE },
            { x: 61 * TILESIZE, y: 10 * TILESIZE },
            { x: 52 * TILESIZE, y: 10 * TILESIZE },
            { x: 6 * TILESIZE, y: 22 * TILESIZE } // Key Position
        ]

        const map = this.make.tilemap({ key: 'map-level-one' });
        const tileset = map.addTilesetImage('level1_template', 'tiles-level-one');

        this.worldLayer = map.createLayer('World', tileset, 0, 0).setDepth(0);
        this.wallLayer = map.createLayer('Wall', tileset, 0, 0).setDepth(1);
        const decorationLayer = map.createLayer('Decoration', tileset, 0, 0).setDepth(2);
        const aboveLayer = map.createLayer('Above', tileset, 0, 0).setDepth(3);
        this.botao1Layer = map.createLayer('botao1', tileset, 0, 0).setDepth(3);
        this.botao2Layer = map.createLayer('botao2', tileset, 0, 0).setDepth(3);
        this.botao3Layer = map.createLayer('botao3', tileset, 0, 0).setDepth(3);
        this.botao4Layer = map.createLayer('botao4', tileset, 0, 0).setDepth(3);
        this.botao5Layer = map.createLayer('botao5', tileset, 0, 0).setDepth(3);
        this.botao6Layer = map.createLayer('botao6', tileset, 0, 0).setDepth(3);
        this.keyLayer = map.createLayer('key', tileset, 0, 0).setDepth(3);
        this.hiddenLayer = map.createLayer('hidden', tileset, 0, 0).setDepth(3);
        const playerLayer = this.add.layer().setDepth(4);
        const borderLayer = map.createLayer('Border', tileset, 0, 0).setDepth(5);
        this.worldLayer.setCollisionByProperty({ collider: true });
        decorationLayer.setCollisionByProperty({ collider: true });
        this.wallLayer.setCollisionByProperty({ collider: true });
        borderLayer.setCollisionByProperty({ collider: true });
        this.hiddenLayer.setCollisionByProperty({ collider: true });

        this.buttonsPosition = [
            { x: 40 * TILESIZE, y: 50 * TILESIZE },
            { x: 41 * TILESIZE, y: 50 * TILESIZE },
            { x: 42 * TILESIZE, y: 50 * TILESIZE },
            { x: 43 * TILESIZE, y: 50 * TILESIZE },
            { x: 44 * TILESIZE, y: 50 * TILESIZE },
            { x: 45 * TILESIZE, y: 50 * TILESIZE },
            { x: 35 * TILESIZE, y: 30 * TILESIZE} // Nota Position
        ]

        // Create the player with physics
        const spawnPoint = map.findObject("Player", obj => obj.name === "spawnpoint");
        this.player = new PlayerOne(this, spawnPoint.x, spawnPoint.y, 'lantern_player', 'player-level-one');
        playerLayer.add(this.player);

        // Configurar a ordem de sobreposição das camadas
        this.children.bringToTop(this.worldLayer);
        this.children.bringToTop(this.wallLayer);
        this.children.bringToTop(decorationLayer);
        this.children.bringToTop(aboveLayer);
        this.children.bringToTop(this.botao1Layer);
        this.children.bringToTop(this.botao2Layer);
        this.children.bringToTop(this.botao3Layer);
        this.children.bringToTop(this.botao4Layer);
        this.children.bringToTop(this.botao5Layer);
        this.children.bringToTop(this.botao6Layer);
        this.children.bringToTop(this.keyLayer);
        this.children.bringToTop(this.hiddenLayer);
        this.children.bringToTop(playerLayer);
        this.children.bringToTop(borderLayer);

        this.physics.add.collider(this.player, this.worldLayer);
        this.physics.add.collider(this.player, decorationLayer);
        this.physics.add.collider(this.player, this.wallLayer);
        this.hiddenCollider = this.physics.add.collider(this.player, this.hiddenLayer);

        // Make camera follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Make fog effect
        this.player.createFogOfWar(this, 'dark', 0.2, 1);
        const spawnPointMonster1 = map.findObject("Monsters", obj => obj.name === "monster1");
        const spawnPointMonster2 = map.findObject("Monsters", obj => obj.name === "monster2");
        const spawnPointMonster3 = map.findObject("Monsters", obj => obj.name === "monster3");
        const spawnPointMonster4 = map.findObject("Monsters", obj => obj.name === "monster4");
        const spawnPointMonster5 = map.findObject("Monsters", obj => obj.name === "monster5");
        const spawnPointMonster6 = map.findObject("Monsters", obj => obj.name === "monster6");

        this.monster1 = new MonsterOne(this, spawnPointMonster1.x, spawnPointMonster1.y, 'lantern-level-one', lanternConfig);
        this.monster1.setSize(10, 16);
        this.monster2 = new MonsterOne(this, spawnPointMonster2.x, spawnPointMonster2.y, 'lantern-level-one', lanternConfig);
        this.monster2.setSize(10, 16);
        this.monster6 = new MonsterOne(this, spawnPointMonster6.x, spawnPointMonster6.y, 'lantern-level-one', lanternConfig);
        this.monster6.setSize(10, 16);
        this.monster3 = new MonsterOne(this, spawnPointMonster3.x, spawnPointMonster3.y, 'devour-level-one', devourConfig);
        this.monster3.setSize(10, 16);
        this.monster4 = new MonsterOne(this, spawnPointMonster4.x, spawnPointMonster4.y, 'devour-level-one', devourConfig);
        this.monster4.setSize(10, 16);
        this.monster5 = new MonsterOne(this, spawnPointMonster5.x, spawnPointMonster5.y, 'devour-level-one', devourConfig);
        this.monster5.setSize(10, 16);

        var allMonsters = this.physics.add.group();
        allMonsters.add(this.monster1);
        allMonsters.add(this.monster2);
        allMonsters.add(this.monster3);
        allMonsters.add(this.monster4);
        allMonsters.add(this.monster5)
        allMonsters.add(this.monster6)
        allMonsters.setDepth(9);

        this.monsters = []
        this.monsters.push(this.monster1);
        this.monsters.push(this.monster2);
        this.monsters.push(this.monster3);
        this.monsters.push(this.monster4);
        this.monsters.push(this.monster5);
        this.monsters.push(this.monster6);

        // Add collision between monster and world/decoration
        this.physics.add.collider(this.monster1, this.worldLayer);
        this.physics.add.collider(this.monster2, this.worldLayer);
        this.physics.add.collider(this.monster3, this.worldLayer);
        this.physics.add.collider(this.monster4, this.worldLayer);
        this.physics.add.collider(this.monster5, this.worldLayer);
        this.physics.add.collider(this.monster6, this.worldLayer);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-ENTER', function () {
            if (!this.answer) {
                this.pressButton();
            }
        }, this);

        this.ambienceSound = this.sound.add('ambience_sound', { volume: 0.2, loop: true });
        this.soundtrack = this.sound.add('soundtrack', { volume: 0.1, loop: true });
        this.entitySound = this.sound.add('entity_sound', { volume: 0.0, loop: true });
        this.keySound = this.sound.add('chave_sound', { volume: 0.3, loop: false });
        this.paperSound = this.sound.add('paper_sound', { volume: 0.3, loop: false });
        this.buttonSound = this.sound.add('button_sound', { volume: 0.3, loop: false });
        this.ambienceSound.play();
        this.soundtrack.play();
        this.entitySound.play();

        // Variáveis de controle
        this.lightMaskActive = false; // Inicialmente a máscara de luz está desativada
        this.bool_skin = false;
        this.maskDuration = 20000; // Duração 20 segundos
        this.maskDisabledDuration = 60000; // Duração em milissegundos para a máscara desativada (60 segundos)
        this.maskTimer = this.time.addEvent({
            delay: this.maskDuration,
            callback: this.toggleLightMask,
            callbackScope: this,
            loop: true
        });
        // Mask for the secret room
        this.coverLayer = this.add.layer();
        this.coverImage = this.add.image(6, 250, 'coverImage');
        this.coverLayer.add(this.coverImage);
        this.coverLayer.setDepth(100);
    }

    update() {
        this.showPaintings()
        this.messages()
        if (this.next == false) {
            this.exit()
        }
        if (this.answer == false) {
            this.answer = this.enigma()
        }

        if (this.msgState == 1) {
            this.msgDesvende.setVisible(true);
            this.msgDesvende.x = this.cameras.main.scrollX + 75;
            this.msgDesvende.y = this.cameras.main.scrollY + 20;
        }
        else if (this.msgState == 2) {
            this.msgPressionar.setVisible(true);
            this.msgPressionar.x = this.cameras.main.scrollX + 75;
            this.msgPressionar.y = this.cameras.main.scrollY + 20;
        }
        else if (this.msgState == 3) {
            this.msgSala.setVisible(true);
            this.msgSala.x = this.cameras.main.scrollX + 52;
            this.msgSala.y = this.cameras.main.scrollY + 20;
        }
        else if (this.msgState == 4) {
            this.msgSaida.setVisible(true);
            this.msgSaida.x = this.cameras.main.scrollX + 40;
            this.msgSaida.y = this.cameras.main.scrollY + 20;
        }
        else if (this.msgState == 5) {
            if (!this.nota.visible) { 
                this.paperSound.play();
            }
            this.nota.setVisible(true);
            this.nota.x = this.cameras.main.scrollX + 150;
            this.nota.y = this.cameras.main.scrollY + 150;
        }
        else {
            this.msgDesvende.setVisible(false);
            this.msgPressionar.setVisible(false);
            this.msgSala.setVisible(false);
            this.msgSaida.setVisible(false);
            this.nota.setVisible(false);
        }

        const speed = 100; // pixels por segundo
        this.player.update(this.cursors, speed);

        this.botao1Layer.setVisible(this.buttonState[0]);
        this.botao2Layer.setVisible(this.buttonState[1]);
        this.botao3Layer.setVisible(this.buttonState[2]);
        this.botao4Layer.setVisible(this.buttonState[3]);
        this.botao5Layer.setVisible(this.buttonState[4]);
        this.botao6Layer.setVisible(this.buttonState[5]);
        this.keyLayer.setVisible(!this.hasKey);

        // Verifique se a máscara de luz está ativa
        if (this.lightMaskActive) {
            // Ative os monstros se estiverem inativos
            if (!this.monster1.active) {
                this.physics.world.enable(this.monster1); // Ativa a física do monstro
                this.monster1.setActive(true);
                this.monster1.setVisible(true);
            }
            if (!this.monster2.active) {
                this.physics.world.enable(this.monster2); // Ativa a física do monstro
                this.monster2.setActive(true);
                this.monster2.setVisible(true);
            }
            if (!this.monster3.active) {
                this.physics.world.enable(this.monster3); // Ativa a física do monstro
                this.monster3.setActive(true);
                this.monster3.setVisible(true);
            }
            if (!this.monster4.active) {
                this.physics.world.enable(this.monster4); // Ativa a física do monstro
                this.monster4.setActive(true);
                this.monster4.setVisible(true);
            }
            if (!this.monster5.active) {
                this.physics.world.enable(this.monster5); // Ativa a física do monstro
                this.monster5.setActive(true);
                this.monster5.setVisible(true);
            }
            if (!this.monster6.active) {
                this.physics.world.enable(this.monster6); // Ativa a física do monstro
                this.monster6.setActive(true);
                this.monster6.setVisible(true);
            }

            // Atualizar o efeito da máscara de luz do jogador
            this.player.updateFogOfWar();
            if (this.bool_skin == true) {
                this.player.setSkin(true);
                this.bool_skin = false;
            }
            this.updateMonsterChase(this.monster1);
            this.updateMonsterChase(this.monster2);
            this.updateMonsterChase(this.monster3);
            this.updateMonsterChase(this.monster4);
            this.updateMonsterChase(this.monster5);
            this.updateMonsterChase(this.monster6);
            this.updateMonsterSound(this.monsters);

        } else {

            // Desative os monstros se estiverem ativos
            if (this.monster1.active) {
                this.monster1.setActive(false);
                this.monster1.setVisible(false);
                this.physics.world.disable(this.monster1); // Desativa a física do monstro
            }
            if (this.monster2.active) {
                this.monster2.setActive(false);
                this.monster2.setVisible(false);
                this.physics.world.disable(this.monster2); // Desativa a física do monstro
            }
            if (this.monster3.active) {
                this.monster3.setActive(false);
                this.monster3.setVisible(false);
                this.physics.world.disable(this.monster3); // Desativa a física do monstro
            }
            if (this.monster4.active) {
                this.monster4.setActive(false);
                this.monster4.setVisible(false);
                this.physics.world.disable(this.monster4); // Desativa a física do monstro
            }
            if (this.monster5.active) {
                this.monster5.setActive(false);
                this.monster5.setVisible(false);
                this.physics.world.disable(this.monster5); // Desativa a física do monstro
            }
            if (this.monster6.active) {
                this.monster6.setActive(false);
                this.monster6.setVisible(false);
                this.physics.world.disable(this.monster6); // Desativa a física do monstro
            }
            this.entitySound.setVolume(0.0);
            this.player.hideFogOfWar();
            if (this.bool_skin == false) {
                this.player.setSkin(false);
                this.bool_skin = true;
            }
        }
    }

    toggleLightMask() {
        this.lightMaskActive = !this.lightMaskActive;

        // Cancelar o evento atual
        this.maskTimer.remove();

        // Verificar se a máscara de luz está ativa
        if (this.lightMaskActive) {

            // Criar um novo evento para a duração da máscara ativa
            this.maskTimer = this.time.addEvent({
                delay: this.maskDuration,
                callback: this.toggleLightMask,
                callbackScope: this,
                loop: false
            });
        } else {

            // Criar um novo evento para a duração da máscara desativada
            this.maskTimer = this.time.addEvent({
                delay: this.maskDisabledDuration,
                callback: this.toggleLightMask,
                callbackScope: this,
                loop: false
            });
        }
    }

    handleMonsterCollision() {
        this.dead = true;
        this.ambienceSound.stop();
        this.entitySound.stop();
        this.keySound.stop();
        this.paperSound.stop();
        this.buttonSound.stop();
        this.soundtrack.stop();
        this.player.disableInteractive();
        this.player.body.enable = false; // Disable player physics
        this.player.setTint(0xff0000); // Set player tint to red
        this.player.anims.play(this.player.idle, true); // Play player idle animation

        this.cameras.main.fadeOut(2000);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('TextScene', { text: 'Você morreu. Tente novamente.', nextScene: 'LevelOne' });
        });
    }

    showPaintings() {
        const playerLocation = { x: this.player.x, y: this.player.y };
        const paintingsLocation = this.paintingsPosition;
        const cameraLocation = { x: this.cameras.main.scrollX + 150, y: this.cameras.main.scrollY + 150 };
        if (Math.abs(playerLocation.x - paintingsLocation[0].x) <= 16 && Math.abs(playerLocation.y - paintingsLocation[0].y) <= 16) {
            this.painting1.setVisible(true);
            this.painting1.x = cameraLocation.x
            this.painting1.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - paintingsLocation[1].x) <= 16 && Math.abs(playerLocation.y - paintingsLocation[1].y) <= 16) {
            this.painting2.setVisible(true);
            this.painting2.x = cameraLocation.x
            this.painting2.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - paintingsLocation[2].x) <= 16 && Math.abs(playerLocation.y - paintingsLocation[2].y) <= 16) {
            this.painting3.setVisible(true);
            this.painting3.x = cameraLocation.x
            this.painting3.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - paintingsLocation[3].x) <= 16 && Math.abs(playerLocation.y - paintingsLocation[3].y) <= 16) {
            this.painting4.setVisible(true);
            this.painting4.x = cameraLocation.x
            this.painting4.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - paintingsLocation[4].x) <= 16 && Math.abs(playerLocation.y - paintingsLocation[4].y) <= 16) {
            this.painting5.setVisible(true);
            this.painting5.x = cameraLocation.x
            this.painting5.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - paintingsLocation[5].x) <= 16 && Math.abs(playerLocation.y - paintingsLocation[5].y) <= 16) {
            this.painting6.setVisible(true);
            this.painting6.x = cameraLocation.x
            this.painting6.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - paintingsLocation[6].x) <= 16 && Math.abs(playerLocation.y - paintingsLocation[6].y) <= 16) {
            this.painting7.setVisible(true);
            this.painting7.x = cameraLocation.x
            this.painting7.y = cameraLocation.y
        }
        else if (Math.abs(playerLocation.x - paintingsLocation[7].x) <= 16 && Math.abs(playerLocation.y - paintingsLocation[7].y) <= 16) {
            if (this.hasKey == false) {
                this.keySound.play();
            }
            this.hasKey = true;
        }
        else {
            this.painting1.setVisible(false);
            this.painting2.setVisible(false);
            this.painting3.setVisible(false);
            this.painting4.setVisible(false);
            this.painting5.setVisible(false);
            this.painting6.setVisible(false);
            this.painting7.setVisible(false);
        }
    }

    pressButton() {
        // Verificar se o personagem está próximo de um botão
        var botao = this.checkButtonProximity()
        if (botao == 1) {
            this.buttonState[0] = !this.buttonState[0];
            if (this.buttonState[0] == true) {
                this.buttonSound.play();
                this.buttonSequence.add(1);
            }
            else {
                this.buttonSound.play();
                this.buttonSequence.delete(1);
            }
        }
        else if (botao == 2) {
            this.buttonState[1] = !this.buttonState[1];
            if (this.buttonState[1] == true) {
                this.buttonSound.play();
                this.buttonSequence.add(2);
            }
            else {
                this.buttonSound.play();
                this.buttonSequence.delete(2);
            }
        }
        else if (botao == 3) {
            this.buttonState[2] = !this.buttonState[2];
            if (this.buttonState[2] == true) {
                this.buttonSound.play();
                this.buttonSequence.add(3);
            }
            else {
                this.buttonSound.play();
                this.buttonSequence.delete(3);
            }
        }
        else if (botao == 4) {
            this.buttonState[3] = !this.buttonState[3];
            if (this.buttonState[3] == true) {
                this.buttonSound.play();
                this.buttonSequence.add(4);
            }
            else {
                this.buttonSound.play();
                this.buttonSequence.delete(4);
            }
        }
        else if (botao == 5) {
            this.buttonState[4] = !this.buttonState[4];
            if (this.buttonState[4] == true) {
                this.buttonSound.play();
                this.buttonSequence.add(5);
            }
            else {
                this.buttonSound.play();
                this.buttonSequence.delete(5);
            }
        }
        else if (botao == 6) {
            this.buttonState[5] = !this.buttonState[5];
            if (this.buttonState[5] == true) {
                this.buttonSound.play();
                this.buttonSequence.add(6);
            }
            else {
                this.buttonSound.play();
                this.buttonSequence.delete(6);
            }
        }
    }

    // Função para verificar a proximidade do personagem com um botão
    checkButtonProximity() {
        const playerLocation = { x: this.player.x, y: this.player.y };
        const buttonsLocation = this.buttonsPosition;
        // Verificar se o personagem está próximo do botão 1
        if (Math.abs(playerLocation.x - buttonsLocation[0].x) <= 10 && Math.abs(playerLocation.y - buttonsLocation[0].y) <= 10) {
            return 1;
        }
        // Verificar se o personagem está próximo do botão 2
        else if (Math.abs(playerLocation.x - buttonsLocation[1].x) <= 10 && Math.abs(playerLocation.y - buttonsLocation[1].y) <= 10) {
            return 2;
        }
        else if (Math.abs(playerLocation.x - buttonsLocation[2].x) <= 10 && Math.abs(playerLocation.y - buttonsLocation[2].y) <= 10) {
            return 3;
        }
        else if (Math.abs(playerLocation.x - buttonsLocation[3].x) <= 10 && Math.abs(playerLocation.y - buttonsLocation[3].y) <= 10) {
            return 4;
        }
        else if (Math.abs(playerLocation.x - buttonsLocation[4].x) <= 10 && Math.abs(playerLocation.y - buttonsLocation[4].y) <= 10) {
            return 5;
        }
        else if (Math.abs(playerLocation.x - buttonsLocation[5].x) <= 10 && Math.abs(playerLocation.y - buttonsLocation[5].y) <= 10) {
            return 6;
        }
        else {
            return 0;
        }
    }
    enigma() {
        const result = [1, 4, 2, 6, 5, 3];
        if (this.buttonSequence.size === result.length) {
            const sequenceArray = Array.from(this.buttonSequence);
            for (let i = 0; i < sequenceArray.length; i++) {
                if (sequenceArray[i] !== result[i]) {
                    // Wrong sequence
                    this.buttonSequence.clear();
                    this.buttonState.fill(false);
                    return false;
                }
            }
            // Correct sequence
            this.coverLayer.destroy();
            this.hiddenCollider.destroy();
            this.hiddenLayer.setVisible(false);
            return true;
        }
        else {
            return false;
        }
    }

    messages() {
        const playerLocation = { x: this.player.x, y: this.player.y };
        const buttonsLocation = this.buttonsPosition;
        if (Math.abs(playerLocation.x - buttonsLocation[6].x) > 20 || Math.abs(playerLocation.y - buttonsLocation[6].y) > 20) {
            this.nota.setVisible(false);
        }
        if (Math.abs(playerLocation.x - buttonsLocation[2].x) <= 60 && Math.abs(playerLocation.y - buttonsLocation[2].y) <= 60 && this.answer == false) {
            this.msgState = 2;
            this.msgDesvende.setVisible(false);
            this.nota.setVisible(false);
        }
        else if (Math.abs(playerLocation.x - buttonsLocation[6].x) <= 20 && Math.abs(playerLocation.y - buttonsLocation[6].y) <= 20) {
            this.msgState = 5;
            this.msgDesvende.setVisible(false);
            this.msgPressionar.setVisible(false);
        }
        else if (this.answer == false) {
            this.msgState = 1;
            this.msgPressionar.setVisible(false);
        }
        else if (this.answer == true && this.hasKey == false) {
            this.msgState = 3;
            this.msgDesvende.setVisible(false);
            this.msgPressionar.setVisible(false);
        }
        else if (this.hasKey == true) {
            this.msgState = 4;
            this.msgDesvende.setVisible(false);
            this.msgPressionar.setVisible(false);
            this.msgSala.setVisible(false);
        }
        else {
            this.msgState = 0;
        }
    }

    updateMonsterSound(monsters) {
        const player = this.player;
        let nearestMonsterDistance = Infinity; // Start with a very large distance
        let nearestMonster = null;
    
        // Find the nearest monster to the player
        for (const monster of monsters) {
            console.log(monster);
            monster.update();
            const distance = Phaser.Math.Distance.Between(monster.x, monster.y, player.x, player.y);
            if (distance < nearestMonsterDistance) {
                nearestMonsterDistance = distance;
                nearestMonster = monster;
            }
        }
    
        // Adjust volume based on the distance to the nearest monster
        function mapDistanceToVolume(distance) {
            const maxDistance = 200; // Maximum distance for full volume
            const minDistance = 0;   // Minimum distance for lowest volume
            const maxVolume = 1;     // Maximum volume level (full volume)
            const minVolume = 0;     // Minimum volume level (lowest volume)
        
            // Calculate the percentage of distance between minDistance and maxDistance
            const distancePercentage = Phaser.Math.Percent(minDistance, maxDistance, distance);
        
            // Map the distancePercentage to the volume range
            const volume = Phaser.Math.Linear(0, 100, distancePercentage, maxVolume, minVolume);
        
            return Phaser.Math.Clamp(volume, minVolume, maxVolume);
        }
    
        // If there is a nearest monster, adjust the volume based on its distance
        if (nearestMonster) {
            const volume = mapDistanceToVolume(nearestMonsterDistance);
            this.entitySound.setVolume(volume);
        } else {
            // If no monsters are present, set volume to 0
            this.entitySound.setVolume(0);
        }
    }

    updateMonsterChase(monster) {
        const speed = 50; // Velocidade do monstro (pixels por segundo)
        const player = this.player;
        const distance = Phaser.Math.Distance.Between(monster.x, monster.y, player.x, player.y);

        if (distance < 20 && this.dead == false) {
            this.handleMonsterCollision();
        }
      
        else if (distance < 200) {
          // Obtenha as coordenadas do jogador e do monstro no formato de grade
          const playerGridPos = this.worldLayer.worldToTileXY(player.x, player.y);
          const monsterGridPos = this.worldLayer.worldToTileXY(monster.x, monster.y);
      
          // Execute o algoritmo A* para encontrar o caminho até o jogador, desviando da camada "wallLayer"
          const path = this.findPath(monsterGridPos, playerGridPos);
      
          if (path && path.length > 1) {
            // Obtenha a próxima posição no caminho
            const nextGridPos = path[1];
      
            // Verifique se a próxima posição está dentro da camada "wallLayer"
            const tile = this.wallLayer.getTileAt(nextGridPos.x, nextGridPos.y);
      
            if (tile) {
              // Calcule o ângulo para desviar da parede
              const wallAngle = Phaser.Math.Angle.Between(monster.x, monster.y, tile.getCenterX(), tile.getCenterY());
              const targetAngle = wallAngle + Math.PI;
      
              // Calcule a direção perpendicular ao ângulo de desvio
              const perpendicularAngle = targetAngle + Math.PI / 2;
      
              // Calcule o desvio para evitar a parede
              const wallOffset = 16; // Ajuste o valor conforme necessário para evitar a parede corretamente
      
              const offsetX = Math.cos(perpendicularAngle) * wallOffset;
              const offsetY = Math.sin(perpendicularAngle) * wallOffset;
      
              // Atualize a direção do monstro para desviar da parede
              const velocityX = Math.cos(targetAngle) * speed;
              const velocityY = Math.sin(targetAngle) * speed;
              monster.body.setVelocity(velocityX, velocityY);
      
              // Ajuste a posição do monstro sem modificar diretamente as coordenadas x e y
              monster.body.x += offsetX;
              monster.body.y += offsetY;
            } else {
              // Converta a posição da grade em coordenadas do mundo
              const nextWorldPos = this.worldLayer.tileToWorldXY(nextGridPos.x, nextGridPos.y);
      
              // Calcule o ângulo em direção à próxima posição
              const angleToNextPos = Phaser.Math.Angle.Between(monster.x, monster.y, nextWorldPos.x, nextWorldPos.y);
      
              // Atualize a direção do monstro para seguir em direção à próxima posição
              monster.body.setVelocity(Math.cos(angleToNextPos) * speed, Math.sin(angleToNextPos) * speed);
            }
          } else {
            // O monstro chegou ao destino ou não há caminho disponível
            monster.body.setVelocity(0, 0);
          }
        } else {
          // O jogador está longe demais, o monstro para de perseguir
          monster.body.setVelocity(0, 0);
        }
    }

    // Função para encontrar o caminho usando o algoritmo A*
    findPath(startPos, endPos) {
        const grid = this.createGrid(); // Crie a representação do grid do seu jogo
        const openList = []; // Lista de nós abertos
        const closedList = []; // Lista de nós fechados

        // Função auxiliar para calcular a heurística (distância estimada) entre dois pontos
        function heuristic(pos1, pos2) {
            const dx = Math.abs(pos1.x - pos2.x);
            const dy = Math.abs(pos1.y - pos2.y);
            return dx + dy; // Heurística de distância de Manhattan (pode ser substituída por outras heurísticas)
        }

        // Insere um nó na lista de nós abertos
        function insertNode(openList, node) {
            let index = 0;
            while (index < openList.length && node.f > openList[index].f) {
                index++;
            }
            openList.splice(index, 0, node);
        }

        // Verifica se uma posição está dentro dos limites do grid
        function isWithinBounds(pos) {
            return pos.x >= 0 && pos.x < grid.length && pos.y >= 0 && pos.y < grid[0].length;
        }

        // Verifica se uma posição é caminhável (ou seja, não é um obstáculo)
        function isWalkable(pos) {
            return grid[pos.x][pos.y] !== 1; // Defina a condição correta para identificar obstáculos no seu grid
        }

        // Retorna o caminho encontrado como uma lista de posições da grade (excluindo a posição inicial)
        function getPath(node) {
            const path = [];
            let currentNode = node;
            while (currentNode.parent) {
                path.push(currentNode.pos);
                currentNode = currentNode.parent;
            }
            path.reverse();
            return path;
        }

        // Cria um nó com a posição e o custo G e H
        function createNode(pos, parent, g, h) {
            return {
                pos: pos,
                parent: parent,
                g: g,
                h: h,
                f: g + h,
            };
        }

        // Adiciona o nó inicial à lista de nós abertos
        const startNode = createNode(startPos, null, 0, heuristic(startPos, endPos));
        openList.push(startNode);

        // Enquanto houver nós abertos na lista
        while (openList.length > 0) {
            // Seleciona o nó com o menor valor de F na lista de nós abertos
            const currentNode = openList.shift();
            closedList.push(currentNode);

            // Se o nó atual for o nó de destino, o caminho foi encontrado
            if (currentNode.pos.x === endPos.x && currentNode.pos.y === endPos.y) {
                return getPath(currentNode);
            }

            // Gera os nós vizinhos
            const neighbors = [
                { x: currentNode.pos.x - 1, y: currentNode.pos.y },
                { x: currentNode.pos.x + 1, y: currentNode.pos.y },
                { x: currentNode.pos.x, y: currentNode.pos.y - 1 },
                { x: currentNode.pos.x, y: currentNode.pos.y + 1 },
            ];

            for (const neighbor of neighbors) {
                if (!isWithinBounds(neighbor) || !isWalkable(neighbor)) {
                    continue;
                }

                const g = currentNode.g + 1; // Custo do movimento até o vizinho (assumindo que a distância entre nós vizinhos é 1)
                const h = heuristic(neighbor, endPos);
                const newNode = createNode(neighbor, currentNode, g, h);

                // Verifica se o vizinho já está na lista de nós fechados
                if (closedList.some((node) => node.pos.x === neighbor.x && node.pos.y === neighbor.y)) {
                    continue;
                }

                // Verifica se o vizinho já está na lista de nós abertos
                const openNode = openList.find((node) => node.pos.x === neighbor.x && node.pos.y === neighbor.y);
                if (openNode) {
                    // Se o novo caminho para o vizinho for mais curto, atualize o nó com o novo caminho
                    if (g < openNode.g) {
                        openNode.g = g;
                        openNode.f = g + openNode.h;
                        openNode.parent = currentNode;
                    }
                } else {
                    // Adiciona o vizinho à lista de nós abertos
                    insertNode(openList, newNode);
                }
            }
        }

        // Não foi encontrado um caminho válido
        return null;
    }

    createGrid() {
        const tileSize = this.worldLayer.baseTileWidth; // Tamanho do tile (largura e altura)
        const layerWidth = this.worldLayer.width; // Largura da camada em tiles
        const layerHeight = this.worldLayer.height; // Altura da camada em tiles
        const grid = [];
      
        // Percorre cada tile na camada "worldLayer"
        for (let y = 0; y < layerHeight; y++) {
          grid[y] = [];
          for (let x = 0; x < layerWidth; x++) {
            const tile = this.worldLayer.getTileAt(x, y);
            if (tile && tile.collides) {
              grid[y][x] = 1; // Marca como obstáculo se o tile colidir
            } else {
              grid[y][x] = 0; // Marca como caminhável caso contrário
            }
          }
        }
      
        return grid;
    }

    exit() {
        const playerLocation = { x: this.player.x, y: this.player.y };
        const exitLocation = { x: 80 * TILESIZE, y: 7 * TILESIZE };

        if (Math.abs(playerLocation.x - exitLocation.x) <= 100 && Math.abs(playerLocation.y - exitLocation.y) <= 100 && this.hasKey) {
            this.next = true;
            this.ambienceSound.stop();
            this.entitySound.stop();
            this.keySound.stop();
            this.paperSound.stop();
            this.buttonSound.stop();
            this.soundtrack.stop();
            // Inicia a próxima cena após um tempo de espera
            setTimeout(() => {
                this.scene.start('TextScene', { text: 'Level 2 Text !', nextScene: 'LevelTwo' });
            }, 2000);
        }
    }
}