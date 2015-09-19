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
