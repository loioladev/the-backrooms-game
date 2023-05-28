import Player from '../entities/player.js';
import TextScene from './text_scene.js';
import LevelZero from "./level_zero.js";
import LevelOne from "./level_one.js";
import LevelTwo from "./level_two.js";
import LastLevel from "./last_level.js";

export default class Frontrooms extends Phaser.Scene {
    constructor(){
        super('Frontrooms');
        this.player = null;
        this.cursors = null;
    }

    preload() {
        this.load.image('logo', 'assets/menu_logo.png')
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
        decorationLayer.setDepth(10);

        this.player = new Player(this, 155, 270, 'player-frontrooms');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, buildingsLayer);
        this.physics.add.collider(this.player, decorationLayer);

        this.scene.add('TextScene', TextScene, false)
        this.scene.add('LevelZero', LevelZero, false)
        this.scene.add('LevelOne', LevelOne, false)
        this.scene.add('LevelTwo', LevelTwo, false)
        this.scene.add('LastLevel', LastLevel, false)

        this.add.image(150, 60, 'logo').setDepth(11).setScale(0.3)
        this.add.text(30, 105, 'The Backrooms', { fontSize: '32px', fill: '#000000', fontFamily: 'Lucida Console', stroke: '#000000', strokeThickness: 2 }).setDepth(11)
        const startButton = this.add.text(80, 145, 'Começar Jogo', { fontSize: '18px', fill: '#000000', stroke: '#ffffff', strokeThickness: 2, fontFamily: 'Lucida Console' })
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