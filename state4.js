var text;

demo.state4 = function(){};
demo.state4.prototype = {
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
    game.state.start("state1");
}