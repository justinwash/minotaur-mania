// title:  game title
// author: game developer
// desc:   short description
// script: js

var t = 0;

var ship = {
	sp: 0,
	x: 60,
	y: 60
};
var bullets = [];

function TIC()
{
	_update();
	_draw();
}

function _update(){
	t = t + 1;

	if (t % 8 < 4){
		ship.sp = 0;
	}else {
		ship.sp = 1;
	}

	for (i = 0; i < bullets.length; i++){
		bullets[i].x += bullets[i].dx;
		bullets[i].y += bullets[i].dy;
		if (bullets[i].y < 0){
			bullets.splice(bullets[i], 1);
		}
	}

	if (btn(0)) { ship.y -= 1;}
	if (btn(1)) { ship.y += 1;}
	if (btn(2)) { ship.x -= 1;}
	if (btn(3)) { ship.x += 1;}
	if (btnp(4)) { fire(); }
}

function _draw(){
	cls();
	spr(ship.sp, ship.x, ship.y);

	for (i = 0; i < bullets.length; i++){
		spr(bullets[i].sp, bullets[i].x, bullets[i].y);
	}

}

function fire() {
	var b = {
		sp: 2,
		x: ship.x,
		y: ship.y,
		dx: 0,
		dy: -3
	};
	bullets.push(b);
}

// <TILES>
// 000:006006000066660000066000006dd60006666660060660600000000000000000
// 001:006006000066660000066000006dd6000666666006066060000ee00000eeee00
// 002:0009900000099000000990000000000000000000000000000000000000000000
// </TILES>

// <PALETTE>
// 000:140c1c44243430346d4e4a4e854c30346524d04648757161597dced27d2c8595a16daa2cd2aa996dc2cadad45edeeed6
// </PALETTE>

