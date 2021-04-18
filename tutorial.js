var player, moveKeys, enemies, iceWalk, spin, sealSpin, hunterFall, hunterGun, map, healthBar, energyBar, energy, graphics, isSpin, isJab, spinTime, jabTime;
var jImage, kImage;
var attacking = false, allowSpin = true, allowJab = true, firing = false;

demo.tutorial= function(){};
demo.tutorial.prototype = {
    preload: function(){},
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, WIDTH, HEIGHT);
        game.stage.backgroundColor = "#dce3e8";
    },
    update: function(){}
}