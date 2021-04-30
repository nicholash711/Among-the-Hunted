# Among-the-Hunted
## CS 329E Project

You are a harp seal just abandoned by your mother, left to fend for yourself. You are being hunted for your soft fur. Try your best to survive.

### Project Tree

```
Among-the-Hunted/                  //
├─ assets/                         //
│  ├─ actionscreens/               //
│  │  ├─ healthscreen.png          //died from loss of life
│  │  ├─ starvationscreen.png      //died from no energy left
│  │  └─ winningscreen.png         //killed all hunters
│  ├─ sounds/                      //
│  │  ├─ effects/                  //
│  │  │  ├─ hunterFall.mp3         //sound of hunter death
│  │  │  ├─ iceStep.mp3            //no longer used; complaints from testplayers: too crunchy
│  │  │  ├─ sealSpin.mp3           //sound when seal spins and jabs
│  │  │  ├─ snowStep1.mp3          //unused
│  │  │  └─ snowStep2.mp3          //used for seal walking
│  │  └─ music/                    //
│  │     └─ suspense.mp3           //music for the title screen
│  ├─ sprites/                     //
│  │  ├─ Bullet.png                //
│  │  ├─ Fish.png                  //
│  │  ├─ HomeButton.png            //
│  │  ├─ infinite-btn.png          //
│  │  ├─ normal-btn.png            //
│  │  ├─ StartButton.png           //
│  │  └─ tutorial-btn.png          //
│  ├─ spritesheets/                //
│  │  ├─ EnergyBar.png             //
│  │  ├─ HarpSeal.png              //
│  │  ├─ harp_seal_shooting.png    //
│  │  ├─ healthBar.png             //
│  │  ├─ hunter.png                //
│  │  ├─ jAttack.png               //
│  │  └─ kAttack.png               //
│  └─ tilemaps/                    //
│     ├─ Ground.png                //
│     ├─ Map.json                  //
│     ├─ Rocks.png                 //
│     ├─ Tutorial.json             //
│     └─ Water.png                 //
├─ README.md                       //
├─ style.css                       //
├─ index.html                      //webpage, fetches all js files and loads main
├─ main.js                         //loads title js file
├─ title.js                        //title screen
├─ tutorial.js                     //recommend doing tutorial first
├─ normal.js                       //and then normal mode to get used to the game
├─ infinite.js                     //and then die, infinitely
├─ noEnergy.js                     //for normal mode
├─ noEnergyInfinite.js             //infinite mode
├─ noHealth.js                     //normal mode
├─ noHealthInfinite.js             //infinite
└─ win.js                          //normal, there is no winning for infinite

```