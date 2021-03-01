var player, keys, speed = 5000;

demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        game.load.spritesheet("seal", "assets/sprites/HarpSeal.png", 150, 150);
        game.load.tilemap("mapTest", "assets/tilemaps/Map.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("Ground", "assets/tilemaps/set_01.png");
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 3200, 3200);
        game.stage.backgroundColor = "#2b00ff";
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        var map = game.add.tilemap("mapTest");
        map.addTilesetImage("Ground");
        bounds = map.createLayer("Background");

        player = game.add.sprite(WIDTH / 2, HEIGHT / 2, "seal");
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player);
        player.body.collideWorldBounds = true;
        game.camera.follow(player);

        keys = game.input.keyboard.addKeys({
            "up": 87, "down": 83, "left": 65, "right": 68
        });
    },

    update: function (){
        if(keys.up.isDown){
            player.body.velocity.y = -speed;
            
        }
        else if(keys.down.isDown){
            player.body.velocity.y = speed;
        }
        else{
            player.body.velocity.y = 0;
        }
        if(keys.left.isDown){
            player.body.velocity.x = -speed;
            player.scale.setTo(1, 1);
        }
        else if(keys.right.isDown){
            player.body.velocity.x = speed;
            player.scale.setTo(-1, 1);
        }
        else{
            player.body.velocity.x = 0;
        }
    }
}