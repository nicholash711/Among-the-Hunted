var text;

demo.credits = function(){};
demo.credits.prototype = {
    preload: function(){
        game.load.image("homeBtn", "assets/sprites/HomeButton.png");
    },

    create: function(){
        game.stage.backgroundColor = '#b5e7ff';
        game.add.text(50, 50, 'Producer: Paul Toprac', { fontSize: '50px'});
        game.add.text(50, 150, 'Associate Producer: Biswajit Saha', { fontSize: '50px'});
        game.add.text(50, 250, 'Programmer: Nicholas Hoang', { fontSize: '50px'});
        game.add.text(50, 350, 'Programmer: Marianne Le', { fontSize: '50px'});
        game.add.text(50, 450, 'Artist: Craig Jaffe', { fontSize: '50px'});
        console.log('Roll the Credits');

        //add home button
        var homeBtn = game.add.button(5, 550, "homeBtn", goBack);
        homeBtn.scale.setTo(1, 1);
    },
    
    update: function(){}
}

function goBack(){
    game.state.start("title");
}