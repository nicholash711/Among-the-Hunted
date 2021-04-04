var text;

demo.state2 = function(){};
demo.state2.prototype = {
    preload: function(){},

    create: function(){
        text = game.add.text(WIDTH / 2, 200, "GAME OVER\nYou dies from starvation.", { fontSize: "40px", align: "center" });
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