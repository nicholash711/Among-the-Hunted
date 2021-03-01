const WIDTH = 800, HEIGHT = 600;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);
game.state.add("state0", demo.state0);
game.state.add("state1", demo.state1);
game.state.start("state1");