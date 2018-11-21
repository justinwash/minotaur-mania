// title:  jwash test
// author: jwash
// desc:   test
// script: js

var t = 0;
var x = 96;
var y = 24;

var char = {
  x: 36,
  y: 36,
  dx: 0,
  dy: 0,
  draw: function() {
    spr(1 + (((t % 60) / 30) | 0) * 2, this.x, this.y, 14, 3, 0, 0, 2, 2);
  },
  jumping: 0
};

function TIC() {
  if (btn(2)) {
    if (char.dx >= -2) {
      char.dx -= 0.1;
    }
    char.x += char.dx;
  } else if (btn(3)) {
    if (char.dx <= 2) {
      char.dx += 0.1;
    }
    char.x += char.dx;
  } else {
    char.dx = 0;
  }

  jump(char);

  cls(13);

  drawFloor();

  char.draw();
  print("HELLO WORLD!", 84, 116);
  fall(char);
  t++;
}

function drawFloor() {
  rect(0, 100, 240, 36, 12);
}

function fall(char) {
  print(char.y);
  if (char.y < 52) char.y++;
}

function jump(char) {
  if (btn(0) && char.jumping === 0 && char.y >= 52) {
    char.jumping = 30;
    char.dy += 4;
  } else if (char.jumping > 0) {
    char.jumping--;
    char.dy -= 0.15;
  } else {
    char.jumping == false;
    char.dy = 0;
  }

  char.y -= char.dy;
}

// <TILES>
// 001:efffffffff222222f8888888f8222222f8fffffff8ff0ffff8ff0ffff8ff0fff
// 002:fffffeee2222ffee88880fee22280feefff80fff0ff80f0f0ff80f0f0ff80f0f
// 003:efffffffff222222f8888888f8222222f8fffffff8fffffff8ff0ffff8ff0fff
// 004:fffffeee2222ffee88880fee22280feefff80ffffff80f0f0ff80f0f0ff80f0f
// 017:f8fffffff8888888f888f888f8888ffff8888888f2222222ff000fffefffffef
// 018:fff800ff88880ffef8880fee88880fee88880fee2222ffee000ffeeeffffeeee
// 019:f8fffffff8888888f888f888f8888ffff8888888f2222222ff000fffefffffef
// 020:fff800ff88880ffef8880fee88880fee88880fee2222ffee000ffeeeffffeeee
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
