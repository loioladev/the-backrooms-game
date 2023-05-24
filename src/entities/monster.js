const idleAnimation = 'idle';
const huntingAnimation = 'hunting';

export default class Monster extends Phaser.Physics.Arcade.Sprite {
    static createAnimation(scene, texture, endFrame, frameRate, monster_type) {
        scene.anims.create({
            key: monster_type + '-' + idleAnimation,
            frames: [{ key: texture, frame: 0 }],
            frameRate: frameRate,
        });
        scene.anims.create({
            key: monster_type + '-' + huntingAnimation,
            frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: endFrame }),
            frameRate: frameRate,
            repeat: -1,
        });
    }

    constructor(scene, x, y, texture, monster_type) {
        super(scene, x, y, texture);

        // Add player sprite to scene
        scene.add.existing(this);

        // Add physics body to player sprite
        scene.physics.add.existing(this);

        if (monster_type == 'devour') {
            Monster.createAnimation(scene, texture, 7, 8, monster_type);
        } else if (monster_type == 'lantern') {
            Monster.createAnimation(scene, texture, 5, 6, monster_type);
        } else if (monster_type == 'walker') {
            Monster.createAnimation(scene, texture, 3, 6, monster_type);
        } else if (monster_type == 'partygoer') {
            Monster.createAnimation(scene, texture, 3, 6, monster_type);
        } else if (monster_type == 'meatball') {
            Monster.createAnimation(scene, texture, 5, 6, monster_type);
        } else {
            Monster.createAnimation(scene, texture, 5, 6, monster_type);
        }

        this.anims.play(monster_type + '-' + huntingAnimation, true);

        this.directionX = 0;
        this.directionY = 0;
    }

    update() {
        this.anims.play(monster_type + '-' + huntingAnimation, true)
    }

    random_movement(velocity, time){
        if (time % 60 == 0){
            this.directionX = Math.floor(Math.random() * 3);
            this.directionY = Math.floor(Math.random() * 3);
        }

        if (this.directionY == 0)
            this.setVelocityY(velocity); // down
        else if (this.directionY == 1)
            this.setVelocityY(-velocity); // up
        else
            this.setVelocityY(0); // stop

        if (this.directionX == 0){
            this.setVelocityX(velocity); // right
            this.flipX = false;
        }
        else if (this.directionX == 1){
            this.setVelocityX(-velocity); // left
            this.flipX = true;
        }
        else
            this.setVelocityX(0); // stop
    }
}