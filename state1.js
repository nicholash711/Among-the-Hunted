var player, moveKeys, enemies, iceWalk, spin, sealSpin, hunterFall, hunterGun;
const SPEED = 500, WORLD_LENGTH = 3200, WORLD_HEIGHT = 3200;

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
        game.load.audio("sealSpin", "assets/sounds/effects/sealSpin.mp3");
        game.load.audio("hunterFall", "assets/sounds/effects/hunterFall.mp3");
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, WORLD_LENGTH, WORLD_HEIGHT);
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

        player = game.add.sprite(game.world.centerX, game.world.centerY, "seal");
        player.health = 100;
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(-0.8, 0.8)
        game.physics.enable(player);
        player.body.collideWorldBounds = true;
        game.camera.follow(player);
        player.animations.add("walk", [0, 1, 2]);
        player.animations.add("spin", [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        for(var i = 0; i < 10; i++){
            enemies.create(Math.floor(Math.random()*WORLD_LENGTH), Math.floor(Math.random()*WORLD_HEIGHT), "hunter", 1);
        }
        enemies.setAll("health", 100);
        enemies.setAll("anchor.x", 0.5);
        enemies.setAll("anchor.y", 0.5);
        enemies.setAll("scale.x", 1);
        enemies.setAll("scale.y", 1);
        enemies.setAll("body.immovable", true);
        enemies.setAll("body.collideWorldBounds", true);
        enemies.forEach(function(enemy){
            enemy.animations.add("fall", [1, 2, 3, 4, 4, 4, 4]);
        }, this);

        moveKeys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68
        });
        spin = game.input.keyboard.addKey(32);
        spin.onDown.add(doSpin, null, null, 133);

        hunterGun = game.add.weapon(10, "bullet", null, enemies);
        hunterGun.bulletKillDistance = 100;
        hunterGun.bullterKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        hunterGun.fireRate = 600;
        hunterGun.bulletSpeed = 400;
        hunterGun.bulletClass.physicsBodyType = Phaser.Physics.ARCADE;
        // enemies.forEach(function(enemy){
        //     hunterGun.trackSprite(enemy, 0, 0, true);
        // }, this);




        // check collision with bullets
        hunterGun.bullets.onCollide.add(updateHealth);


        iceWalk = game.add.audio("iceWalk", 1, true);
        sealSpin = game.add.audio("sealSpin", 1);
        hunterFall = game.add.audio("hunterFall", 1);
        game.sound.setDecodedCallback(iceWalk, start, this);
    },

    update: function (){       
        game.physics.arcade.collide(player, water);
        game.physics.arcade.collide(player, rocks);
        game.physics.arcade.collide(player, enemies);
        game.physics.arcade.collide(player, hunterGun.bulletClass, function(){
            player.health -= 1;
            console.log(player.heatlh);
        });
        
        enemies.forEachAlive(enemyCheck, this);
        
        if(!player.animations.getAnimation("spin").isPlaying){
            if(moveKeys.up.isDown){
                player.body.velocity.y = -SPEED;
                player.animations.play("walk", 8, true);
            }
            else if(moveKeys.down.isDown){
                player.body.velocity.y = SPEED;
                player.animations.play("walk", 8, true);
            }
            else{
                player.body.velocity.y = 0;
                if(!moveKeys.left.isDown && !moveKeys.right.isDown)
                    player.animations.stop("walk", true);
            }
            if(moveKeys.left.isDown){
                player.scale.setTo(0.8, 0.8);
                player.body.velocity.x = -SPEED;
                player.animations.play("walk", 8, true);
            }
            else if(moveKeys.right.isDown){
                player.scale.setTo(-0.8, 0.8);
                player.body.velocity.x = SPEED;
                player.animations.play("walk", 8, true);
            }
            else{
                player.body.velocity.x = 0;
                if(!moveKeys.up.isDown && !moveKeys.down.isDown)
                    player.animations.stop("walk", true);
            }
        } 
    }
};

function enemyDistanceCheck(enemy){
    if(getDistance(enemy) <= 300){
        if(player.x - enemy.x > 0)
            enemy.scale.setTo(1, 1);
        else
            enemy.scale.setTo(-1, 1);
        enemy.frame = 0;
        hunterGun.fire(enemy, player.x, player.y);
    }
    else{
        enemy.frame = 1;
    }
};

function enemyCheck(enemy){
    if(enemy.health <= 0){
        enemy.animations.play("fall", 8, false, true);
        hunterFall.play();
        enemy.alive = false;
    }
    else{
        enemyDistanceCheck(enemy);
    }
}

function doSpin(i, range){
    console.log("spin");
    enemies.forEachAlive(function(enemy){
        if(getDistance(enemy) <= range && !player.animations.getAnimation("spin").isPlaying){
            player.body.velocity.x = 0, player.body.velocity.y = 0;
            player.animations.play("spin", 36);
            sealSpin.play();
            enemy.health -= 50;
            console.log(enemy.health);
        }
    }, this);        
}

function getDistance(enemy){
    deltaX = player.x - enemy.x;
    deltaY = player.y - enemy.y;
    return Math.hypot(deltaX, deltaY);
}

function start(){
    for(key in moveKeys){
        moveKeys[key].onDown.add(function(){
            if(!iceWalk.isPlaying && !player.animations.getAnimation("spin").isPlaying)
                iceWalk.play();
        });
        moveKeys[key].onUp.add(function(){
            if(!moveKeys.up.isDown && !moveKeys.down.isDown && !moveKeys.left.isDown && !moveKeys.right.isDown)
                iceWalk.stop();
        });
    }
}

updateHealth(){
    player.health -= 10;
}