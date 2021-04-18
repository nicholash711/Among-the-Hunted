var text;

demo.win = function(){};
demo.win.prototype = {
    preload: function(){
        game.load.image("lose", "assets/actionscreens/winningscreen.png");
    },

    create: function(){
        game.add.sprite(0,0,"lose");
        game.input.onDown.add(restartOnClick);
    },
    
    update: function(){}
}

function restartOnClick(){
    game.state.start("title");
}