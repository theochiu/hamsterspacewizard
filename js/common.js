function dialog_list(game, a, x, y) {
  this.a = a;
  this.i = 0;
  this.cur = this.a[this.i];
  this.dialog = false;

  this.s = "";

  this.items = game.add.group();
  this.items.x = x;
  this.items.y = y;
  //this.t = game.add.text(x, y, this.cur, {fill:'#fff', font:'16px Arial'});

  for (j=0; j<a.length; j++) {
    this.items.add(game.add.text(j * 10, 0, this.a[j], {fill:'#aaa', font:'16px Arial'}));
  }

  this.items.children[0].setStyle({fill:'#ff0', font:'16px Arial'});
  this.items.setAll('fixedToCamera', true);

  this.next = function () {
    if (this.i == this.a.length-1) {
      this.i = 0;
    }
    else {
      this.i = this.i + 1;
    }
    this.cur = this.a[this.i];
    this.items.setAll('fill', '#aaa');
    this.items.children[this.i].setStyle({fill:'#ff0', font:'16px Arial'})

    return this.cur;
  }

}

function create_hsw(x, y, game) {
  hsw = game.add.sprite(x, y, 'hsw');
  //  hamster physics settings
  game.physics.arcade.enableBody(hsw);
  game.physics.enable(hsw, Phaser.Physics.ARCADE);

  hsw.body.collideWorldBounds=true;
  game.camera.follow(hsw);

  hsw.anchor.setTo(0.5, 0.5);

  //glowing eyes
  emitter = game.add.emitter(0, -25, 5);
  emitter.makeParticles('eyeglow');

  //rocket flare
  emitter2 = game.add.emitter(11, 35, 10);
  emitter2.makeParticles('rocketflare');
  emitter2.gravity = 500;

  hsw.addChild(emitter);
  hsw.addChild(emitter2);

  hsw.body.drag.set(100);
  hsw.body.maxVelocity.set(200);

  hsw.alpha=0;

  game.add.tween(hsw).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);

  //  hamster eye beams
  beams = game.add.group();
  beams.enableBody = true;
  beams.physicsBodyType = Phaser.Physics.ARCADE;
  beams.createMultiple(40, 'beam');
  beams.setAll('anchor.x', 0.5);
  beams.setAll('anchor.y', 0.5);

  hsw.beams = beams;

  return hsw;

}

function SeedBank(game) {
  this.game = game;
  this.seeds = game.add.group();
  this.seeds.enableBody = true;
  this.seeds.physicsBodyType = Phaser.Physics.ARCADE;

  this.addSeed = function (x, y, number) {
    seed = game.add.sprite(x, y, 'seed');
    seed.anchor.setTo(0.5, 0.5);
    style = {font: "20px Arial", fill: "#e9deb1", align: "center" };
    seed.number = number;
    seed.addChild(game.add.text(-7, 0, number, style));
    this.game.physics.arcade.enableBody(seed);
    this.game.physics.enable(seed, Phaser.Physics.ARCADE);
    this.game.add.tween(seed).to({angle: 360}, 8000, Phaser.Easing.Linear.None, true, 0, -1);
    seed.body.collideWorldBounds=true;

    this.seeds.add(seed);

  }

  this.getClosest = function(number) {
    diffs = [];
    for (var i = 0; i < this.seeds.length; i++) {
      diff = this.seeds.children[i].number + number;
      diffs.push(Math.abs(diff));
    }

    mi = Math.min.apply(null, diffs);
    j = diffs.indexOf(mi);
    return this.seeds.children[j];

  }

  this.update = function (hsw) {
    //baddie physics
    for (i = 0; i < this.seeds.length; i++) {
      //this.game.physics.arcade.moveToObject(this.seeds.children[i], hsw);
      //this.game.physics.arcade.overlap(hsw.beams, this.seeds.children[i], this.collisionHandler, null, game);
      this.game.physics.arcade.collide(hsw, this.seeds.children[i]);

    }

    this.game.physics.arcade.collide(this.seeds);

  }

}

function create_baddies(game) {
  baddies = game.add.group();
  baddies.enableBody = true;
  baddies.physicsBodyType = Phaser.Physics.ARCADE;
  return baddies;
}

function create_baddie(x, y, number, game) {
    baddie = game.add.sprite(x, y, 'baddie');
    baddie.anchor.setTo(0.5, 0.5);
    var style = { font: "20px Arial", fill: "#ffff00", align: "center" };
    baddie.number = number;
    baddie.addChild(game.add.text(-6, -30, number, style));
    game.physics.arcade.enableBody(baddie);
    game.physics.enable(baddie, Phaser.Physics.ARCADE);
    baddie.scale.x = (0.1);
    baddie.scale.y = (0.1);
    game.add.tween(baddie.scale).to({ x: 1, y:1 }, 1000, Phaser.Easing.Linear.None, true);
    baddie.bringToTop();
    return baddie;
}

function SpawnPoint(config, game) {
  this.x = config['loc'][0] * game.world.width;
  this.y = config['loc'][1] * game.world.height;
  this.config = config;
  this.game = game;
  //add black hole
  this.black_hole = game.add.sprite(this.x, this.y, 'black_hole');
  this.death_toll = 0;
  //center this block hole to the location coord
  this.black_hole.x = this.black_hole.x - (this.black_hole.width / 2);
  this.black_hole.y = this.black_hole.y - (this.black_hole.height / 2);

  this.baddies = create_baddies(game);
  this.spawned = 0;

  this.spawn = function() {
      if (this.config['infinite'] === false) {
        if (this.spawned < this.config['vals'].length) {
          number = this.config['vals'][this.spawned];
          baddie = create_baddie(this.x, this.y, number, this.game);
          baddie.animations.add('kaboom');
          baddie.body.bounce.setTo(1, 1);
          this.baddies.add(baddie);
          this.spawned++;
        }
      }
      //infinite baddies
      else {
        if (this.spawned >= this.config['vals'].length) {this.spawned=0;}

        number = this.config['vals'][this.spawned];
        baddie = create_baddie(this.x, this.y, number, this.game);
        baddie.animations.add('kaboom');
        baddie.body.bounce.setTo(1, 1);
        this.baddies.add(baddie);
        this.spawned++;
      }

  }

  this.collisionHandler = function (baddie, bullet) {
      //  When a bullet hits an alien we kill them both
      baddie.number = eval(baddie.number + bullet.op + bullet.number);
      baddie.children[0].text = baddie.number;
      if (baddie.number == 0) {
        baddie.kill();
        this.death_toll++;
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(baddie.x, baddie.y);
        explosionAnimation.play('kaboom', 30, false, true);

      }

      bullet.kill();
  },


  this.update = function(hsw, seed_bank) {
      //baddie physics
      for (var i = 0; i < this.baddies.length; i++) {
        number = this.baddies.children[i].number;
        seed = seed_bank.getClosest(number);
        this.game.physics.arcade.moveToObject(this.baddies.children[i], seed);
        this.game.physics.arcade.overlap(hsw.beams, this.baddies.children[i], this.collisionHandler, null, this);
        this.game.physics.arcade.collide(hsw, this.baddies.children[i]);

      }

      this.game.physics.arcade.collide(this.baddies);
  }

}
