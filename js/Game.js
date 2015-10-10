
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    this.music;

    this.hsw;
    this.spawn_point;
    this.seed_bank;
    this.cursors;
    this.tween;

    this.switch_operation;
    this.switch_operand;
    this.operations;
    this.operands;

    this.explosions;
    this.seedcracks;

    this.beam;
    this.beamTime = 0;
    this.flipTime = 0;
    this.max_fuel = 100;
    this.fuel = this.max_fuel;
    this.fuel_gauge;

    this.hamalog;
    this.dialog;


};

BasicGame.Game.prototype = {

    init: function(level) {
        this.l = level;
        this.level_conf = levels[this.l];
    },

    create: function () {
      game = this.game;

      wx = 800;
      wy = 600;

      level_conf =this.level_conf;

      //add world bounds
      game.world.setBounds(0, 0, wx, wy);
      //game.world.resize(800, 600);
      game.physics.setBoundsToWorld();

      game.add.tileSprite(0, 0, wx, wy, 'space');

      h = level_conf['hsw'];
      this.hsw = create_hsw(800 * h['loc'][0] , 600 * h['loc'][1], game);

      s = level_conf['seeds']
      this.seed_bank = new SeedBank(game);
      for (var a = 0; a < s['vals'].length; a++) {
        loc = s['locs'][a];
        this.seed_bank.addSeed(loc[0] * game.world.width, loc[1] * game.world.height, s['vals'][a]);
      }

      music = game.add.audio('calm');
      music.loop = true;
      music.play();

      //prep explosions
      explosions = game.add.group();
      for (var i = 0; i < 10; i++)
      {
          var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
          explosionAnimation.anchor.setTo(0.5, 0.5);
          explosionAnimation.animations.add('kaboom');
      }

      //prep explosions
      seedcracks = game.add.group();
      for (var i = 0; i < 10; i++)
      {
          var seedCrack = seedcracks.create(0, 0, 'hamsplode', [0], false);
          seedCrack.anchor.setTo(0.5, 0.5);
          seedCrack.animations.add('hamsplode');
      }

      //dialog
      dialog_style = { font: "16px Arial", fill: "#eeeeee", align: "center" };
      dialog = game.add.text(325, 500, "Inventory", dialog_style);
      dialog.addChild(game.add.text(0, 16, '(Z) Laser Type:  ', dialog_style));
      dialog.addChild(game.add.text(0, 32, '(X) Laser Power: ', dialog_style));
      dialog.addChild(game.add.text(0, 48, 'Fuel:' , dialog_style));

      this.fuel_gauge = game.add.bitmapData(100, 10);
      dialog.addChild(game.add.sprite(50, 53,this.fuel_gauge));

      this.operations = new dialog_list(game, h['operations'], 450, 516);
      this.operands = new dialog_list(game, h['operands'], 450, 532);

      dialog.fixedToCamera = true;
      this.dialog = dialog;

      this.spawn_point = new SpawnPoint(level_conf['baddies'], game);
      this.spawn_point.spawn(1);
      game.time.events.loop(level_conf['baddies']['spawn_rate'], this.spawn_point.spawn, this.spawn_point);

      //  Game input
      cursors = game.input.keyboard.createCursorKeys();
      game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

      switch_operation = game.input.keyboard.addKey([Phaser.Keyboard.Z]);
      switch_operand = game.input.keyboard.addKey([Phaser.Keyboard.X]);

      switch_operation.onDown.add(function()
          { hamalog.text = this.operations.next();
            hamalog.alpha=1;
            hamalog.setStyle(dialog_style);
            hamalog.children[0].setStyle(dialog_style);
            game.add.tween(hamalog).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
          }, this
        );
      switch_operand.onDown.add(function()
          { hamalog.children[0].text = this.operands.next();
            hamalog.alpha=1;
            hamalog.setStyle(dialog_style);
            hamalog.children[0].setStyle(dialog_style);
            game.add.tween(hamalog).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
          }, this
        );
      this.cursors = cursors;

      //add operation and operand indicators to hamster
      hamalog = game.add.text(this.hsw.body.centerX, this.hsw.body.y, this.operations.cur, dialog_style);
      hamalog.addChild(game.add.text(10, 0, this.operands.cur, dialog_style));
      hamalog.alpha = 0;
      this.hamalog = hamalog;

      hsw.scale.x = hsw.scale.x * -1; //flip hammy over

      mission = game.add.text(wx /2, wy/8, level_conf["instructions"], {font: "20px Arial", fill: "#eeeeee", align: "center"});
      mission.anchor.setTo(0.5, 0.5);
      game.add.tween(mission).to({alpha:0}, 2000, Phaser.Easing.Linear.None, true, 5000);

      this.hsw=hsw;

    },

    update: function () {
      game = this.game;

      this.fuel_gauge.context.clearRect(0, 0, 100, 10);
      this.fuel_gauge.context.fillRect(0, 0, Math.round(this.fuel), 10);
      // important - without this line, the context will never be updated on the GPU when using webGL
      this.fuel_gauge.dirty = true;

      if (this.fuel < 26) {
         this.fuel_gauge.context.fillStyle = '#f00';
      }
      else if (this.fuel < 50) {
          this.fuel_gauge.context.fillStyle = '#ff0';
      }
      else {
          this.fuel_gauge.context.fillStyle = '#0f0';
      }

      this.spawn_point.update(hsw, this.seed_bank);
      this.seed_bank.update(hsw);

      this.hamster_control();


      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
      {
          this.fireBeam();
      }

      //check the goals of the Game
      mission = this.level_conf['mission'];
      if (mission == 'killemall') {
        if (this.spawn_point.death_toll === this.level_conf['baddies']['vals'].length) {
          this.quitGame();
        }
      }


    },

    hamster_control: function() {
      game = this.game;
      hsw = this.hsw;
      hamalog = this.hamalog;
      fuel = this.fuel;
      cursors = this.cursors;

      hamalog.x = hsw.body.x;
      hamalog.y = hsw.body.y;

      if (cursors.up.isDown && fuel > 0)
      {
          this.fuel = fuel - 1.5;
          game.physics.arcade.accelerationFromRotation(hsw.rotation+300, 1000, hsw.body.acceleration);
          hsw.children[1].start(true, 10, frequency=10, quantity=10);
      }
      else
      {
          hsw.body.acceleration.set(0);
      }

      if (cursors.up.isUp) {
        hsw.children[1].kill();
        if (fuel < this.max_fuel) {
          this.fuel = fuel + 0.75;
        }

      }

      if (cursors.left.isDown)
      {
          hsw.body.angularVelocity = -300;

      }
      else if (cursors.right.isDown)
      {
          hsw.body.angularVelocity = 300;

      }
      else if (cursors.down.isDown)
      {
        if (game.time.now > this.flipTime)
        {
          hsw.anchor.setTo(.5, 1); //so it flips around its middle
          hsw.scale.x = hsw.scale.x * -1; //flip
          hsw.anchor.setTo(.5, .5);
          this.flipTime = game.time.now + 100;
        }
    }

    else
    {
        hsw.body.angularVelocity = 0;
    }
  },

  fireBeam : function () {
      game = this.game;
      hamalog= this.hamalog;
      beam = this.beam;
      hsw = this.hsw;
      if (game.time.now > this.beamTime)
      {
          beam = this.hsw.beams.getFirstExists(false);

          if (beam)
          {

              hamalog.alpha=1;
              hamalog.setStyle({font: "16px Arial", fill: "#ff5555", align: "center"});
              hamalog.children[0].setStyle({font: "16px Arial", fill: "#ff5555", align: "center"})
              game.add.tween(hamalog).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

              beam.number = this.operands.cur;
              beam.op = this.operations.cur;
              x_offset = 25 * Math.cos(hsw.rotation + (Math.PI/2));
              y_offset = 25 * Math.sin(hsw.rotation + (Math.PI/2));

              hsw.children[0].start(false, 100, frequency=10, quantity=3);

              beam.reset(hsw.body.x - x_offset + 25, hsw.body.y - y_offset + 50);
              beam.lifespan = 2000;
              beam.rotation = hsw.rotation;
              game.physics.arcade.velocityFromRotation(hsw.rotation, -400 * hsw.scale.x, beam.body.velocity);
              this.beamTime = game.time.now + 250;
          }
      }

  },


    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        t = this.game.add.text(wx /2, wy/8, "Level Complete!", {font: "20px Arial", fill: "#eeeeee", align: "center"});
        t.anchor.setTo(0.5, 0.5);
        end = this.game.add.tween(t).to({alpha:0}, 2000, Phaser.Easing.Linear.None, true, 500);
        end.onComplete.add(function () {music.stop(); this.l++; this.state.start('Game', true, false, this.l);}, this);

    }

};
