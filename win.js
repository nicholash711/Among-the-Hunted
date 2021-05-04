var text;

demo.win = function(){};
demo.win.prototype = {
    preload: function(){
        game.load.image("lose", "assets/actionscreens/winningscreen.png");
    },

    create: function(){
        game.add.sprite(0,0,"lose");
        game.input.onDown.add(restartOnClick);
        var text = "You beat the Hunters in " + ((endTime - startTime) / 1000) + " seconds!"
        var temp = game.add.text(game.camera.centerX, 400, text, { fontSize: "30px" });
        temp.anchor.setTo(0.5, 0);
    },
    
    update: function(){}
}
