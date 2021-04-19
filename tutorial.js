var player, moveKeys, enemies, iceWalk, spin, sealSpin, hunterFall, hunterGun, map, healthBar, energyBar, energy, graphics, isSpin, isJab, spinTime, jabTime;
var jImage, kImage;
var attacking = false, allowSpin = true, allowJab = true, firing = false;

demo.tutorial= function(){};
demo.tutorial.prototype = {
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
        game.load.audio("iceWalk", "assets/sounds/effects/iceStep.mp3");
        game.load.audio("sealSpin", "assets/sounds/effects/sealSpin.mp3");
        game.load.audio("hunterFall", "assets/sounds/effects/hunterFall.mp3");
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, WORLD_LENGTH, WORLD_HEIGHT);
        // so health and energy bars don't go off screen
        game.camera.bounds = new Phaser.Rectangle(0, -50, WORLD_LENGTH, WORLD_HEIGHT + 100);
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

        //TODO Controls Menu before game start
        var text = "WARNING: WIP\nUse WASD or Arrow Keys to move.\nPress K to use your strong attack.\nPress J to use your weak attack."
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

        moveKeys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68
        });
        spin = game.input.keyboard.addKey(75);
        spin.onDown.add(doSpin, null, null, 133);
        jab = game.input.keyboard.addKey(74);
        jab.onDown.add(doJab, null, null, 133);

        cursors = this.input.keyboard.createCursorKeys();
    },
    update: function(){
        healthBar.x = player.x - 57;
        healthBar.y = player.y + 37;
        energyBar.x = player.x - 57;
        energyBar.y = player.y + 50;

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
    }
};

function startOnClick(){
    graphics.destroy();
    game.paused = false;
};