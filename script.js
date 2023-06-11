// import Frontrooms from './src/scenes/frontrooms.js';
import LastLevel from "./src/scenes/last_level.js";

const config = {
    type: Phaser.AUTO,
    width: 300,
    height: 300,
    parent: "game-container",
    backgroundColor: '#000000',
    pixelArt: true,
    zoom: 3,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 } // Top down game, so no gravity
        }
    },
    scene: LastLevel
};

const game = new Phaser.Game(config);