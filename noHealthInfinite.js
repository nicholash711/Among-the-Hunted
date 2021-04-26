var text;

demo.noHealthInfinite = function(){};
demo.noHealthInfinite.prototype = {
    preload: function(){
        game.load.image("lose", "assets/actionscreens/healthscreen.png");
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