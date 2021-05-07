var player, moveKeys, enemies, iceWalk, spin, sealSpin, hunterFall, hunterGun, map, healthBar, energyBar, energy, graphics, isSpin, isJab, spinTime, jabTime;
var jImage, kImage;
var attacking = false, allowSpin = true, firing = false;

demo.tutorial= function(){};
demo.tutorial.prototype = {
    preload: function(){
        game.load.spritesheet("seal", "assets/spritesheets/HarpSeal.png", 109, 74);
        game.load.spritesheet("hunter", "assets/spritesheets/hunter.png", 128, 128);
        game.load.spritesheet("healthBar", "assets/spritesheets/healthBar.png", 102, 12);
        game.load.spritesheet("energyBar", "assets/spritesheets/energyBar.png", 102, 12);
        game.load.spritesheet("jImage", "assets/spritesheets/jAttack.png", 64, 64);
        game.load.spritesheet("kImage", "assets/spritesheets/kAttack.png", 64, 64);
        game.load.spritesheet("fish", "assets/sprites/Fish.png", 64, 32);
        game.load.tilemap("Map", "assets/tilemaps/Tutorial.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("Ground", "assets/tilemaps/Ground.png");
        game.load.image("Rocks", "assets/tilemaps/Rocks.png");
        game.load.image("bullet", "assets/sprites/Bullet.png");
        game.load.image("homeBtn", "assets/sprites/HomeButton.png");
        game.load.image("startButton", "assets/sprites/StartButton.png");
        game.load.audio("iceWalk", "assets/sounds/effects/snowStep2.mp3");
        game.load.audio("sealSpin", "assets/sounds/effects/sealSpin.mp3");
        game.load.audio("hunterFall", "assets/sounds/effects/hunterFall.mp3");
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 900, 550);
        // so health and energy bars don't go off screen
        game.camera.bounds = new Phaser.Rectangle(0, 0, 900, 600);
        game.stage.backgroundColor = "#dce3e8";
        console.log(game.camera.bounds);

        map = game.add.tilemap("Map");
        map.addTilesetImage("Ground");
        map.addTilesetImage('Rocks');
        bounds = map.createLayer("Background");
        rocks = map.createLayer("Collisions");
        map.setCollisionBetween(22, 28, true, 'Collisions');

        player = game.add.sprite(100, 100, "seal");
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

        //health bar
        healthBar = game.add.sprite(0, 0, "healthBar");
        healthBar.addChild(game.add.text(20, 0, "Health", { fontSize: "10px" }));
        
        //Energy bar
        energyBar = game.add.sprite(0, 0, "energyBar");
        energyBar.addChild(game.add.text(20, 0, "Energy", { fontSize: "10px" }));
        energy = 100;

        // enemy
        enemy = game.add.sprite(500, 450, "hunter");
        game.physics.enable(enemy);
        //enemy.body = Phaser.Physics.ARCADE;
        enemy.health = 100;
        enemy.anchor.x = 0.5;
        enemy.anchor.y = 0.5;
        enemy.body.immovable = true;
        enemy.body.collideWorldBounds = true;
        enemy.body.stopVelocityonCollide = true;
        var enemyHealth = game.add.sprite(0, -80, "healthBar");
        enemyHealth.anchor.setTo(0.5, 0);
        enemyHealth.scale.setTo(0.6, 0.6);
        enemy.addChild(enemyHealth);
        enemy.animations.add("fall", [7, 15, 16, 17, 17, 17, 17]);
        enemy.weapon = game.add.weapon(10, "bullet");
        enemy.weapon.bulletKillDistance = 500;
        enemy.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        enemy.weapon.fireRate = 1000;
        enemy.weapon.bulletSpeed = 400;
        enemy.weapon.bulletClass.physicsBodyType = Phaser.Physics.ARCADE;
        enemy.weapon.bullets.alive = false;

        moveKeys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68
        });
        spin = game.input.keyboard.addKey(75);
        spin.onDown.add(doKick, null, null, 150);
        jab = game.input.keyboard.addKey(74);
        jab.onDown.add(doDab, null, null, 150);

        iceWalk = game.add.audio("iceWalk", 1.25, true);
        sealSpin = game.add.audio("sealSpin", 1);
        hunterFall = game.add.audio("hunterFall", 1);
        game.sound.setDecodedCallback(iceWalk, start, this);

        //add fish
        fish = game.add.sprite(900, 440, "fish");
        game.physics.enable(fish);
        fish.physicsBodyType = Phaser.Physics.ARCADE;
        fish.body.immovable = true;
        fish.body.collideWorldBounds = true;

        //add home button
        var homeBtn = game.add.button(5, 550, "homeBtn", goBack);
        homeBtn.fixedToCamera = true;

        //Attacks
        attacking = false;
        jImage = game.add.sprite(724, 504, "jImage");
        jImage.fixedToCamera = true;

        kImage = game.add.sprite(804, 504, "kImage");
        kImage.fixedToCamera = true;
        kImage.animations.add("countdown", [6, 7, 8, 9, 10]);

        //Controls Menu before game start
        var text = "Use WASD or Arrow Keys to move.\nPress K to use your strong attack.\nPress J to use your weak attack.\nYou can start attacking\nwhen the 'J' and 'K' in the\nbottom right corner turns white.\nKill the hunter first,\nthen eat the fish to replenish health and energy."
        game.paused = true;
        graphics = game.add.graphics();
        graphics.fixedToCamera = true;
        graphics.beginFill(0x99ffff, .7);
        graphics.lineStyle(4, 0x00b3b3, 1);
        graphics.drawRect(200, 100, 500, 400);
        graphics.endFill();
        var instruct = game.add.text(game.camera.centerX, 150, text, { font: "25px Iceland" });
        instruct.fixedtoCamera = true;
        instruct.anchor.setTo(0.5, 0);
        graphics.addChild(instruct);
        var button = game.add.button(game.camera.centerX, 450, "startButton", startOnClick);
        button.anchor.setTo(0.5, 0.5);
        button.scale.setTo(0.7, 0.7);
        graphics.addChild(button);

        cursors = this.input.keyboard.createCursorKeys();
    },
    update: function(){
        checkTime();

        healthBar.x = player.x - 57;
        healthBar.y = player.y + 37;
        energyBar.x = player.x - 57;
        energyBar.y = player.y + 50;

        game.physics.arcade.collide(player, rocks);
        game.physics.arcade.collide(enemy, rocks);
        game.physics.arcade.collide(player, enemy, stopPlayer, function(enemy) { return enemy.alive; }, this);
        game.physics.arcade.overlap(player, enemy.weapon.bullets, updateHealthTutorial, null, this);
        game.physics.arcade.overlap(player, fish, eatFish, null, this);
        game.physics.arcade.collide(rocks, enemy.weapon.bullets, killBullet, null, this);

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
        };

        updateEnergyTutorial();
        healthBar.frame = 100 - player.health;
        if (enemy.alive) {updateHunter(enemy)};
        canShoot(150);

        checkEnd()

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
    }
};


function updateHunter(enemy){
    if(enemy.health <= 0){
        enemy.alive = false;
        enemy.getChildAt(0).frame = 100;
        hunterFall.play();
        enemy.animations.play("fall", 8, false, true);
        console.log('dead');
    }
    else{
        enemy.getChildAt(0).frame = 100 - enemy.health;
        enemyDistanceCheck(enemy);
        if(!firing){
            moveEnemy(enemy);
        }
    }
}

function updateHealthTutorial(player, bullet){
    player.damage(10); // take 10 damage to health; damage method auto kills sprite when health <= 0
    console.log(player.health);
    bullet.kill();

    if(player.alive == false){
        iceWalk.stop();
        timmy = game.time.now;
        var text = "Try Again"
        game.add.text(game.camera.centerX, 150, text, { font: "25px Iceland" });
        game.time.events.add(1000, function () {
            iceWalk.stop();
            game.state.start("tutorial");
        });
    }
}

function updateEnergyTutorial(){
    if(energy <= 0){
        energyBar.frame = 100;
        iceWalk.stop();
        timmy = game.time.now;
        var text = "Try Again"
        game.add.text(game.camera.centerX, 150, text, { font: "25px Iceland" });
        game.time.events.add(1000, function () {
            iceWalk.stop();
            game.state.start("tutorial");
        });
    }
    else{
        energyBar.frame = 100 - energy;
    }
    if(energy < 30)
        kImage.frame = 11;
    if(energy < 15)
        jImage.frame = 11;
}

function canShoot(range){
    if(getDistance(enemy) > range || enemy.alive == false){
        if(!kImage.animations.getAnimation("countdown").isPlaying){
            kImage.frame = 11;
        }
        jImage.frame = 11;
    }
    else{
        if(!kImage.animations.getAnimation("countdown").isPlaying){
            kImage.frame = 0;
        }
        jImage.frame = 0;
    }
}

function doKick(i, range){
    if(allowSpin){
        var cost = 25;
        if(energy >= cost && enemy.health > 0){;
            console.log("spin");
            if(getDistance(enemy) <= range && !player.animations.getAnimation("spin").isPlaying){
                attacking = true;
                player.animations.play("spin", 36);
                player.body.velocity.x = 0, player.body.velocity.y = 0;
                iceWalk.stop();
                sealSpin.play();
                enemy.health -= 66;
                console.log(enemy.health);
                energy -= cost;
                spinTime = game.time.now;
                allowSpin = false;
                kImage.animations.play("countdown", 1);
            }
        }
    }    
}

function doDab(i, range){
    var cost = 13;
    if(energy >= cost && enemy.health > 0){
        console.log("jab");
        if(getDistance(enemy) <= range && !player.animations.getAnimation("jab").isPlaying){
            attacking = true;
            player.animations.play("jab", 20);
            player.body.velocity.x = 0, player.body.velocity.y = 0;
            iceWalk.stop();
            sealSpin.play();
            enemy.health -= 34;
            console.log(enemy.health);
            energy -= cost;
        }
    }
}

function eatFish() {
    // Removes the fish from the screen
    fish.alive = false;
    fish.kill();
    //  Add health and energy
    if(player.health +20 > 100) {
        player.health = 100;
    }    
    else {
        player.health += 20;
    }
    console.log(player.health);
    if(energy + 25 >= 100) {
        energy = 100;
    }
    else {
        energy += 25;
    }
    console.log(energy);
}

function checkEnd() {
    if (enemy.alive == false && fish.alive == false) {
        timmy = game.time.now;
        var text = "Congrats! You completed the tutorial."
        game.add.text(game.camera.centerX, 150, text, { font: "25px Iceland" });
        game.time.events.add(1600, function () {
            iceWalk.stop();
            game.state.start("title");
        });
    }
}
