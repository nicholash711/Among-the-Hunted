var text;

demo.noHealthInfinite = function(){};
demo.noHealthInfinite.prototype = {
    preload: function(){
        game.load.image("lose", "assets/actionscreens/healthscreen.png");
    },

    create: function(){
        game.add.sprite(0,0,"lose");
        game.input.onDown.add(restartOnClick);
        text = game.add.text(game.camera.centerX, 450, "Final Score: " + score, { font: "bold 35px Iceland" });
        text.anchor = new Phaser.Point(0.5, 0);
    },
    
    update: function(){}
}
