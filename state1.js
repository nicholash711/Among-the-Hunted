var player, keys, enemy, iceWalk, spin;
const SPEED = 500;

demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        game.load.spritesheet("seal", "assets/spritesheets/HarpSeal.png", 109, 74);
        game.load.spritesheet("hunter", "assets/spritesheets/hunter.png", 128, 128);
        game.load.tilemap("Map", "assets/tilemaps/Map.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("Ground", "assets/tilemaps/Ground.png");
        game.load.image("Rocks", "assets/tilemaps/Rocks.png");
        game.load.image("Water", "assets/tilemaps/Water.png");
        game.load.image("bullet", "assets/sprites/Bullet.png");
        game.load.audio("iceWalk", "assets/sounds/effects/iceStep.mp3");
        
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 3200, 3200);
        game.stage.backgroundColor = "#2b00ff";

        var map = game.add.tilemap("Map");
        map.addTilesetImage("Ground");
        map.addTilesetImage('Water');
        map.addTilesetImage('Rocks');
        bounds = map.createLayer("Background");
        rocks = map.createLayer("Collisions");
        water = map.createLayer("Water");
        map.setCollision(17, true, 'Water');
        map.setCollision(18, true, 'Collisions');

        player = game.add.sprite(200, game.world.centerY - 150, "seal");
        player.health = 100;
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(-0.8, 0.8)
        game.physics.enable(player);
        player.body.collideWorldBounds = true;
        game.camera.follow(player);
        player.animations.add("walk", [0, 1, 2]);
        player.animations.add("spin", [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);

        enemy = game.add.sprite(600, game.world.centerY - 150, "hunter", 1);
        enemy.health = 100;
        enemy.anchor.setTo(0.5, 0.5);
        enemy.scale.setTo(-1, 1);
        game.physics.enable(enemy);
        enemy.body.immovable = true;
        enemy.body.collideWorldBounds = true;
        enemy.animations.add("fall", [1, 2, 3, 4, 4, 4, 4, 4, 4]);


        keys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68, "spin": 32
        });
        keys.spin.onDown.add(doSpin, null, null, 133);

        shooting = game.add.emitter(600, game.world.centerY - 150, 5);
        shooting.makeParticles("bullet");
        shooting.setXSpeed(-400, 0);
        shooting.setYSpeed(-1, 1);
        shooting.on = false;

        iceWalk = game.add.audio("iceWalk", 1, true);
        game.sound.setDecodedCallback(iceWalk, start, this);
    },

    update: function (){
        game.physics.arcade.collide(player, rocks);
        game.physics.arcade.collide(player, water);
        game.physics.arcade.collide(player, enemy);


        enemyCheck();

        if(!player.animations.getAnimation("spin").isPlaying){
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
                if(!keys.left.isDown && !keys.right.isDown)
                    player.animations.stop("walk", true);
            }
            if(keys.left.isDown){
                player.scale.setTo(0.8, 0.8);
                player.body.velocity.x = -SPEED;
                player.animations.play("walk", 8, true);
            }
            else if(keys.right.isDown){
                player.scale.setTo(-0.8, 0.8);
                player.body.velocity.x = SPEED;
                player.animations.play("walk", 8, true);
            }
            else{
                player.body.velocity.x = 0;
                if(!keys.up.isDown && !keys.down.isDown)
                    player.animations.stop("walk", true);
            }
        } 
    }
};

function enemyDistanceCheck(){
    if(getDistance() <= 300){
        enemy.frame = 0;
        shooting.on = true;
    }
    else{
        enemy.frame = 1;
        shooting.on = false;
    }
};

function enemyCheck(){
    if(enemy.health <= 0){
        enemy.animations.play("fall", 8, false, true);
        shooting.on = false;
    }
    else{
        enemyDistanceCheck()
    }
}

function doSpin(i, range){
    console.log("spin");
    if(getDistance() <= range && !player.animations.getAnimation("spin").isPlaying){
        player.animations.play("spin", 36);
        enemy.health -= 50;
        console.log(enemy.health);
    }
}

function getDistance(){
    deltaX = player.x - enemy.x;
    deltaY = player.y - enemy.y;
    return Math.hypot(deltaX, deltaY);
}

function start(){
    for(key in keys){
        keys[key].onDown.add(playFx);
        keys[key].onUp.add(stopSound);
    }
}

function playFx(){
    if(!iceWalk.isPlaying && !player.animations.getAnimation("spin").isPlaying)
        iceWalk.play();
}

function stopSound(){
    if(!keys.up.isDown && !keys.down.isDown && !keys.left.isDown && !keys.right.isDown)
        iceWalk.stop();
}
