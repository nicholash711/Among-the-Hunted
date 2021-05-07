var player, moveKeys, enemies, iceWalk, spin, sealSpin, hunterFall, hunterGun, map, healthBar, energyBar, energy, graphics, isSpin, isJab, spinTime, jabTime;
var jImage, kImage, weapons, startTime, endTime;
var attacking = false, allowSpin = true, firing = false, added = false;

demo.hard= function(){};
demo.hard.prototype = {
    preload: function(){
        game.load.spritesheet("seal", "assets/spritesheets/HarpSeal.png", 109, 74);
        game.load.spritesheet("hunter", "assets/spritesheets/hunter.png", 128, 128);
        game.load.spritesheet("healthBar", "assets/spritesheets/healthBar.png", 102, 12);
        game.load.spritesheet("energyBar", "assets/spritesheets/energyBar.png", 102, 12);
        game.load.spritesheet("jImage", "assets/spritesheets/jAttack.png", 64, 64);
        game.load.spritesheet("kImage", "assets/spritesheets/kAttack.png", 64, 64);
        game.load.spritesheet("fish", "assets/sprites/Fish.png", 64, 32);
        game.load.tilemap("Map", "assets/tilemaps/Hard.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("Ground", "assets/tilemaps/Ground.png");
        game.load.image("Rocks", "assets/tilemaps/Rocks.png");
        game.load.image("Water", "assets/tilemaps/Water.png");
        game.load.image("bullet", "assets/sprites/Bullet.png");
        game.load.image("homeBtn", "assets/sprites/HomeButton.png");
        game.load.image("arrow", "assets/sprites/Arrow.png");
        game.load.image("startButton", "assets/sprites/StartButton.png");
        game.load.audio("iceWalk", "assets/sounds/effects/snowStep2.mp3");
        game.load.audio("sealSpin", "assets/sounds/effects/sealSpin.mp3");
        game.load.audio("hunterFall", "assets/sounds/effects/hunterFall.mp3");
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, WORLD_LENGTH, WORLD_HEIGHT);
        // so health and energy bars don't go off screen
        game.camera.bounds = new Phaser.Rectangle(-50, -50, WORLD_LENGTH + 100, WORLD_HEIGHT + 100);
        game.stage.backgroundColor = "#dce3e8";
        console.log(game.camera.bounds);

        map = game.add.tilemap("Map");
        map.addTilesetImage("Ground");
        map.addTilesetImage('Water');
        map.addTilesetImage('Rocks');
        bounds = map.createLayer("Background");
        rocks = map.createLayer("Collisions");
        water = map.createLayer("Water");
        map.setCollision(17, true, 'Water');
        map.setCollisionBetween(22, 28, true, 'Collisions');

        player = game.add.sprite(game.world.centerX, game.world.centerY, "seal");
        player.health = 100;
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(-0.8, 0.8)
        game.physics.enable(player);
        player.body.collideWorldBounds = true;
        game.camera.follow(player);
        player.animations.add("walk", [0, 1, 2]);
        player.animations.add("spin", [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);
        player.animations.add("jab", [26, 27, 27, 28, 28, 29, 29, 30]);
        player.animations.getAnimation("spin").onComplete.add(function(){ attacking = false; });
        player.animations.getAnimation("jab").onComplete.add(function(){ attacking = false; });

        arrow = game.add.sprite(0, 0, "arrow");
        arrow.anchor.setTo(0.5, 0.5);
        arrow.visible = false;

        //health bar
        healthBar = game.add.sprite(game.world.centerX, game.world.centerY, "healthBar");
        healthBar.addChild(game.add.text(20, 0, "Health", { fontSize: "10px" }));
        
        //Energy bar
        energyBar = game.add.sprite(game.world.centerX, game.world.centerY, "energyBar");
        energyBar.addChild(game.add.text(20, 0, "Energy", { fontSize: "10px" }));
        energy = 100;

        //adds intial enemies
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        for(var i = 0; i < 20; i++){
            var coords = getXY();
            enemies.create(coords[0], coords[1], "hunter", 7);
        }
        enemies.setAll("health", 100, null, null, null, true);
        enemies.setAll("anchor.x", 0.5, null, null, null, true);
        enemies.setAll("anchor.y", 0.5, null, null, null, true);
        enemies.setAll("body.immovable", true, null, null, null, true);
        enemies.setAll("body.collideWorldBounds", true, null, null, null, true);
        enemies.setAll("body.stopVelocityonCollide", true, null, null, null, true);
        enemies.forEach(function(enemy){
            var enemyHealth = game.add.sprite(0, -80, "healthBar");
            enemyHealth.anchor.setTo(0.5, 0);
            enemyHealth.scale.setTo(0.6, 0.6);
            enemy.addChild(enemyHealth);
            enemy.animations.add("fall", [7, 15, 16, 17, 17, 17, 17]);
        }, this);

        weapons = game.add.group();
        enemies.forEach(function(enemy){
            enemy.weapon = game.add.weapon(10, "bullet", null, weapons);
            enemy.weapon.bulletKillDistance = 500;
            enemy.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
            enemy.weapon.fireRate = 1000;
            enemy.weapon.bulletSpeed = 500;
            enemy.weapon.bulletClass.physicsBodyType = Phaser.Physics.ARCADE;
            enemy.weapon.bullets.alive = false;
    
        }, this);

        moveKeys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68
        });
        spin = game.input.keyboard.addKey(75);
        spin.onDown.add(doSpin, null, null, 150);
        jab = game.input.keyboard.addKey(74);
        jab.onDown.add(doJab, null, null, 150);

        iceWalk = game.add.audio("iceWalk", 1.25, true);
        sealSpin = game.add.audio("sealSpin", 1);
        hunterFall = game.add.audio("hunterFall", 1);
        game.sound.setDecodedCallback(iceWalk, start, this);

        //add fish
        fishies = game.add.group();
        fishies.enableBody = true;
        fishies.physicsBodyType = Phaser.Physics.ARCADE;
        fishies.setAll("body.immovable", true, null, null, null, true);
        fishies.setAll("body.collideWorldBounds", true, null, null, null, true);
        fishies.setAll("anchor", new Phaser.Point(0, 0), null, null, null, true);
        for(var i = 0; i < 10; i++){
            var coords = getXYFish();
            var frame = Math.floor(Math.random() * 3);
            fishies.create(coords[0], coords[1], "fish", frame);
        }

        //Attacks
        attacking = false;
        jImage = game.add.sprite(724, 504, "jImage");
        jImage.fixedToCamera = true;

        kImage = game.add.sprite(804, 504, "kImage");
        kImage.fixedToCamera = true;
        kImage.animations.add("countdown", [6, 7, 8, 9, 10]);

        hunterCounter = game.add.text(10, 10, "Hunters left: " + (enemies.countLiving()), { fontSize: "30px" });
        hunterCounter.fixedToCamera = true;
        hunterCounter.cameraOffset = new Phaser.Point(20, 20);

        //Controls Menu before game start
        var text = "Use WASD or Arrow Keys to move.\nPress K to use your strong attack.\nPress J to use your weak attack.\nCollect fish to replenish health and energy.\n when you get to the last three hunter,\nthere will be an arrow to point you\nto the closest hunter."
        game.paused = true;
        graphics = game.add.graphics();
        graphics.fixedToCamera = true;
        graphics.beginFill(0x99ffff, .7);
        graphics.lineStyle(4, 0x00b3b3, 1);
        graphics.drawRect(200, 100, 500, 400);
        graphics.endFill();
        var instruct = game.add.text(game.camera.centerX, 150, text, { fontSize: "20px" });
        instruct.fixedtoCamera = true;
        instruct.anchor.setTo(0.5, 0);
        graphics.addChild(instruct);
        var button = game.add.button(game.camera.centerX, 450, "startButton", startOnClick);
        button.anchor.setTo(0.5, 0.5);
        button.scale.setTo(0.7, 0.7);
        graphics.addChild(button);

        cursors = this.input.keyboard.createCursorKeys();

        var homeBtn = game.add.button(5, 550, "homeBtn", goBack);
        homeBtn.fixedToCamera = true;

        
    },

    update: function (){  
        checkEnemies();
        checkTime();
        
        healthBar.x = player.x - 57;
        healthBar.y = player.y + 37;
        energyBar.x = player.x - 57;
        energyBar.y = player.y + 50;
        
        game.physics.arcade.collide(player, water);
        game.physics.arcade.collide(player, rocks);
        game.physics.arcade.collide(player, enemies, stopPlayer, function(enemy) { return enemy.alive; }, this);
        game.physics.arcade.overlap(player, weapons.getAll("bullets"), updateHealthHard, null, this);
        game.physics.arcade.overlap(player, fishies, collectFishHard, null, this);
        game.physics.arcade.collide(enemies, water);
        game.physics.arcade.collide(enemies, rocks);
        game.physics.arcade.collide(enemies, enemies);
        game.physics.arcade.collide(rocks, weapons.getAll("bullets"), killBullet, null, this);

        
        updateEnergy();
        healthBar.frame = 100 - player.health;
        enemies.forEachAlive(updateEnemy, this);
        inRange(150);
        if(!attacking){
            if(moveKeys.up.isDown || cursors.up.isDown){
                player.body.velocity.y = -SPEED;
                player.animations.play("walk", 8, true);
            }
            else if(moveKeys.down.isDown || cursors.down.isDown){
                player.body.velocity.y = SPEED;
                player.animations.play("walk", 8, true);
            }
            else{
                player.body.velocity.y = 0;
                if(!moveKeys.left.isDown && !moveKeys.right.isDown && !cursors.left.isDown && !cursors.right.isDown)
                    player.animations.stop("walk", true);
            }
            if(moveKeys.left.isDown || cursors.left.isDown){
                player.scale.setTo(0.8, 0.8);
                player.body.velocity.x = -SPEED;
                player.animations.play("walk", 8, true);
            }
            else if(moveKeys.right.isDown || cursors.right.isDown){
                player.scale.setTo(-0.8, 0.8);
                player.body.velocity.x = SPEED;
                player.animations.play("walk", 8, true);
            }
            else{
                player.body.velocity.x = 0;
                if(!moveKeys.up.isDown && !moveKeys.down.isDown  && !cursors.up.isDown && !cursors.down.isDown)
                    player.animations.stop("walk", true);
            }
        }
        if (enemies.countLiving() <=3) {
            pointEnemies(enemies, player, arrow);
        }
    }
};

function stopPlayer(){
    player.animations.stop("walk", true);
    iceWalk.stop();
}

function enemyDistanceCheck(enemy){
    if(getDistance(enemy) <= 300){
        enemy.body.stop();
        firing = true;
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
        enemy.weapon.fire(enemy, player.x, player.y);
    }
    else{
        enemy.frame = 7;
        firing = false;
    }
};

function updateHealthHard(player, bullet){
    player.damage(20); // take 20 damage to health; damage method auto kills sprite when health <= 0
    console.log(player.health);
    bullet.kill();

    if(player.alive == false){
        iceWalk.stop();
        game.state.start('noHealth');
    }
}

function collectFishHard (player, fish) {

    // Removes the fish from the screen
    fish.kill();
    //  Add health and energy
    increaseHealthHard(player);
    increaseEnergy();

    var coords = getXYFish();
    var frame = Math.floor(Math.random() * 3);
    fishies.create(coords[0], coords[1], "fish", frame);

}

function increaseHealthHard(player){
    if(player.health + 20 > 100) {
        player.health = 100;
    }    
    else {
        player.health += 20;
    }
    console.log(player.health);
}



