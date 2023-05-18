import LevelZero from "./level_zero.js";
import LevelOne from "./level_one.js";
import LevelTwo from "./level_two.js";
import LastLevel from "./last_level.js";

export default class TextScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TextScene' });
        this.text = null;
        this.nextScene = null;
    }

    create(data) {
        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(2000);
        this.text = data.text;

        const textConfig = {
            fontSize: '16px',
            fill: '#ffffff',
            wordWrap: {
                width: 300
            }
        };
        this.add.text(0, 100, this.text, textConfig);

        setTimeout(() => {
            this.cameras.main.fadeOut(2000);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.nextScene = data.nextScene;
                switch (this.nextScene) {
                    case 'LevelZero':
                        this.scene.add(this.nextScene, LevelZero, false)
                        this.scene.start(this.nextScene);
                        break;
                    case 'LevelOne':
                        this.scene.add(this.nextScene, LevelOne, false)
                        this.scene.start(this.nextScene);
                        break;
                    case 'LevelTwo':
                        this.scene.add(this.nextScene, LevelTwo, false)
                        this.scene.start(this.nextScene);
                        break;
                    case 'LastLevel':
                        this.scene.add(this.nextScene, LastLevel, false)
                        this.scene.start(this.nextScene);
                        break;
                }
            });
        }, 10000);
    }
}