var player, keys, enemy, iceWalk;
const SPEED = 500;

demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        game.load.spritesheet("seal", "assets/spritesheets/HarpSeal.png", 109, 74);
        game.load.spritesheet("hunter", "assets/spritesheets/hunter.png", 128, 128);
        game.load.tilemap("Map", "assets/tilemaps/Map.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("Ground", "assets/tilemaps/set_01.png");
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
        
        player = game.add.sprite(200, game.world.centerY - 150, "seal");
        player.health = 100;
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(-0.8, 0.8)
        game.physics.enable(player);
        player.body.collideWorldBounds = true;
        game.camera.follow(player);
        player.animations.add("walk", [0, 1, 2]);

        enemy = game.add.sprite(600, game.world.centerY - 150, "hunter", 1);
        enemy.health = 100;
        enemy.anchor.setTo(0.5, 0.5);
        enemy.scale.setTo(-1, 1);
        game.physics.enable(enemy);
        enemy.body.immovable = true;
        enemy.body.collideWorldBounds = true;


        keys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68
        });

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
        shooting.on = true;
    }
    else{
        enemy.frame = 1;
        shooting.on = false;
    }
};

function attack(range){
    deltaX = player.x - enemy.x;
    deltaY = player.y - enemy.y;
    distance = Math.hypot(deltaX, deltaY);
    if(distance <= range){
        
    }
    else{

    }
}

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
