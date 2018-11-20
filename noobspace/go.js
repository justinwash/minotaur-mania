// title:  meals test
// author: meals
// desc:   a test
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


  var sprinting = sprint(char);
  var sprintingAddition = sprinting ? 10 : 0;
  var text = sprinting ? "SPRINT + " + sprintingAddition : "NO SPRINT";

  if (btn(2)) {


    if (char.dx >= -2) {
      char.dx -= (0.1 + sprintingAddition);
    }
    char.x += char.dx;


  } else if (btn(3)) {


    if (char.dx <= 2) {
      char.dx += 0.1 + sprintingAddition;
    }
    char.x += char.dx;

    
  } else {
    char.dx = 0;
  }

  jump(char);
  cls(13);
  drawFloor();
  char.draw();
  print(text, 84, 116);
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

function sprint() {
  if (btn(4)) {
    return true;
  } else {
    return false;
  }
}
