// title:  jam game
// author: team name???
// desc:   whoooooo fuckin knows
// script: js

var x = 212;
var y = 04;

function TIC() {
	if (btn(0)) y--;
	if (btn(1)) y++;
	if (btn(2)) x--;
	if (btn(3)) x++;

	cls();
	spr(0, x, y, 14, 3, 0, 0, 1, 1);
}

// <TILES>
// 000:000f00f0001111f0006f1ff00011114000114110014444100043440001111100
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
