#Hamster Space Wizard

##A HTLM5/JS game that uses the lovely Phaser.io game engine.  

In Hamster Space Wizard, you play the part of James Seeds, a Space Hamster just out of Wizard School.  Your mission is to fly around the universe protecting your Sunflower Seeds (and yourself) from the villainous Space Squids that are mysteriously appearing out of black holes.  You use your eye lasers to blow up the Space Squids.

##Dependencies

1.  Phaser (JS game libary) - but this is included in the repo.

##Running the game

There's nothing fancy going on here so you can use http-server (get this from npm) to run the site on your local or if you're more of a python person you can also run python -m SimpleHTTPServer to start up a web server in the project root.

##Quick tour of the code

#Running the game.
1.  Boot.js	- Pretty much what it sounds like.  Probably not too much reason to touch this.
2.  Preloader.js - Pretty much what it sounds like.  Any new assets (images, sounds) need to be added here.
3.  MainMenu.js	- Yup.  
4.  Game.js	better - The actual game.
5.  index.html - Yup.

#Other libs.
1.  common.js	- Multi-purpose functions and sprite creators.  Needs a refactor (see Refactor Milestone).
2.  levels.js	- configuration file for a level of HSW.  Not even remotely close to being final.
