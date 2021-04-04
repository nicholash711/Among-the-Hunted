var text;

demo.state4 = function(){};
demo.state4.prototype = {
    preload: function(){},

    create: function(){
        text = game.add.text(WIDTH / 2, 200, "CONGRATULATIONS\nYou killed all the hunters and survived.", { fontSize: "40px", align: "center" });
        text.anchor.setTo(0.5, 0);
        text = game.add.text(WIDTH / 2, 300, "Click anywhere to restart", { fontSize: "20px" });
        text.anchor.setTo(0.5, 0);
        game.input.onDown.add(restartOnClick);
    },
    
    update: function(){}
}

function restartOnClick(){
    game.state.start("state1");
}