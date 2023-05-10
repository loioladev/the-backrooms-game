import LevelZero from './src/scenes/level_zero.js';
import LevelOne from './src/scenes/level_one.js';
import LevelTwo from './src/scenes/level_two.js';
import LastLevel from './src/scenes/last_level.js';

const config = {
    type: Phaser.AUTO,
    width: 300,
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
    scene: [LevelZero, LevelOne, LevelTwo, LastLevel]
};

const game = new Phaser.Game(config);