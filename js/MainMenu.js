
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('calm');
		this.music.play();


		this.title = this.add.text(100, 100, 'Hamster. Space. Wizard.', {'font': '36px Arial', 'fill':'#fff'});
		this.title = this.add.text(200, 175, 'Click on the hamster space wizard to begin hamulation.', {'font': '12px Arial', 'fill':'#fff'});
		this.playButton = this.add.button(250, 200, 'hsw', this.startGame, this);


	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};
