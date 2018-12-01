// title:  minotaur mania
// author: cyberhunk studios
// desc:   sacrifices must be made
// script: js

const testMap = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
var wallSpr = 352;

function drawTestmap() {
	for (i = 0; i < testMap.length; i++) {
		for (x = 0; x < testMap[i].length; x++) {
			if (testMap[i][x] == 1) spr(wallSpr, x * 4, i * 4);
		}
	}
}

const player = {
	x: 24,
	y: 8,
	dx: 0,
	dy: 0,
	facing: 'r',
	spr: 256,
	lives: 3,
	health: 100,
	attacking: false,
	speed: 1,
	halted: false,
	move: function() {
		if (!this.halted) {
			if (this.canMoveDir('u')) {
				if (btn(0)) this.dy -= 0.5;
			}
			if (this.canMoveDir('d')) {
				if (btn(1)) this.dy += 0.5;
			}
			if (this.canMoveDir('l')) {
				if (btn(2)) {
					this.dx -= 0.5;
					this.facing = 'l';
				}
			}
			if (this.canMoveDir('r')) {
				if (btn(3)) {
					this.dx += 0.5;
					this.facing = 'r';
				}
			}

			this.x += this.dx;
			this.y += this.dy;
		}
	},
	stop: function() {
		this.dx = 0;
		this.dy = 0;
	},
	canMoveDir(direction) {
		if (direction == 'l') {
			if (pix(this.x - 1, this.y) == 0 && pix(this.x - 1, this.y + 5) == 0)
				return true;
		}
		if (direction == 'r') {
			if (pix(this.x + 6, this.y) == 0 && pix(this.x + 6, this.y + 5) == 0)
				return true;
		}
		if (direction == 'u') {
			if (pix(this.x, this.y - 1) == 0 && pix(this.x + 5, this.y - 1) == 0)
				return true;
		}
		if (direction == 'd') {
			if (pix(this.x, this.y + 6) == 0 && pix(this.x + 5, this.y + 6) == 0)
				return true;
		}
	},
	attack() {
		if (player.facing == 'r') {
			axe.x = player.x + 6;
			axe.y = player.y - 2;
			axe.flip = 0;
		}

		if (player.facing == 'l') {
			axe.x = player.x - 8;
			axe.y = player.y - 2;
			axe.flip = 1;
		}

		if (btn(4) && axe.cooldown <= 0) {
			axe.cooldown = 30;
			spr(axe.spr[0], axe.x, axe.y, 0, 1, axe.flip);
		} else if (axe.cooldown > 15) {
			axe.cooldown--;
			spr(axe.spr[0], axe.x, axe.y, 0, 1, axe.flip);
		} else if (axe.cooldown > 0) {
			axe.cooldown--;
			axe.rotation = 0;
			spr(axe.spr[1], axe.x, axe.y, 0, 1, axe.flip, axe.rotation);
		}
	}
};

const axe = {
	x: 0,
	y: 0,
	spr: [272, 273],
	rotation: 0,
	flip: 0,
	hitEnemy: function() {
		//do stuff
	},
	cooldown: 0
};

function TIC() {
	cls();
	drawTestmap();
	updatePlayer();
	spr(player.spr, player.x, player.y, 0);
}

function updatePlayer() {
	player.stop();
	player.move();
	player.attack();
}

// <TILES>
// 000:3773777777773773337737737733377373373733377333733373773337337733
// </TILES>

// <SPRITES>
// 000:ffffff0000440000444444000444400004444000040040000000000000000000
// 001:000000000cc00cc08888eeee08800ee0000000000cc00cc06666999906600990
// 002:000000000cc00cc02222dddd02200dd0000000000cc00cc0bbbb55550bb00550
// 003:00000000044004408888eeee08800ee000000000044004406666999906600990
// 004:00000000044004402222dddd02200dd00000000004400440bbbb55550bb00550
// 005:0cc00440a9eaa9ea0e900e900aa00aa00cc00440a6faa6fa0f600f600aa00aa0
// 006:0cc00440af2aaf2a02f002f00aa00aa00cc00440ab5aab5a05b005b00aa00aa0
// 016:4110000041100000401000004000000040000000400000000000000000000000
// 017:0000000000000000000000000000000044444400000011000001110000000000
// 096:4444000044440000444400004444000000000000000000000000000000000000
// </SPRITES>

// <WAVES>
// 000:00000000ffffffff00000000ffffffff
// 001:0123456789abcdeffedcba9876543210
// 002:0123456789abcdef0123456789abcdef
// </WAVES>

// <SFX>
// 000:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000304000000000
// </SFX>

// <PALETTE>
// 000:140c1cb2bab230346d847e6f854c30346524d04648757161597dced27d2c8595a16daa2cd2aa996dc2cadad45edeeed6
// </PALETTE>
