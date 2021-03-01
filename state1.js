var player, keys, enemy, iceWalk;
const SPEED = 200;

demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        game.load.spritesheet("seal", "assets/sprites/HarpSeal.png", 109, 74);
        game.load.spritesheet("hunter", "assets/sprites/hunter.png", 64, 64);
        game.load.tilemap("mapTest", "assets/tilemaps/demomap.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("Ground", "assets/tilemaps/set_01.png");
        game.load.image("bullet", "assets/sprites/Bullet.png");
        game.load.audio("iceWalk", "assets/sounds/effects/iceStep.mp3");
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 640, 480);
        game.stage.backgroundColor = "#2b00ff";
        //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        var map = game.add.tilemap("mapTest");
        map.addTilesetImage("Ground");
        bounds = map.createLayer("Background");

        player = game.add.sprite(200, game.world.centerY, "seal");
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(-0.8, 0.8)
        game.physics.enable(player);
        player.body.collideWorldBounds = true;
        game.camera.follow(player);
        player.animations.add("walk", [0, 1, 2]);

        enemy = game.add.sprite(600, game.world.centerY, "hunter", 1);
        enemy.anchor.setTo(0.5, 0.5);
        enemy.scale.setTo(-2, 2);
        game.physics.enable(enemy);
        enemy.body.immovable = true;
        enemy.body.collideWorldBounds = true;

        iceWalk = game.add.audio("iceWalk", 1, true);

        keys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68
        });

        shooting = game.add.emitter(600, game.world.centerY, 100);
        shooting.makeParticles("bullet");
        shooting.setXSpeed(-100, 0);
        shooting.setYSpeed(-1, 1);
        shooting.setPaused(true)
        game.sound.setDecodedCallback(iceWalk, start, this);
    },

    update: function (){
        game.physics.arcade.collide(player, enemy);

        checkShoot(300);

        if(keys.up.isDown){
            player.body.velocity.y = -SPEED;
            player.animations.play("walk", 8, true);
        }
        else if(keys.down.isDown){
            player.body.velocity.y = SPEED;
            player.animations.play("walk", 8, true);
        }
        else{
            player.body.velocity.y = 0;
            if(!keys.left.isDown && !keys.right.isDown){
                player.animations.stop("walk");
                player.frame = 0;
            }
        }
        if(keys.left.isDown){
            player.body.velocity.x = -SPEED;
            player.scale.setTo(0.8, 0.8);
            player.animations.play("walk", 8, true);
        }
        else if(keys.right.isDown){
            player.body.velocity.x = SPEED;
            player.scale.setTo(-0.8, 0.8);
            player.animations.play("walk", 8, true);
        }
        else{
            player.body.velocity.x = 0;
            if(!keys.up.isDown && !keys.down.isDown){
                player.animations.stop("walk");
                player.frame = 0;
            };
        }
    }
};

function checkShoot(range){
    deltaX = player.x - enemy.x;
    deltaY = player.y - enemy.y;
    distance = Math.hypot(deltaX, deltaY);
    if(distance <= range){
        enemy.frame = 0;
        shooting.setPause(false);
    }
    else{
        enemy.frame = 1;
        shooting.setPause(true);
    }
};

function start(){
    keys.up.onDown.add(playFx);
    keys.down.onDown.add(playFx);
    keys.left.onDown.add(playFx);
    keys.right.onDown.add(playFx);
    keys.up.onUp.add(stopSound);
    keys.down.onUp.add(stopSound);
    keys.left.onUp.add(stopSound);
    keys.right.onUp.add(stopSound);
}

function playFx(){
    if(!iceWalk.isPlaying)
        iceWalk.play();
}

function stopSound(){
    if(!keys.up.isDown && !keys.down.isDown && !keys.left.isDown && !keys.right.isDown)
        iceWalk.stop();
}
