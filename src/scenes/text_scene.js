export default class TextScene extends Phaser.Scene {
    constructor() {
        super('TextScene');
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
                this.scene.start(this.nextScene);
            });
        }, 6000);
    }
}