var demo = {};

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.spritesheet('seal', 'assets/sprites/harp_seal_shooting.png', 348, 216, 73)
    },

    create: function(){
        game.stage.backgroundColor = '#b5e7ff';
        game.add.text(50, 50, 'Among The Hunted', { fontSize: '32px'});
        game.add.text(50, 75, 'You are a harp seal\njust abandoned by your mother,\nleft to fend for yourself.\nYou are being hunted\nfor your soft fur.\nTry your best to survive.', { fontsize: '24px'})
        console.log('Welcome Haha',);
        var seal = game.add.sprite(game.world.centerX, 350, 'seal');
        seal.scale.setTo(0.5, 0.5);
        seal.animations.add('shoot');
        seal.animations.play('shoot', 10, true);
        game.input.onDown.add(actionOnClick);
    },

    update: function (){}
};

function actionOnClick () {
    console.log('start state1');
    game.state.start('state1');
};
