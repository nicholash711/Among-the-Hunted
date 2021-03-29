var player, moveKeys, enemies, iceWalk, spin, sealSpin, hunterFall, hunterGun, map, healthBar, energyBar, energy, graphics;
const SPEED = 500, WORLD_LENGTH = 3200, WORLD_HEIGHT = 3200;

demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        game.load.spritesheet("seal", "assets/spritesheets/HarpSeal.png", 109, 74);
        game.load.spritesheet("hunter", "assets/spritesheets/hunter.png", 128, 128);
        game.load.spritesheet("healthBar", "assets/spritesheets/healthBar.png", 102, 12);
        game.load.spritesheet("energyBar", "assets/spritesheets/EnergyBar.png", 102, 12);
        game.load.tilemap("Map", "assets/tilemaps/Map.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("Ground", "assets/tilemaps/Ground.png");
        game.load.image("Rocks", "assets/tilemaps/Rocks.png");
        game.load.image("Water", "assets/tilemaps/Water.png");
        game.load.image("bullet", "assets/sprites/Bullet.png");
        game.load.image("startButton", "assets/sprites/StartButton.png");
        game.load.image("fish", "assets/sprites/Fish.png");
        game.load.audio("iceWalk", "assets/sounds/effects/iceStep.mp3");
        game.load.audio("sealSpin", "assets/sounds/effects/sealSpin.mp3");
        game.load.audio("hunterFall", "assets/sounds/effects/hunterFall.mp3");
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, WORLD_LENGTH, WORLD_HEIGHT);
        game.stage.backgroundColor = "#2b00ff";

        map = game.add.tilemap("Map");
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
        player.animations.add("jab", [26, 27, 27, 28, 28, 29, 29, 30]);

        //health bar
        healthBar = game.add.sprite(-52, 37, "healthBar");
        player.addChild(healthBar);
        
        //Energy bar WIP
        energyBar = game.add.sprite(10, 10, "energyBar");
        energyBar.fixedToCamera = true;
        energyBar.cameraOffset = new Phaser.Point(20, 20);
        energy = 100;

        //adds intial enemies
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        for(var i = 0; i < 10; i++){
            var coords = getXY();
            enemies.create(coords[0], coords[1], "hunter", 1);
        }
        enemies.setAll("health", 100);
        enemies.setAll("anchor.x", 0.5);
        enemies.setAll("anchor.y", 0.5);
        enemies.setAll("scale.x", 1);
        enemies.setAll("scale.y", 1);
        enemies.setAll("body.immovable", true);
        enemies.setAll("body.collideWorldBounds", true);
        enemies.forEach(function(enemy){
            var enemyHealth = game.add.sprite(0, -80, "healthBar");
            enemyHealth.anchor.setTo(0.5, 0);
            enemyHealth.scale.setTo(0.6, 0.6);
            enemy.addChild(enemyHealth);
            enemy.animations.add("fall", [7, 15, 16, 17, 17, 17, 17]);
        }, this);

        moveKeys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68
        });
        spin = game.input.keyboard.addKey(32);
        spin.onDown.add(doSpin, null, null, 133);
        jab = game.input.keyboard.addKey(69);
        jab.onDown.add(doJab, null, null, 133);

        hunterGun = game.add.weapon(5, "bullet", null, enemies);
        hunterGun.bulletKillDistance = 500;
        hunterGun.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        hunterGun.fireRate = 2000;
        hunterGun.bulletSpeed = 400;
        hunterGun.bulletClass.physicsBodyType = Phaser.Physics.ARCADE;


        iceWalk = game.add.audio("iceWalk", 1, true);
        sealSpin = game.add.audio("sealSpin", 1);
        hunterFall = game.add.audio("hunterFall", 1);
        game.sound.setDecodedCallback(iceWalk, start, this);

        //TODO Controls Menu before game start
        var text = "Use WASD to move.\nPress Spacebar to use your strong attack.\nPress E to use your weak attack."
        game.paused = true;
        graphics = game.add.graphics();
        graphics.fixedToCamera = true;
        graphics.beginFill(0x99ffff, .7);
        graphics.lineStyle(4, 0x00b3b3, 1);
        graphics.drawRect(200, 100, 500, 400);
        graphics.endFill();
        var controls = game.add.text(game.camera.centerX, 150, text, { fontSize: "20px" });
        controls.fixedtoCamera = true;
        controls.anchor.setTo(0.5, 0);
        graphics.addChild(controls);
        var button = game.add.button(game.camera.centerX, 450, "startButton", startOnClick);
        button.anchor.setTo(0.5, 0.5);
        button.scale.setTo(0.7, 0.7);
        graphics.addChild(button);

        energyBar.bringToTop();
    },

    update: function (){       
        //game.physics.arcade.collide(player, water);
        game.physics.arcade.collide(player, rocks);
        game.physics.arcade.collide(player, enemies);
        game.physics.arcade.overlap(player, hunterGun.bullets, updateHealth, null, this);

        
        updateEnergy();
        enemies.forEachAlive(enemyHealthCheck, this);
        
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
        if(player.x - enemy.x > 0) {
            enemy.scale.setTo(1, 1);
            var angle = Math.atan2(player.y - enemy.y, player.x - enemy.x) * 180 / Math.PI;
            if(angle >= 80)
                enemy.frame = 14;
            else if(angle >= 40)
                enemy.frame = 13;
            else if(angle >= 20)
                enemy.frame = 12;
            else if(angle >= -10)
                enemy.frame = 11;
            else if(angle >= -40)
                enemy.frame = 10;
            else if(angle >= -60)
                enemy.frame = 9;
            else if(angle >= -80)
                enemy.frame = 8;
        }
        else {
        enemy.scale.setTo(1, 1);
        angle = Math.atan2(enemy.y - player.y, enemy.x - player.x) * 180 / Math.PI;
        if(angle >= 80)
            enemy.frame = 6;
        else if(angle >= 40)
            enemy.frame = 5;
        else if(angle >= 20)
            enemy.frame = 4;
        else if(angle >= -10)
            enemy.frame = 3;
        else if(angle >= -40)
            enemy.frame = 2;
        else if(angle >= -60)
            enemy.frame = 1;
        else if(angle >= -80)
            enemy.frame = 0;
        }
        hunterGun.fire(enemy, player.x, player.y);
    }
    else{
        enemy.frame = 7;
    }
};

function enemyHealthCheck(enemy){
    if(enemy.health <= 0){
        enemy.animations.play("fall", 8, false, true);
        hunterFall.play();
        enemy.alive = false;
    }
    else{
        enemyDistanceCheck(enemy);
    }
    if(enemy.health <= 0)
        enemy.getChildAt(0).frame = 100;
    else
        enemy.getChildAt(0).frame = 100 - enemy.health;
}

function doSpin(i, range){
    var cost = 20;
    if(energy >= cost){
        console.log("spin");
        enemies.forEachAlive(function(enemy){
            if(getDistance(enemy) <= range && !player.animations.getAnimation("spin").isPlaying){
                player.body.velocity.x = 0, player.body.velocity.y = 0;
                player.animations.play("spin", 36);
                sealSpin.play();
                enemy.health -= 50;
                console.log(enemy.health);
                energy -= cost;    
            }
        }, this);
    } 
}

function doJab(i, range){
    var cost = 5
    if(energy >= cost){
        console.log("jab");
        enemies.forEachAlive(function(enemy){
            if(getDistance(enemy) <= range && !player.animations.getAnimation("jab").isPlaying){
                player.body.velocity.x = 0, player.body.velocity.y = 0;
                player.animations.play("jab", 12);
                sealSpin.play();
                enemy.health -= 10;
                console.log(enemy.health);
                energy -= cost;   
            }
        }, this);
    }
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

function updateHealth(player, bullet){
    player.damage(10); // take 10 damage to health; damage method auto kills sprite when health <= 0
    //player.health -= 10;
    player.getChildAt(0).frame = 100 - player.health;
    console.log(player.health);
    bullet.kill();

    if(player.alive == false){
        iceWalk.stop();
        game.state.start('state2');
    }
}

function updateEnergy(){
    if(energy <= 0)
        energyBar.frame = 100;
    else
        energyBar.frame = 100 - energy;
}
function startOnClick(){
    graphics.destroy();
    game.paused = false;
}

function getXY(){
    var x, y, tile = 0;
    while(tile != null){
        x = Math.floor(Math.random()*WORLD_LENGTH);
        y = Math.floor(Math.random()*WORLD_HEIGHT);
        tile = map.getTile(Math.floor(x / 32), Math.floor(y / 32), 1);
    }
    console.log(x, y);
    return [x, y];
}

// function tileBelow(){
//     var x, y, tile;
//     x = player.x;
//     y = player.y;
//     tile = map.getTile(Math.floor(x / 32), Math.floor(y / 32), 1);
//     return tile;
// }