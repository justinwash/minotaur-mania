// script: js

var ship = {
  sp: 0,
  x: 112,
  y: 92
};

function TIC() {
  cls();
  _update();
  _draw();
}

function _draw() {
  spr(ship.sp, ship.x, ship.y);
}

function _update() {
  moveShip();
  animatePropulsion();
}

function animatePropulsion() {
  if (ship.sp === 0) ship.sp = 1;
  else ship.sp = 0;
}

function moveShip() {
  if (btn(0)) ship.y--;
  if (btn(1)) ship.y++;
  if (btn(2)) ship.x--;
  if (btn(3)) ship.x++;
}

function fire() {}
