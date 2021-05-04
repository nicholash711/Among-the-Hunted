const WIDTH = 900, HEIGHT = 600;

//const WIDTH = window.innerWidth * window.devicePixelRatio, HEIGHT = window.innerHeight * window.devicePixelRatio

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);
game.state.add("title", demo.title);
game.state.add("credits", demo.credits);
game.state.add("tutorial", demo.tutorial);
game.state.add("normal", demo.normal);
game.state.add("infinite", demo.infinite);
game.state.add("noHealth", demo.noHealth);
game.state.add("noEnergy", demo.noEnergy);
game.state.add("noHealthInfinite", demo.noHealthInfinite);
game.state.add("noEnergyInfinite", demo.noEnergyInfinite);
game.state.add("win", demo.win);
game.state.start("title");