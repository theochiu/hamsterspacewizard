
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		this.game.load.image('title', 'images/main.png');
		this.game.load.image('space', 'images/stars.jpg');
		this.game.load.image('hsw', 'images/hsw.png');
		this.game.load.image('baddie', 'images/baddie.png');
		this.game.load.image('beam', 'images/bullets.png');
		this.game.load.image('eyeglow', 'images/red.png');
		this.game.load.image('rocketflare', 'images/flame.png');
		this.game.load.image('black_hole', 'images/black_hole.png');
		this.game.load.spritesheet('kaboom', 'images/explode.png', 128, 128);
		this.game.load.spritesheet('hamsplode', 'images/hamsplode.png', 128, 128);
		this.game.load.audio('calm', ['music/calm.mp3', 'music/calm.ogg']);
		this.game.load.spritesheet('seed', 'images/seed.png', 26, 49);


	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.

		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.

		if (this.cache.isSoundDecoded('calm') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
