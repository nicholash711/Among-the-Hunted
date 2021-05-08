var demo = {};

demo.pre = function(){};
demo.pre.prototype = {
    preload: function(){
    },

    create: function(){
        game.stage.backgroundColor = '#b5e7ff';
        var t1 = game.add.text(50, 50, 'Among The Hunted', { font: 'bold 60px Iceland'});
        t1.visible = false;
        var t2 = game.add.text(100, 50, 'Survive', { font: 'bold 60px Iceland'});
        t2.visible = false;
        game.time.events.add(1000, function () {
            game.state.start("title");
        });
    },

    update: function (){}
};