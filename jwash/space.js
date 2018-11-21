// script: js

var ship = {
  sp: 0,
  x: 112,
  y: 92
};

var bullets = [];
var enemies = initEnemies();

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
  fire();
  animateBullets();
  drawEnemies();
  moveEnemies();
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

function fire() {
  if (btnp(4)) {
    var bullet = {
      sp: 2,
      x: ship.x,
      y: ship.y,
      dx: 0,
      dy: -3
    };
    bullets.push(bullet);
  }
}

function animateBullets() {
  for (i = 0; i < bullets.length; i++) {
    bullets[i].x += bullets[i].dx;
    bullets[i].y += bullets[i].dy;
    spr(bullets[i].sp, bullets[i].x, bullets[i].y);
    if (bullets[i].y < 0) {
      bullets.splice(bullets[i], 1);
    }
  }
}

function drawEnemies() {
  for (i = 0; i < enemies.length; i++) {
    spr(enemies[i].sp, enemies[i].x, enemies[i].y);
  }
}

function initEnemies() {
  var e = [];
  for (i = 0; i < 10; i++) {
    e.push({
      sp: 3,
      x: i * Math.random() * (24 + i),
      y: i * Math.random() * 10
    });
  }
  return e;
}

function moveEnemies() {
  for (i = 0; i < 10; i++) {
    enemies[i].x += 0.2 * Math.sin(enemies[i].y);
    enemies[i].y += 0.33 * Math.cos(enemies[i].x);
  }
}
// <TILES>
// 000:000000000060060000a00a0000aaaa0003a33a3003aaaa3003009030000e0000
// 001:000000000060060000a00a0000aaaa0003a33a3003aaaa30030900300000e000
// 002:0006600000066000000660000000000000000000000000000000000000000000
// 003:0000000000000000005bb00005fbfb00051b1b005bbbbb0b505bb550b000b000
// </TILES>

// <WAVES>
// 000:00000000ffffffff00000000ffffffff
// 001:0123456789abcdeffedcba9876543210
// 002:0123456789abcdef0123456789abcdef
// </WAVES>

// <SFX>
// 000:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000304000000000
// </SFX>

// <PALETTE>
// 000:140c1c44243430346d4e4a4e854c30346524d04648757161597dced27d2c8595a16daa2cd2aa996dc2cadad45edeeed6
// </PALETTE>
