export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // Add player sprite to scene
        scene.add.existing(this);

        // Add physics body to player sprite
        scene.physics.add.existing(this);

        // Create player animations
        this.idle = 'idle-front';
        this.idleFlip = false;
        const frameRateAnims = 6;
        scene.anims.create({
            key: 'idle-front',
            frames: [{ key: texture, frame: 0 }],
            frameRate: frameRateAnims,
        });

        scene.anims.create({
            key: 'idle-back',
            frames: [{ key: texture, frame: 8 }],
            frameRate: frameRateAnims,
        });

        scene.anims.create({
            key: 'idle-side',
            frames: [{ key: texture, frame: 4 }],
            frameRate: frameRateAnims,
        });

        scene.anims.create({
            key: 'run-down',
            frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-horizontal',
            frames: scene.anims.generateFrameNumbers(texture, { start: 4, end: 7 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-top',
            frames: scene.anims.generateFrameNumbers(texture, { start: 8, end: 11 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-diagonal-top',
            frames: scene.anims.generateFrameNumbers(texture, { start: 12, end: 15 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-diagonal-bottom',
            frames: scene.anims.generateFrameNumbers(texture, { start: 16, end: 19 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        // Set default animation
        this.anims.play(this.idle);
    }

    update(cursors, speed) {
        this.setVelocity(0);
        this.flipX = false;
        if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            this.anims.play(this.idle, true);
            this.flipX = this.idleFlip;
            return;
        }

        // Left movement
        if (cursors.left.isDown && cursors.up.isDown) {
            this.setVelocity(-speed, -speed);
            this.anims.play('run-diagonal-top', true);
            this.idle = 'idle-back'
            this.idleFlip = false
        }
        else if (cursors.left.isDown && cursors.down.isDown) {
            this.setVelocity(-speed, speed);
            this.anims.play('run-diagonal-bottom', true);
            this.flipX = true;
            this.idle = 'idle-front'
            this.idleFlip = false;
        }
        else if (cursors.left.isDown) {
            this.setVelocity(-speed, 0);
            this.anims.play('run-horizontal', true);
            this.idle = 'idle-side'
            this.idleFlip = false;

        }
        // Right movement
        else if (cursors.right.isDown && cursors.up.isDown) {
            this.setVelocity(speed, -speed);
            this.anims.play('run-diagonal-top', true);
            this.flipX = true;
            this.idle = 'idle-back'
            this.idleFlip = true;
        }
        else if (cursors.right.isDown && cursors.down.isDown) {
            this.setVelocity(speed, speed);
            this.anims.play('run-diagonal-bottom', true);
            this.idle = 'idle-front'
            this.idleFlip = false;
        }
        else if (cursors.right.isDown) {
            this.setVelocity(speed, 0);
            this.anims.play('run-horizontal', true);
            this.flipX = true;
            this.idle = 'idle-side'
            this.idleFlip = true;

        }
        // Up movement
        else if (cursors.up.isDown) {
            this.setVelocity(0, -speed);
            this.anims.play('run-top', true);
            this.idle = 'idle-back'
            this.idleFlip = false;
        }
        // Down movement
        else {
            this.setVelocity(0, speed);
            this.anims.play('run-down', true);
            this.idle = 'idle-front'
            this.idleFlip = false;
        }
    }
}
