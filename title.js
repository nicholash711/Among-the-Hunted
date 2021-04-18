var demo = {}, music;

demo.title = function(){};
demo.title.prototype = {
    preload: function(){
        game.load.image('normal-btn', 'assets/sprites/normal-btn.png');
        game.load.image('infinite-btn', 'assets/sprites/infinite-btn.png');
        game.load.audio("music", "assets/sounds/music/suspense.mp3");
    },

    create: function(){
        game.stage.backgroundColor = '#b5e7ff';
        game.add.text(50, 50, 'Among The Hunted', { fontSize: '50px'});
        game.add.text(50, 200, 'You are a harp seal\njust abandoned by your mother,\nleft to fend for yourself.\nYou are being hunted\nfor your soft fur.\nTry your best to survive.', { fontsize: '20px'});
        game.add.text(game.world.centerX + 100, 200, 'Choose a mode to begin', { fontSize: '18px'});
        console.log('Welcome Haha',);
        var normalBtn = game.add.button(game.world.centerX + 100, 250, "normal-btn", clickNormal);
        normalBtn.scale.setTo(2, 2);
        var normalBtn = game.add.button(game.world.centerX + 100, 350, "infinite-btn", clickInfinite);
        normalBtn.scale.setTo(2, 2);


        music = game.add.audio("music", 0.2, true);
        music.play();
    },

    update: function (){}
};

function clickNormal () {
    music.stop();
    console.log('start normal');
    game.state.start('normal');
};

function clickInfinite () {
    music.stop();
    console.log('start infinite');
    game.state.start('infinite');
};
