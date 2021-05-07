var demo = {}, music;

demo.title = function(){};
demo.title.prototype = {
    preload: function(){
        game.load.image('tutorial-btn', 'assets/sprites/tutorial-btn.png');
        game.load.image('normal-btn', 'assets/sprites/normal-btn.png');
        game.load.image('hard-btn', 'assets/sprites/hard-btn.png');
        game.load.image('infinite-btn', 'assets/sprites/infinite-btn.png');
        game.load.image('credits-btn', 'assets/sprites/credits-btn.png');
        game.load.audio("music", "assets/sounds/music/suspense.mp3");
    },

    create: function(){
        game.stage.backgroundColor = '#b5e7ff';
        game.add.text(50, 50, 'Among The Hunted', { fontSize: '50px'});
        game.add.text(50, 150, 'You are a harp seal\njust abandoned by your mother,\nleft to fend for yourself.\nYou are being hunted\nfor your soft fur.\nTry your best to survive.', { fontSize: '30px'});
        game.add.text(game.camera.centerX + 150, 70, 'Choose a mode to begin', { fontSize: '18px'});
        console.log('Welcome Haha');
        var tutorialBtn = game.add.button(50, 450, "tutorial-btn", clickTutorial);
        tutorialBtn.scale.setTo(2, 2);
        var normalBtn = game.add.button(game.camera.centerX + 150, 100, "normal-btn", clickNormal);
        normalBtn.scale.setTo(2, 2);
        var hardBtn = game.add.button(game.camera.centerX + 150, 200, "hard-btn", clickHard);
        hardBtn.scale.setTo(2, 2);
        var infiniteBtn = game.add.button(game.camera.centerX + 150, 300, "infinite-btn", clickInfinite);
        infiniteBtn.scale.setTo(2, 2);
        var creditsBtn = game.add.button(game.camera.centerX + 150, 450, "credits-btn", clickCredits);
        creditsBtn.scale.setTo(2, 2);


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

function clickHard () {
    music.stop();
    console.log('start hard');
    game.state.start('hard');
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
