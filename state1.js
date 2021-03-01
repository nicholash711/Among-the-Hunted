var player, keys, speed = 200;

demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        game.load.spritesheet("seal", "assets/sprites/HarpSeal.png", 160, 160);
        game.load.tilemap("mapTest", "assets/tilemaps/demomap.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("Ground", "assets/tilemaps/set_01.png");
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 640, 480);
        game.stage.backgroundColor = "#2b00ff";
        //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        var map = game.add.tilemap("mapTest");
        map.addTilesetImage("Ground");
        bounds = map.createLayer("Background");

        player = game.add.sprite(game.world.centerX, game.world.centerY, "seal");
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(-0.6, 0.6)
        game.physics.enable(player);
        player.body.collideWorldBounds = true;
        game.camera.follow(player);
        player.animations.add("walk", [0, 1, 2]);

        keys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68
        });
    },

    update: function (){
        if(keys.up.isDown){
            player.body.velocity.y = -speed;
            player.animations.play("walk", 14, true);
        }
        else if(keys.down.isDown){
            player.body.velocity.y = speed;
            player.animations.play("walk", 14, true);
        }
        else{
            player.body.velocity.y = 0;
            if(!keys.left.isDown && !keys.right.isDown){
                player.animations.stop("walk");
                player.frame = 0;
            }
        }
        if(keys.left.isDown){
            player.body.velocity.x = -speed;
            player.scale.setTo(0.6, 0.6);
            player.animations.play("walk", 14, true);
        }
        else if(keys.right.isDown){
            player.body.velocity.x = speed;
            player.scale.setTo(-0.6, 0.6);
            player.animations.play("walk", 14, true);
        }
        else{
            player.body.velocity.x = 0;
            if(!keys.up.isDown && !keys.down.isDown){
                player.animations.stop("walk");
                player.frame = 0;
            } 
        }
    }
}