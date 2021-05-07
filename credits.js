var text;

demo.credits = function(){};
demo.credits.prototype = {
    preload: function(){
        game.load.image("homeBtn", "assets/sprites/HomeButton.png");
    },

    create: function(){
        game.stage.backgroundColor = '#b5e7ff';
        game.add.text(50, 20, 'Producer: Paul Toprac', { font: "45px Iceland" });
        game.add.text(50, 125, 'Associate Producer: Biswajit Saha', { font: "45px Iceland" });
        game.add.text(50, 225, 'Programmer: Nicholas Hoang', { font: "45px Iceland" });
        game.add.text(50, 325, 'Programmer: Marianne Le', { font: "45px Iceland" });
        game.add.text(50, 425, 'Artist: Craig Jaffe', { font: "45px Iceland" });
        game.add.text(55, 525, 'Title Music: La Vie En Suspense by Tagirijus', { font: "45px Iceland" });
        console.log('Roll the Credits');

        //add home button
        var homeBtn = game.add.button(5, 550, "homeBtn", restartOnClick);
        homeBtn.scale.setTo(1, 1);
    },
    
    update: function(){}
}

function restartOnClick(){
    game.state.start("title");
}
