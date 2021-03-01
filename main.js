const WIDTH = 640, HEIGHT = 480;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);
game.state.add("state0", demo.state0);
game.state.add("state1", demo.state1);
game.state.start("state0");