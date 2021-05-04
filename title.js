var demo = {}, music;

demo.title = function(){};
demo.title.prototype = {
    preload: function(){
        game.load.image('tutorial-btn', 'assets/sprites/tutorial-btn.png');
        game.load.image('normal-btn', 'assets/sprites/normal-btn.png');
        game.load.image('infinite-btn', 'assets/sprites/infinite-btn.png');
        game.load.image('credits-btn', 'assets/sprites/credits-btn.png');
        game.load.audio("music", "assets/sounds/music/suspense.mp3");
    },

    create: function(){
        game.stage.backgroundColor = '#b5e7ff';
        game.add.text(50, 50, 'Among The Hunted', { fontSize: '50px'});
        game.add.text(50, 150, 'You are a harp seal\njust abandoned by your mother,\nleft to fend for yourself.\nYou are being hunted\nfor your soft fur.\nTry your best to survive.', { fontSize: '30px'});
        game.add.text(game.camera.centerX + 100, 150, 'Choose a mode to begin', { fontSize: '18px'});
        console.log('Welcome Haha');
        var normalBtn = game.add.button(50, 400, "tutorial-btn", clickTutorial);
        normalBtn.scale.setTo(2, 2);
        var normalBtn = game.add.button(game.camera.centerX + 100, 200, "normal-btn", clickNormal);
        normalBtn.scale.setTo(2, 2);
        var normalBtn = game.add.button(game.camera.centerX + 100, 300, "infinite-btn", clickInfinite);
        normalBtn.scale.setTo(2, 2);
        var normalBtn = game.add.button(game.camera.centerX + 100, 450, "credits-btn", clickCredits);
        normalBtn.scale.setTo(2, 2);


        music = game.add.audio("music", 0.2, true);
        music.play();
    },

    update: function (){}
};

function clickTutorial () {
    music.stop();
    console.log('start tutorial');
    game.state.start('tutorial');
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

function clickCredits () {
    music.stop();
    console.log('credits');
    game.state.start('credits');
};
