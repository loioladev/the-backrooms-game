import Player from '../entities/player.js';
import Monster from '../entities/monster.js';

export default class LevelOne extends Phaser.Scene {
    constructor() {
        super('LevelOne');
    }

    preload() {
        this.load.image('tiles-level-one', 'assets/tilemaps/level1_template.png');
        this.load.tilemapTiledJSON('map-level-one', 'assets/tilemaps_json/level1.json');
        this.load.spritesheet('player-level-one', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('lantern', 'assets/sprites/lantern.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('devour', 'assets/sprites/devour.png', { frameWidth: 32, frameHeight: 32 })
        this.load.image('dark', 'assets/mask.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'map-level-one' });
        const tileset = map.addTilesetImage('level1_template', 'tiles-level-one');

        const worldLayer = map.createLayer('World', tileset, 0, 0).setDepth(0);
        const wallLayer = map.createLayer('Wall', tileset, 0, 0).setDepth(1);
        const decorationLayer = map.createLayer('Decoration', tileset, 0, 0).setDepth(2);
        const aboveLayer = map.createLayer('Above', tileset, 0, 0).setDepth(3);
        const playerLayer = this.add.layer().setDepth(4);
        const borderLayer = map.createLayer('Border', tileset, 0, 0).setDepth(5);

        worldLayer.setCollisionByProperty({ collider: true });
        decorationLayer.setCollisionByProperty({ collider: true });
        wallLayer.setCollisionByProperty({ collider: true });
        borderLayer.setCollisionByProperty({ collider: true });

        // Create the player with physics
        const spawnPoint = map.findObject("Player", obj => obj.name === "spawnpoint");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player-level-one');
        playerLayer.add(this.player);

        // Configurar a ordem de sobreposição das camadas
        this.children.bringToTop(worldLayer);
        this.children.bringToTop(wallLayer);
        this.children.bringToTop(decorationLayer);
        this.children.bringToTop(aboveLayer);
        this.children.bringToTop(playerLayer);
        this.children.bringToTop(borderLayer);

        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, decorationLayer);
        this.physics.add.collider(this.player, wallLayer);

        // Make camera follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Make fog of war effect
        this.player.createFogOfWar(this, 'dark');

        this.monster1 = new Monster(this, 534, 334, 'lantern', 'lantern');
        this.monster1.setSize(10, 16);
        this.monster2 = new Monster(this, 834, 334, 'devour', 'devour');
        this.monster2.setSize(10, 16);

        // Add collision between monster and world/decoration
        this.physics.add.collider(this.monster1, worldLayer);
        this.physics.add.collider(this.monster1, decorationLayer);
        this.physics.add.collider(this.monster2, worldLayer);
        this.physics.add.collider(this.monster2, decorationLayer);

        // Add collision between player and monster
        this.physics.add.collider(this.player, this.monster1, this.handleMonsterCollision, null, this);
        this.physics.add.collider(this.player, this.monster2, this.handleMonsterCollision, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('LevelTwo');
        });

        // Variáveis de controle
        this.lightMaskActive = false; // Inicialmente a máscara de luz está ativa
        this.maskDuration = 30000; // Duração total em milissegundos (1 minuto)
        this.maskDisabledDuration = 60000; // Duração em milissegundos para a máscara desativada (30 segundos)
        this.maskTimer = this.time.addEvent({
            delay: this.maskDuration,
            callback: this.toggleLightMask,
            callbackScope: this,
            loop: true
        });
    } 

    update() {
        const speed = 80; // pixels por segundo
        this.player.update(this.cursors, speed);

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

            // Atualizar o efeito da máscara de luz do jogador
            this.player.updateFogOfWar();
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

            this.player.hideFogOfWar();
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
        this.player.disableInteractive();
        this.player.body.enable = false; // Disable player physics
        this.player.setTint(0xff0000); // Set player tint to red
        this.player.anims.play(this.player.idle, true); // Play player idle animation

        this.cameras.main.fadeOut(2000);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('TextScene', { text: 'Você morreu. Tente novamente.', nextScene: 'LevelZero' });
        });
    }
}