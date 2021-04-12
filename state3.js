var text;

demo.state3 = function(){};
demo.state3.prototype = {
    preload: function(){
        game.load.image("lose", "assets/actionscreens/starvationscreen.png");
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