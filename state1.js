demo.state1 = function(){};
demo.state1.prototype = {
    preload: function(){
        game.load.tilemap("mapTest", "assets/tilemaps/Map.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("iceTiles", "assets/tilemaps/set_01.png");
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, WIDTH, HEIGHT);
        game.stage.backgroundColor = "#2b00ff";

        var map = game.add.tilemap("mapTest");
        map.addTilesetImage("iceTiles");
        bounds = map.createLayer("ice");

        console.log("state1");
    },

    update: function (){}
}