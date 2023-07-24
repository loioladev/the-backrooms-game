const idleAnimation = 'idle';
const huntingAnimation = 'hunting';

export default class MonsterOne extends Phaser.Physics.Arcade.Sprite {
    static createAnimation(scene, texture, endFrame, frameRate, animationsConfig) {
        scene.anims.create({
            key: animationsConfig.idle,
            frames: [{ key: texture, frame: animationsConfig.idleFrame }],
            frameRate: frameRate,
        });
        scene.anims.create({
            key: animationsConfig.hunting,
            frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: endFrame }),
            frameRate: frameRate,
            repeat: -1,
        });

        // Create animations for individual movement directions for each monster
        scene.anims.create({
            key: animationsConfig.left,
            frames: scene.anims.generateFrameNumbers(texture, { start: animationsConfig.leftStartFrame, end: animationsConfig.leftEndFrame }),
            frameRate: frameRate,
            repeat: -1,
        });
        scene.anims.create({
            key: animationsConfig.right,
            frames: scene.anims.generateFrameNumbers(texture, { start: animationsConfig.rightStartFrame, end: animationsConfig.rightEndFrame }),
            frameRate: frameRate,
            repeat: -1,
        });
        scene.anims.create({
            key: animationsConfig.up,
            frames: scene.anims.generateFrameNumbers(texture, { start: animationsConfig.upStartFrame, end: animationsConfig.upEndFrame }),
            frameRate: frameRate,
            repeat: -1,
        });
        scene.anims.create({
            key: animationsConfig.down,
            frames: scene.anims.generateFrameNumbers(texture, { start: animationsConfig.downStartFrame, end: animationsConfig.downEndFrame }),
            frameRate: frameRate,
            repeat: -1,
        });
    }

    static monsterCount = 1; // Inicializa o contador para os monstros

    constructor(scene, x, y, texture, animationsConfig = {}) {
        super(scene, x, y, texture);

        // Add player sprite to scene
        scene.add.existing(this);

        // Add physics body to player sprite
        scene.physics.add.existing(this);

        // Incrementa o contador e atribui um identificador único para o monstro
        const monsterId = `monster${MonsterOne.monsterCount++}`;

        const defaultAnimationsConfig = {
            idle: monsterId + '-' + idleAnimation,
            hunting: monsterId + '-' + huntingAnimation,
            left: monsterId + '-left',
            right: monsterId + '-right',
            up: monsterId + '-up',
            down: monsterId + '-down',
        };

        const mergedAnimationsConfig = { ...defaultAnimationsConfig, ...animationsConfig };

        MonsterOne.createAnimation(scene, texture, animationsConfig.huntingEndFrame, animationsConfig.frameRate, mergedAnimationsConfig);

        this.anims.play(mergedAnimationsConfig.hunting, true);

        this.directionX = 0;
        this.directionY = 0;
    }

    update() {
        // Adjust the animation based on the directionX and directionY properties
        const currentAnim = this.anims.currentAnim.key;
        if (currentAnim.endsWith('-' + huntingAnimation) && (this.directionX !== 0 || this.directionY !== 0)) {
            // Switch to movement animations while hunting animation is playing
            if (this.directionX < 0) {
                this.anims.play(this.anims.currentAnim.key.replace('-' + huntingAnimation, '-left'), true);
            } else if (this.directionX > 0) {
                this.anims.play(this.anims.currentAnim.key.replace('-' + huntingAnimation, '-right'), true);
            } else if (this.directionY < 0) {
                this.anims.play(this.anims.currentAnim.key.replace('-' + huntingAnimation, '-up'), true);
            } else if (this.directionY > 0) {
                this.anims.play(this.anims.currentAnim.key.replace('-' + huntingAnimation, '-down'), true);
            }
        } else if (currentAnim.startsWith('monster') && (this.directionX === 0 && this.directionY === 0)) {
            // Switch to idle animation while movement animations are playing
            this.anims.play(currentAnim.replace('-left', '').replace('-right', '').replace('-up', '').replace('-down', '') + '-' + idleAnimation, true);
        }
    }
}