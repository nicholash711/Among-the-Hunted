var demo = {}, music;

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.spritesheet('seal', 'assets/sprites/harp_seal_shooting.png', 348, 216, 73);
        game.load.audio("music", "assets/sounds/music/suspense.mp3");
    },

    create: function(){
        game.stage.backgroundColor = '#b5e7ff';
        game.add.text(50, 50, 'Among The Hunted', { fontSize: '32px'});
        game.add.text(50, 77, 'You are a harp seal\njust abandoned by your mother,\nleft to fend for yourself.\nYou are being hunted\nfor your soft fur.\nTry your best to survive.', { fontsize: '24px'});
        game.add.text(50, 300, 'Click on the GIF to begin', { fontSize: '18px'})
        console.log('Welcome Haha',);
        var seal = game.add.sprite(game.world.centerX, 350, 'seal');
        seal.scale.setTo(0.5, 0.5);
        seal.animations.add('shoot');
        seal.animations.play('shoot', 7, true);
        game.input.onDown.add(actionOnClick);

        music = game.add.audio("music", 0.2, true);
        music.play();
    },

    update: function (){}
};

function actionOnClick () {
    music.stop();
    console.log('start state1');
    game.state.start('state1');
};
