import Player from '../entities/player.js';
import TextScene from './text_scene.js';

export default class Frontrooms extends Phaser.Scene {
    constructor() {
        super('Frontrooms')
    }

    preload() {
        this.load.image('tiles-frontrooms', 'assets/tilemaps/frontrooms_template.png');
        this.load.tilemapTiledJSON('map-frontrooms', 'assets/tilemaps_json/frontrooms.json');
        this.load.spritesheet('player-frontrooms', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
    }
    
    create() {
        this.cameras.main.setBackgroundColor('#000000');
        const map = this.make.tilemap({ key: 'map-frontrooms' });
        const tileset = map.addTilesetImage('frontrooms', 'tiles-frontrooms');

        const floorLayer = map.createLayer('floor', tileset, -8, 0);
        const buildingsLayer = map.createLayer('buildings', tileset, -8, 0);
        const decorationLayer = map.createLayer('decoration', tileset, -8, 0);
        buildingsLayer.setCollisionByProperty({ collider: true });
        decorationLayer.setCollisionByProperty({ collider: true });

        this.player = new Player(this, 155, 270, 'player-frontrooms');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, buildingsLayer);
        this.physics.add.collider(this.player, decorationLayer);

        this.scene.add('TextScene', TextScene, false)
        const startButton = this.add.text(100, 100, 'Começar Jogo', { fontSize: '16px', fill: '#000000' })
            .setInteractive()
            .on('pointerdown', () => {
                this.tweens.add({
                    targets: [startButton, this.player],
                    alpha: 0,
                    duration: 500, // Adjust the duration as needed
                    onComplete: () => {
                        this.cameras.main.fadeOut(2000);
                        this.cameras.main.once('camerafadeoutcomplete', () => {
                            this.scene.start('TextScene', { text: 'Você noclipou da realidade nas áreas erradas e apareceu nas Backrooms. Deus o salve se você ouvir algo vagando por perto, pois com toda certeza ele ouviu você.', nextScene: 'LevelZero' });
                        });
                    }
                });
            });
    }
    update() {
        const speed = 60; // pixels per second
        this.player.update(this.cursors, speed);
        
    }
}