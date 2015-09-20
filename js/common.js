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

function create_hsw(game) {
  hsw = game.add.sprite(game.world.centerX, game.world.centerY, 'hsw');
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
