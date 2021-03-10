var text;

demo.state2 = function(){};
demo.state2.prototype = {
    preload: function(){},

    create: function(){
        text = game.add.text(WIDTH / 2, 100, "GAME OVER", { fontSize: "40px" });
        //text.anchor = (0.5, 0.5);
    },
    
    update: function(){}
}