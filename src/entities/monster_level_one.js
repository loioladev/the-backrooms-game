export default class MonsterOne extends Phaser.GameObjects.Sprite {
    static createAnimation(scene, texture, frameConfig, animKey) {
        scene.anims.create({
            key: animKey + '_left',
            frames: scene.anims.generateFrameNumbers(texture, { ...frameConfig, start: frameConfig.leftStartFrame, end: frameConfig.leftEndFrame }),
            frameRate: frameConfig.frameRate,
            repeat: -1,
        });

        scene.anims.create({
            key: animKey + '_right',
            frames: scene.anims.generateFrameNumbers(texture, { ...frameConfig, start: frameConfig.rightStartFrame, end: frameConfig.rightEndFrame }),
            frameRate: frameConfig.frameRate,
            repeat: -1,
        });

        scene.anims.create({
            key: animKey + '_up',
            frames: scene.anims.generateFrameNumbers(texture, { ...frameConfig, start: frameConfig.upStartFrame, end: frameConfig.upEndFrame }),
            frameRate: frameConfig.frameRate,
            repeat: -1,
        });

        scene.anims.create({
            key: animKey + '_down',
            frames: scene.anims.generateFrameNumbers(texture, { ...frameConfig, start: frameConfig.downStartFrame, end: frameConfig.downEndFrame }),
            frameRate: frameConfig.frameRate,
            repeat: -1,
        });

        // Create the idle animation for the monster
        scene.anims.create({
            key: animKey + '_idle',
            frames: [{ key: texture, frame: frameConfig.idleFrame }],
            frameRate: frameConfig.frameRate,
        });

        return animKey;
    }

    constructor(scene, x, y, texture, animKey) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setTexture(texture);
        this.setPosition(x, y);

        this.animKey = animKey;
    }

    playAnimation(direction) {
        this.anims.play(this.animKey + '_' + direction, true);
    }
}