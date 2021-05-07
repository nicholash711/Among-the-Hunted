var text;

demo.noEnergyInfinite = function(){};
demo.noEnergyInfinite.prototype = {
    preload: function(){
        game.load.image("lose", "assets/actionscreens/starvationscreen.png");
    },

    create: function(){
        game.add.sprite(0,0,"lose");
        game.input.onDown.add(restartOnClick);
        text = game.add.text(game.camera.centerX, 400, "Final Score: " + score, { font: "35px Iceland" });
        text.anchor = new Phaser.Point(0.5, 0);
    },
    
    update: function(){}
}
