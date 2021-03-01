var demo = {};

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.atlasJSONHash('seal', 'assets/sprites/harp_seal_shooting.gif', 'assets/spites/harp_seal_shooting.json');
    },

    create: function(){
        game.stage.backgroundColor = '#b5e7ff';
        game.add.text(50, 50, 'Among The Hunted', { fontSize: '32px'});
        game.add.text(50, 65, 'You are a harp seal\njust abandoned by your mother,\nleft to fend for yourself.\nYou are being hunted\nfor your soft fur.\nTry your best to survive.')
        console.log('Welcome Haha');
        var seal = game.add.sprite(game.world.centerX, 500, 'seal')
        seal.animations.add('shoot');
        seal.animations.play('shoot', 15, true);
        game.input.onDown.add(actionOnClick);
    },

    update: function (){}
};

function actionOnClick () {
    console.log('start state1');
    text.destroy();
    game.state.start('state1');
};
