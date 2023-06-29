export default class PlayerOne extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureLantern, texturePlayer) {
        super(scene, x, y, textureLantern, texturePlayer);
        this.lanternPlayer = false;

        // Add player sprite to scene
        scene.add.existing(this);

        // Add physics body to player sprite
        scene.physics.add.existing(this);

        // Create lantern player animations
        this.idle = 'idle-front';
        this.idleFlip = false;
        const frameRateAnims = 6;
        scene.anims.create({
            key: 'idle-front1',
            frames: [{ key: textureLantern, frame: 0 }],
            frameRate: frameRateAnims,
        });

        scene.anims.create({
            key: 'idle-back1',
            frames: [{ key: textureLantern, frame: 8 }],
            frameRate: frameRateAnims,
        });

        scene.anims.create({
            key: 'idle-side1',
            frames: [{ key: textureLantern, frame: 4 }],
            frameRate: frameRateAnims,
        });

        scene.anims.create({
            key: 'run-down1',
            frames: scene.anims.generateFrameNumbers(textureLantern, { start: 0, end: 3 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-horizontal1',
            frames: scene.anims.generateFrameNumbers(textureLantern, { start: 4, end: 7 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-top1',
            frames: scene.anims.generateFrameNumbers(textureLantern, { start: 8, end: 11 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-diagonal-top1',
            frames: scene.anims.generateFrameNumbers(textureLantern, { start: 12, end: 15 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-diagonal-bottom1',
            frames: scene.anims.generateFrameNumbers(textureLantern, { start: 16, end: 19 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        // Create player animations
        scene.anims.create({
            key: 'idle-front',
            frames: [{ key: texturePlayer, frame: 0 }],
            frameRate: frameRateAnims,
        });

        scene.anims.create({
            key: 'idle-back',
            frames: [{ key: texturePlayer, frame: 8 }],
            frameRate: frameRateAnims,
        });

        scene.anims.create({
            key: 'idle-side',
            frames: [{ key: texturePlayer, frame: 4 }],
            frameRate: frameRateAnims,
        });

        scene.anims.create({
            key: 'run-down',
            frames: scene.anims.generateFrameNumbers(texturePlayer, { start: 0, end: 3 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-horizontal',
            frames: scene.anims.generateFrameNumbers(texturePlayer, { start: 4, end: 7 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-top',
            frames: scene.anims.generateFrameNumbers(texturePlayer, { start: 8, end: 11 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-diagonal-top',
            frames: scene.anims.generateFrameNumbers(texturePlayer, { start: 12, end: 15 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });

        scene.anims.create({
            key: 'run-diagonal-bottom',
            frames: scene.anims.generateFrameNumbers(texturePlayer, { start: 16, end: 19 }),
            frameRate: frameRateAnims,
            repeat: -1,
        });
        // Set default animation
        this.anims.play(this.idle);
    }

    update(cursors, speed) {
        this.setVelocity(0);
        this.flipX = false;
        if (this.lanternPlayer) {
            if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
                this.anims.play(this.idle, true);
                this.flipX = this.idleFlip;
                return;
            }

            // Left movement
            if (cursors.left.isDown && cursors.up.isDown) {
                this.setVelocity(-speed, -speed);
                this.anims.play('run-diagonal-top1', true);
                this.idle = 'idle-back1'
                this.idleFlip = false
            }
            else if (cursors.left.isDown && cursors.down.isDown) {
                this.setVelocity(-speed, speed);
                this.anims.play('run-diagonal-bottom1', true);
                this.flipX = true;
                this.idle = 'idle-front1'
                this.idleFlip = false;
            }
            else if (cursors.left.isDown) {
                this.setVelocity(-speed, 0);
                this.anims.play('run-horizontal1', true);
                this.idle = 'idle-side1'
                this.idleFlip = false;

            }
            // Right movement
            else if (cursors.right.isDown && cursors.up.isDown) {
                this.setVelocity(speed, -speed);
                this.anims.play('run-diagonal-top1', true);
                this.flipX = true;
                this.idle = 'idle-back1'
                this.idleFlip = true;
            }
            else if (cursors.right.isDown && cursors.down.isDown) {
                this.setVelocity(speed, speed);
                this.anims.play('run-diagonal-bottom1', true);
                this.idle = 'idle-front1'
                this.idleFlip = false;
            }
            else if (cursors.right.isDown) {
                this.setVelocity(speed, 0);
                this.anims.play('run-horizontal1', true);
                this.flipX = true;
                this.idle = 'idle-side1'
                this.idleFlip = true;

            }
            // Up movement
            else if (cursors.up.isDown) {
                this.setVelocity(0, -speed);
                this.anims.play('run-top1', true);
                this.idle = 'idle-back1'
                this.idleFlip = false;
            }
            // Down movement
            else {
                this.setVelocity(0, speed);
                this.anims.play('run-down1', true);
                this.idle = 'idle-front1'
                this.idleFlip = false;
            }
        }
        else {
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

    createFogOfWar(scene, texture_mask, scale=0.3, fill=0.9) {
        // Make fog of war effect
        const width = scene.scale.width * 2;
        const height = scene.scale.height * 2;
        
        this.rt = scene.make.renderTexture({
            width,
            height
        }, true)
        this.rt.fill(0x000000, fill)
        this.rt.setDepth(100)
        this.vision = scene.make.image({
            x: this.x,
            y: this.y,
            key: texture_mask,
            add: false
        })
        this.vision.scale = scale
        this.vision.setPosition(this.x, this.y)
        this.rt.mask = new Phaser.Display.Masks.BitmapMask(scene, this.vision)
        this.rt.mask.invertAlpha = true
    }

    updateFogOfWar() {
        this.rt.x = this.x;
        this.rt.y = this.y;
        this.vision.x = this.x;
        this.vision.y = this.y;
    }


    hideFogOfWar() {
        this.rt.x = 0;
        this.rt.y = -50;
        this.vision.x = 0;
        this.vision.y = -50;
    }

    setSkin(boolean) {
        this.lanternPlayer = boolean;
    }
}
