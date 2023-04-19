class Frontrooms extends Phaser.Scene {
    constructor() {
        super({ key: 'frontrooms' });
    }
    preload() {

    }
    create() {

    }
    update() {

    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    parent: 'game-container',
    pixelArt: true,
    scene: Frontrooms
};

const game = new Phaser.Game(config);