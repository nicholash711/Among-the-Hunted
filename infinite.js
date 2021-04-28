var player, moveKeys, enemies, iceWalk, spin, sealSpin, hunterFall, hunterGun, map, healthBar, energyBar, energy, graphics, isSpin, isJab, spinTime, jabTime;
var jImage, kImage, score = 0, highscore = 0,scoreText;
var attacking = false, allowSpin = true, allowJab = true, firing = false;

demo.infinite= function(){};
demo.infinite.prototype = {
    preload: function(){
        game.load.spritesheet("seal", "assets/spritesheets/HarpSeal.png", 109, 74);
        game.load.spritesheet("hunter", "assets/spritesheets/hunter.png", 128, 128);
        game.load.spritesheet("healthBar", "assets/spritesheets/healthBar.png", 102, 12);
        game.load.spritesheet("energyBar", "assets/spritesheets/EnergyBar.png", 102, 12);
        game.load.spritesheet("jImage", "assets/spritesheets/jAttack.png", 64, 64);
        game.load.spritesheet("kImage", "assets/spritesheets/kAttack.png", 64, 64);
        game.load.spritesheet("fish", "assets/sprites/Fish.png", 64, 32);
        game.load.tilemap("Map", "assets/tilemaps/Map.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("Ground", "assets/tilemaps/Ground.png");
        game.load.image("Rocks", "assets/tilemaps/Rocks.png");
        game.load.image("Water", "assets/tilemaps/Water.png");
        game.load.image("bullet", "assets/sprites/Bullet.png");
        game.load.image("startButton", "assets/sprites/StartButton.png");
        game.load.image("homeBtn", "assets/sprites/HomeButton.png");
        game.load.audio("iceWalk", "assets/sounds/effects/snowStep2.mp3");
        game.load.audio("sealSpin", "assets/sounds/effects/sealSpin.mp3");
        game.load.audio("hunterFall", "assets/sounds/effects/hunterFall.mp3");
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, WORLD_LENGTH, WORLD_HEIGHT);
        game.camera.bounds = new Phaser.Rectangle(0, -50, WORLD_LENGTH, WORLD_HEIGHT + 100);
        game.stage.backgroundColor = "#dce3e8";

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

        //health bar
        healthBar = game.add.sprite(0, 0, "healthBar");
        healthBar.addChild(game.add.text(20, 0, "Health", { fontSize: "10px" }));
        
        //Energy bar WIP
        energyBar = game.add.sprite(0, 0, "energyBar");
        energyBar.addChild(game.add.text(20, 0, "Energy", { fontSize: "10px" }));
        energy = 100;

        //adds intial enemies
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        for(var i = 0; i < 15; i++){
            var coords = getXY();
            enemies.create(coords[0], coords[1], "hunter", 7);
        }
        enemies.setAll("health", 100);
        enemies.setAll("anchor.x", 0.5);
        enemies.setAll("anchor.y", 0.5);
        enemies.setAll("body.immovable", true);
        enemies.setAll("body.collideWorldBounds", true);
        enemies.setAll("body.stopVelocityonCollide", true);
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
            enemy.weapon.bulletSpeed = 400;
            enemy.weapon.bulletClass.physicsBodyType = Phaser.Physics.ARCADE;
            enemy.weapon.bullets.alive = false;
    
        }, this);

        moveKeys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68
        });
        spin = game.input.keyboard.addKey(75);
        spin.onDown.add(doSpin, null, null, 133);
        jab = game.input.keyboard.addKey(74);
        jab.onDown.add(doJab, null, null, 133);

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
        for(var i = 0; i < 20; i++){
            var coords = getXY();
            var frame = Math.floor(Math.random() * 3);
            fishies.create(coords[0], coords[1], "fish", frame);
        }

        //Attacks HUD things
        attacking = false;
        jImage = game.add.sprite(724, 504, "jImage");
        jImage.fixedToCamera = true;
        jImage.animations.add("countdown", [9, 10]);

        kImage = game.add.sprite(804, 504, "kImage");
        kImage.fixedToCamera = true;
        kImage.animations.add("countdown", [6, 7, 8, 9, 10]);

        //TODO Controls Menu before game start
        var text = "Use WASD or Arrow Keys to move.\nPress K to use your strong attack.\nPress J to use your weak attack.\nCollect fish to replenish health and energy."
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
        var button = game.add.button(game.camera.centerX, 450, "startButton", startOnClick, score = 0);
        button.anchor.setTo(0.5, 0.5);
        button.scale.setTo(0.7, 0.7);
        graphics.addChild(button);

        scoreText = game.add.text(10, 10, "Survive as Long as Possible\nScore: " + score + "\nCurrent High Score: " + highscore, { fontSize: "30px" });
        scoreText.fixedToCamera = true;
        scoreText.cameraOffset = new Phaser.Point(20, 20);

        cursors = this.input.keyboard.createCursorKeys();

        var homeBtn = game.add.button(5, 550, "homeBtn", goBackInfinite);
        homeBtn.scale.setTo(1, 1);
        homeBtn.fixedToCamera = true;
    },

    update: function (){  
        checkEnemies();
        checkTime();
        checkHighScore();
        healthBar.x = player.x - 57;
        healthBar.y = player.y + 37;
        energyBar.x = player.x - 57;
        energyBar.y = player.y + 50;
        
        game.physics.arcade.collide(player, water);
        game.physics.arcade.collide(player, rocks);
        game.physics.arcade.collide(player, enemies, stopPlayer);
        game.physics.arcade.overlap(player, weapons.getAll("bullets"), updateHealthInfinite, null, this);
        game.physics.arcade.overlap(player, fishies, collectFish, null, this);
        game.physics.arcade.collide(enemies, water);
        game.physics.arcade.collide(enemies, rocks);
        game.physics.arcade.collide(enemies, enemies);
        game.physics.arcade.collide(rocks, weapons.getAll("bullets"), killBullet, null, this);

        
        updateEnergyInfinite();
        healthBar.frame = 100 - player.health;
        enemies.forEachAlive(updateEnemyInfinite, this);
        inRange(133);
        //if(!player.animations.getAnimation("spin").isPlaying || !player.animations.getAnimation("jab").isPlaying){
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

function updateEnemyInfinite(enemy){
    if(enemy.health <= 0){
        score += 100;
        scoreText.setText("Survive as Long as Possible\nScore: " + score + "\nSession High Score: " + highscore);
        enemy.alive = false;
        enemy.getChildAt(0).frame = 100;
        enemy.animations.play("fall", 8, false, true);
        hunterFall.play();

        addHunter();
        
    }
    else{
        enemy.getChildAt(0).frame = 100 - enemy.health;
        enemyDistanceCheck(enemy);
        if(!firing){
            moveEnemy(enemy);
        }
    }
}

function addHunter(){
    var coords = getXY();
    enemies.create(coords[0], coords[1], "hunter", 7);
    enemy = enemies.getTop();

    enemy.health = 100;
    enemy.anchor = new Phaser.Point(0.5, 0.5);
    enemy.body.immovable = true;
    enemy.body.collideWorldBounds = true;
    enemy.body.stopVelocityonCollide = true;

    var enemyHealth = game.add.sprite(0, -80, "healthBar");
    enemyHealth.anchor.setTo(0.5, 0);
    enemyHealth.scale.setTo(0.6, 0.6);
    enemy.addChild(enemyHealth);
    enemy.animations.add("fall", [7, 15, 16, 17, 17, 17, 17]);

    enemy.weapon = game.add.weapon(10, "bullet", null, weapons);
    enemy.weapon.bulletKillDistance = 500;
    enemy.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    enemy.weapon.fireRate = 1000;
    enemy.weapon.bulletSpeed = 400;
    enemy.weapon.bulletClass.physicsBodyType = Phaser.Physics.ARCADE;
    enemy.weapon.bullets.alive = false;
}

function updateHealthInfinite(player, bullet){
    player.damage(10); // take 10 damage to health; damage method auto kills sprite when health <= 0
    console.log(player.health);
    bullet.kill();

    if(player.alive == false){
        iceWalk.stop();
        game.state.start('noHealthInfinite');
    }
}

function updateEnergyInfinite(){
    if(energy <= 0){
        energyBar.frame = 100;
        iceWalk.stop();
        game.state.start('noEnergyInfinite'); // starved
    }
    else{
        energyBar.frame = 100 - energy;
    }
    if(energy < 20)
        kImage.frame = 11;
    if(energy < 5)
        jImage.frame = 11;
}

function goBackInfinite() {
    iceWalk.stop();
    game.state.start('title');
    score = 0;
}

function checkHighScore(){
    if(score > highscore){
        highscore = score;
        scoreText.setText("Survive as Long as Possible\nScore: " + score + "\nSession High Score: " + highscore);
    }
}