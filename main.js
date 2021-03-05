const WIDTH = 900, HEIGHT = 600;

//const WIDTH = window.innerWidth * window.devicePixelRatio, HEIGHT = window.innerHeight * window.devicePixelRatio

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);
game.state.add("state0", demo.state0);
game.state.add("state1", demo.state1);
game.state.start("state0");