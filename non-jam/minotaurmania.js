// title:  minotaur mania
// author: cyberhunk studios
// desc:   sacrifices must be made
// script: js

const sprId = {
	PLAYER: 256,
	AXE: 272,
	SACRIFICE: 257
};

const currentMusicTrack = -1;

const gameState = {
	title: true,
	story: false,
	storyTimer: 1200,
	gameStart: false,
	gameWin: false,
	gameStartTimer: 120,
	play: true,
	difficulty: 2,
	waveCleared: false,
	gameOver: false
};

function Game() {
	this.state = function() {};

	this.title = function() {
		playMusic(1);
		drawTitleScreen();
	};
	this.story = function() {
		drawStory();
	};
	this.gameOver = function() {
		playMusic(0);
		drawGameOverScreen();
	};
	this.win = function() {
		drawGameWinScreen();
	};
	this.play = function() {
		playMusic(0);
		cls();
		level.drawMap();
		updateSacs();
		drawUI();
		updatePlayer();
		drawPlayer();
		updateWinCondition();
	};
}

const isFirstRun = true;
const level = null;
const currentMusicTrack = -1;
const game = new Game();
const move = new MovementController();

const waveTimer = {
	remaining: 3600, //60sec at 60fps
	tick: function(rate) {
		this.remaining = this.remaining - rate;
	}
};

function TIC() {
	if (isFirstRun) init();
	game.state();
}

function init() {
	game.state = game.title;
	level = new Level(0, 1);
	waveTimer.remaining = 3600;
	player.x = level.map.start.x;
	player.y = level.map.start.y;
	isFirstRun = false;
}

function Level(id, difficulty) {
	this.maps = [
		{
			id: 0,
			x: 0,
			y: 0,
			start: {
				x: 12,
				y: 16
			},
			spawns: [
				{ x: 210, y: 60, used: false },
				{ x: 50, y: 50, used: false },
				{ x: 75, y: 75, used: false },
				{ x: 200, y: 124, used: false },
				{ x: 180, y: 106, used: false }
			]
		},
		{
			id: 1,
			x: 0,
			y: 0,
			start: {
				x: 12,
				y: 16
			},
			spawns: [
				{ x: 210, y: 60, used: false },
				{ x: 50, y: 50, used: false },
				{ x: 75, y: 75, used: false },
				{ x: 200, y: 124, used: false },
				{ x: 180, y: 106, used: false }
			]
		}
	];

	this.drawMap = function() {
		map(this.map.x, this.map.y, 30, 17, 0, 0, -1, 1, null);
	};

	this.sacrifices = [];

	this.populateSacrifices = function() {
		var sacrifice = void 0;

		for (var i = 0; i < this.map.spawns.length; i++) {
			sacrifice = new Sacrifice();
			sacrifice.spawn(this.map.spawns);
			this.sacrifices.push(sacrifice);
		}
	};

	this.map = this.maps[id];
	this.difficulty = difficulty;

	this.populateSacrifices();
}

function Sacrifice() {
	this.x = 0;
	this.y = 0;
	this.dx = 0;
	this.dy = 0;
	this.spr = sprId.SACRIFICE;
	this.health = 100;
	this.speed = 0.25;
	this.directions = [ 'u', 'd', 'l', 'r' ];
	this.randDirIndex = Math.floor(Math.random() * this.directions.length);
	this.directionSwitchTimer = 30;
	this.spawn = function(spawns) {
		var index = Math.floor(Math.random() * spawns.length);
		var notAllUsed = false;

		if (spawns[index].used === true) {
			for (i = 0; i < spawns.length; i++) {
				if (spawns[i].used === false) {
					notAllUsed = true;
				}
			}

			if (notAllUsed) {
				this.spawn(spawns);
			}
		} else {
			this.x = spawns[index].x;
			this.y = spawns[index].y;
			spawns[index].used = true;
		}
	};

	this.move = function() {
		if (this.directionSwitchTimer <= 0) {
			this.directionSwitchTimer = 10;
			while (!this.canMoveDir(this.directions[this.randDirIndex])) {
				this.randDirIndex = Math.floor(Math.random() * this.directions.length);
			}
		} else {
			this.directionSwitchTimer--;
		}

		if (!this.halted) {
			if (this.canMoveDir('u')) {
				if (this.directions[this.randDirIndex] === 'u') {
					this.dy -= this.speed * level.difficulty;
					this.facing = 'u';
				}
			}
			if (this.canMoveDir('d')) {
				if (this.directions[this.randDirIndex] === 'd') {
					this.dy += this.speed * level.difficulty;
					this.facing = 'd';
				}
			}
			if (this.canMoveDir('l')) {
				if (this.directions[this.randDirIndex] === 'l') {
					this.dx -= this.speed * level.difficulty;
					this.facing = 'l';
				}
			}
			if (this.canMoveDir('r')) {
				if (this.directions[this.randDirIndex] === 'r') {
					this.dx += this.speed * level.difficulty;
					this.facing = 'r';
				}
			}

			this.x += this.dx;
			this.y += this.dy;
		}
	};

	this.stop = function() {
		this.dx = 0;
		this.dy = 0;
	};

	this.canMoveDir = function(direction) {
		if (direction == 'l') {
			if (pix(this.x - 1, this.y) == 0 && pix(this.x - 1, this.y + 3) == 0) return true;
		}
		if (direction == 'r') {
			if (pix(this.x + 4, this.y) == 0 && pix(this.x + 4, this.y + 3) == 0) return true;
		}
		if (direction == 'u') {
			if (pix(this.x, this.y - 1) == 0 && pix(this.x + 3, this.y - 1) == 0) return true;
		}
		if (direction == 'd') {
			if (pix(this.x, this.y + 4) == 0 && pix(this.x + 3, this.y + 4) == 0) return true;
		}
	};
}

function MovementController() {
	this.checkCollision = function(entity) {
		var availableDirections = [];

		if (pix(entity.x - 1, entity.y) == 0 && pix(entity.x - 1, entity.y + entity.h - 1) == 0)
			availableDirections.push('l');
		if (pix(entity.x + entity.w, entity.y) == 0 && pix(entity.x + entity.w - 1, entity.y + entity.h - 1) == 0)
			availableDirections.push('r');
		if (pix(entity.x, entity.y - 1) == 0 && pix(entity.x + entity.w - 1, entity.y - 1) == 0)
			availableDirections.push('u');
		if (pix(entity.x, entity.y + entity.h) == 0 && pix(entity.x + entity.w - 1, entity.y + entity.h) == 0)
			availableDirections.push('d');

		return availableDirections;
	};

	this.moveEntity = function(entity, directions) {
		var availableDirections = this.checkCollision(entity);
		if (directions.indexOf('u') > -1 && availableDirections.indexOf('u') > -1) {
			entity.dy -= 0.5;
			entity.facing = 'u';
		}
		if (directions.indexOf('d') > -1 && availableDirections.indexOf('d') > -1) {
			entity.dy += 0.5;
			entity.facing = 'd';
		}
		if (directions.indexOf('l') > -1 && availableDirections.indexOf('l') > -1) {
			entity.dx -= 0.5;
			entity.facing = 'l';
		}
		if (directions.indexOf('r') > -1 && availableDirections.indexOf('r') > -1) {
			entity.dx += 0.5;
			entity.facing = 'r';
		}

		entity.x += entity.dx;
		entity.y += entity.dy;
	};
}

function hurtSacrifice(index, dmg) {
	var enemy = level.sacrifices[index];
	enemy.health -= dmg;
	if (enemy.health <= 0) {
		waveTimer.remaining += 200;
		if (waveTimer.remaining >= 3600) {
			waveTimer.remaining = 3600;
		}
		level.sacrifices.splice(index, 1);
	}
	sfx(11, 'C-7', -1, 2, 15, 0); // hurt sacrifice sfx
}

const player = {
	x: 8,
	y: 16,
	dx: 0,
	dy: 0,
	w: 6,
	h: 6,
	facing: 'r',
	spr: sprId.PLAYER,
	health: 100,
	attacking: false,
	speed: 1,
	halted: false,
	reset: function() {
		this.x = 8;
		this.y = 16;
		this.dx = 0;
		this.dy = 0;
		this.health = 100;
		this.attacking = false;
		this.halted = false;
	},
	move: function() {
		if (!this.halted) {
			var pressedDirections = [];
			if (btn(0)) {
				pressedDirections.push('u');
			}
			if (btn(1)) {
				pressedDirections.push('d');
			}
			if (btn(2)) {
				pressedDirections.push('l');
			}
			if (btn(3)) {
				pressedDirections.push('r');
			}

			move.moveEntity(this, pressedDirections);
		}
	},
	stop: function() {
		this.dx = 0;
		this.dy = 0;
	},
	attack() {
		if (player.facing == 'r') {
			axe.x = player.x + 4;
			axe.y = player.y - 1;
			axe.flip = 0;
			axe.rotation = [ 0, 1 ];
		}

		if (player.facing == 'l') {
			axe.x = player.x - 6;
			axe.y = player.y - 1;
			axe.flip = 1;
			axe.rotation = [ 0, 1 ];
		}

		if (player.facing == 'u') {
			axe.x = player.x - 1;
			axe.y = player.y - 6;
			axe.flip = 3;
			axe.rotation = [ 1, 2 ];
		}

		if (player.facing == 'd') {
			axe.x = player.x - 1;
			axe.y = player.y + 4;
			axe.flip = 4;
			axe.rotation = [ 1, 2 ];
		}

		if (btnp(4) && axe.cooldown <= 0) {
			axe.hitEnemy();
			axe.cooldown = 30;
			spr(axe.spr, axe.x, axe.y, 0, 1, axe.flip, axe.rotation[0]);
		} else if (axe.cooldown > 15) {
			axe.cooldown--;
			spr(axe.spr, axe.x, axe.y, 0, 1, axe.flip, axe.rotation[0]);
		} else if (axe.cooldown > 0) {
			axe.cooldown--;
			spr(axe.spr, axe.x, axe.y, 0, 1, axe.flip, axe.rotation[1]);
		}
	}
};

const axe = {
	x: 0,
	y: 0,
	spr: [ sprId.AXE ],
	rotation: [ 0, 0 ],
	flip: 0,
	hitEnemy: function() {
		for (var i = 0; i < level.sacrifices.length; i++) {
			var sacrifice = level.sacrifices[i];
			var xDiff = (sacrifice.x + 100) / (axe.x + 100);
			var yDiff = (sacrifice.y + 100) / (axe.y + 100);
			if (xDiff >= 0.95 && xDiff <= 1.05 && yDiff >= 0.95 && yDiff <= 1.05) {
				hurtSacrifice(i, 100);
			}
		}
		sfx(10, 'E-5', -1, 1, 15, 0); // swing axe sfx
	},
	cooldown: 0
};

function drawTitleScreen() {
	cls(0);

	if (btnp(4)) {
		player.reset();
		game.state = game.story;
		sfx(11, 'C-7', -1, 1, 15, 0);
	}
	if (btnp(5)) {
		game.state = game.play;
		sfx(11, 'C-7', -1, 1, 15, 0);
	}

	map(210, 120, 60, 60, 60, 10, 7, 2, null);

	print('press [A] to start', 76, 114);
	print('press [B] to skip intro', 66, 124);
}

const gameOverTimer = 60;
function drawGameOverScreen() {
	cls();

	if (btnp(4) && gameOverTimer <= 0) {
		init();
		game.state = game.play;
	} else if (btnp(5) && gameOverTimer <= 0) {
		init();
		game.state = game.title;
	} else gameOverTimer--;

	print('YOU FAILED TO CLAIM THE THRONE', 42, 45);
	print('press [A] to try again', 68, 65);
	print('press [B] to give up', 75, 85);
}

function drawStory() {
	cls();

	if (gameState.storyTimer > 600) {
		print('Bastard of man and bull, you have been', 16, 10);
		print('exiled to a remote labyrinth in Crete.', 20, 20);
		print('A freak, a menace, an outcast.', 40, 40);
		print('But while your appearance may seem bestial,', 4, 60);
		print('your heart...', 86, 70);
		print('is human...', 176, 120);
		gameState.storyTimer--;
	} else {
		print('But the Gods have shown mercy, giving you', 12, 10);
		print('the chance to reclaim your humanity', 27, 20);
		print('by consuming the sacrifices and heroes', 18, 30);
		print('tossed before you.', 68, 40);
		print('Even more, as your power grows, you', 28, 60);
		print('may one day come to rule over those', 27, 70);
		print('who made you an outcast...', 56, 80);

		print('press [A] to start', 76, 114);

		if (btnp(4)) {
			game.state = game.play;
		}
	}
}

const winTimer = 60;
function drawGameWinScreen() {
	cls(0);

	if (btnp(4) && winTimer <= 0) {
		isFirstRun = true;
		game.state = game.title;
	} else winTimer--;

	print('THANK YOU FOR PLAYING', 65, 4);

	map(210, 120, 60, 60, 60, 15, 7, 2, null);

	print('YOU HAVE CONSUMED THE NECESSARY SACRIFICES', 3, 118);
	print('press [A] to play again.', 63, 128);
}

function updatePlayer() {
	player.stop();
	player.move();
	player.attack();
}

function updateWinCondition() {
	waveTimer.tick(level.difficulty);
	if (waveTimer.remaining > 0 && level.sacrifices.length <= 0) {
		init();
		game.state = game.win;
	} else if (waveTimer.remaining <= 0) {
		init();
		game.state = game.gameOver;
	}
}

function updateSacs() {
	var person = void 0;

	for (var i = 0, len = level.sacrifices.length; i < len; i++) {
		person = level.sacrifices[i];
		person.stop();
		person.move();

		spr(person.spr + i, person.x, person.y, 0);
	}
}

function drawPlayer() {
	spr(player.spr, player.x, player.y, 0);
}

function drawUI() {
	print('TIME:', 164, 0, 1);
	for (i = 0; i < waveTimer.remaining / 75; i++) {
		rect(192 + i, 0, 1, 5, 1);
	}

	print('SACRIFICES: ' + level.sacrifices.length, 60, 0, 1);
	print('LVL: ' + (level.map.id + 1), 0, 0, 1);
}

function playMusic(trackNumber) {
	// tracks are numbered 0-7
	if (currentMusicTrack != trackNumber) {
		music(trackNumber);
		currentMusicTrack = trackNumber;
	}
}

// <TILES>
// 000:3773777777773773337737737733377373373733377333733373773337337733
// 001:9999999999999999999999999999999900000000000000000000000000000000
// 003:0000000000000000000000000000000099999999999999999999999999999999
// 005:0000999900009999000099990000999900009999000099990000999900009999
// 007:9999000099990000999900009999000099990000999900009999000099990000
// 009:9999999999999999999999999999999999990000999900009999000099990000
// 011:9999999999999999999999999999999900009999000099990000999900009999
// 013:0000999900009999000099990000999999999999999999999999999999999999
// 015:9999000099990000999900009999000099999999999999999999999999999999
// 200:7777777777777777777777777777777777777777777777777777777777777777
// 201:7777777777777777777777777777777777777777777777777777777777777777
// 202:7777770077777000777700067770006677700fff77700fff700000ff00000000
// 203:0007777760077777600777770007777700000777ff000000ffff0000ffffffff
// 204:77777777777777777777777777777777777777770000007700000000f4444000
// 205:7777777777777777777777777777777777777777777777770077777000007000
// 206:777777777777777770007777000007770060077700600777006007770ff00777
// 207:7777777777777777777777777777777777777777777777777777777777777777
// 216:7777777777777700777777047777770477777001777700117700011100011111
// 217:7777777000077770440007004444000014444000111444401111444411111144
// 218:0044400004444440044444444444444044444440044444400004444044004444
// 219:00ffffff000ffff4000444440044444404444444000000040000000044444400
// 220:44444444444444444444444444444444444444444eeee44444eeee4444444444
// 221:40000000444000ff44444fff444444ff4444440044444000444ee0004444e004
// 222:fff00777ff000777f00077770000077700000077000000074000400044004400
// 223:7777777777777777777777777777777777777777777777777777777707777777
// 226:0660006606660066066660660666666606606666066006660660006606600066
// 229:0006660000666660066606660660006606666666066666660660006606600066
// 231:0006600000066000000660000006600000066000000000000006600000066000
// 232:01111111111111111111111111111111ff1111110ff1111100fff1117000fff1
// 233:1111111411111111111111111111111111111111111111111111111111111111
// 234:4440004414444004114444001114444411104444110000441104400410044400
// 235:4004440000044440000444440044444440004400444000004444000404444400
// 236:0444444400444444004444440044444400440004004440000004444440004444
// 237:4444000044440000444400404444004444440044440000444440004444460444
// 238:4400444004004440000044400000444444444444444444444000444444000444
// 239:0777777707777777007777770007777740007777440007774440007744440007
// 240:6600006666600666666666666666666666066066660660666600006666000066
// 241:0666666006666660000660000006600000066000000660000666666006666660
// 242:6600066066600660666606606666666066066660660066606600066066000660
// 243:0066660006666660666006666600006666000066666006660666666000666600
// 244:6666666666666666000660000006600000066000000660000006600000066000
// 245:0066600006666600666066606600066066666660666666606600066066000660
// 246:6600066066000660660006606600066066000660660006606666666006666600
// 247:6666660066666660660006606600066066666660666666006600666066000666
// 248:777000ff77777000777777707777777077777777777777777777777777777777
// 249:f1111111ffff1111000ffff00000000000004444700000447770000077777000
// 250:0044000004444000044444444444444444444444444444440000000000000000
// 251:0044444000004400444000044444444444444400444400000000000400000444
// 252:4400644444006666400066660004666600444664004446004004444444000444
// 253:4466644466666444666644006664000064600004040004440000444444004444
// 254:4440004444440004004440040004000440000044440004444440004444440004
// 255:4444400044444400444444004444440044444400444440004444000744000077
// </TILES>

// <SPRITES>
// 000:ffffff0000440000444444000444400004444000040040000000000000000000
// 001:000000000cc00000888800000880000000000000000000000000000000000000
// 002:000000000cc00000222200000220000000000000000000000000000000000000
// 003:0000000004400000888800000880000000000000000000000000000000000000
// 004:0000000004400000222200000220000000000000000000000000000000000000
// 005:000000000cc00000666600000660000000000000000000000000000000000000
// 006:000000000cc00000bbbb00000bb0000000000000000000000000000000000000
// 007:0000000004400000666600000660000000000000000000000000000000000000
// 008:0000000004400000bbbb00000bb0000000000000000000000000000000000000
// 016:0000000000411100004111000040110000400000004000000040000000000000
// 032:0cc00440a9eaa9ea0e900e900aa00aa00cc00440a6faa6fa0f600f600aa00aa0
// 033:0cc00440af2aaf2a02f002f00aa00aa00cc00440ab5aab5a05b005b00aa00aa0
// 096:4444000044440000444400004444000000000000000000000000000000000000
// </SPRITES>

// <MAP>
// 000:400404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 001:9010101010101010101010101010101010101010101010101010101010b09010101010101010109010901010101010101010101010101010101010b09010101010101010101010101010101010101010101010101010101010b09010101010101010101010101010101010101010101010101010101010b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 002:704040404040404040404040404040404040404040404040404040404050704040404040404040704070404040114040404040404040404040404050704040404040404040404040404040404040404040404040404040404050704040404040404040404040404040404040404040404040404040404050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 003:70329010101010101010101010b0a6a64090101010101010101010b0405090101010101010b0407040101010101010b0405040101010101010b0405070409010101010101010101010b0404090101010101010101010101040507040904040b0404040404040404040404040404040404040904040b04050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 004:704070404040404040404040405040504070404040404040404040504050704040404040405040704040404040404050405040404040404040504050704070404040404040404040405040407040404040404040404040404050704040404040404040404040405040407040404040404040404040404050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 005:704070b390101010101010b0b3504050407040901010101010b0405040507040901010b0405040704090101010b0405040504090101010b04050405070407040303030303030303030d040407040101010101010101010b04050704040404040404040404040405040407040404040404040404040404050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 006:7040702070404040404040504050405040704070404040404050405040507040704040504050407040704040405040504050407040404050405040507040704040404040404040404040404070404040404040404040405040507040f04040d0404040404040405040407040404040404040f04040d04050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 007:7040704070c3901010b040504050405040704070409010b04050405040507040704030d04050407040704090405040504050407040904050405040507040f030303030303030303030304040f030303030303030303030d0405070404040404040404040303030d04040f030303040404040404040404050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 008:7040704070c3704040504050405040504070407040704050405040504050704070404040404040404070407040504050405040704070405040504050704040404040404040404040404040404040404040404040404040404050704040404040404040404040404040404040404040404040404040404050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 009:7040704070c370404040405040504050407040704040405040504050405070407040405010b04070407040f030d04050405040704070405040504050704040404040404040404040404040404040404040404040404040404050704040404040404040404040404040404040404040404040404040404050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 010:704070407040f030303030d040504050407040f0303030d04050405040507040f03030d040504070407040404040405040504070407040504050405070409010101010101010101010b040401010101010101010101010b0405070404040404040404040101010b040409010101040404040404040404050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 011:7040707570404040404040404040405040704040404040404050405040507040404040404050407040f03030303030d04050407040704050405040507040704040404040404040404050404040404040404040404040405040507040904040b0404040404040405040407040404040404040904040b04050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 012:70407075f030303030303030303030d040f030303030303030d04050405070403030303030d0407040404040404040404050407040f030d0405040507040f0303030303030303030405040409010101010101010101040504050704040404040404040404040405040407040404040404040404040404050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 013:704070c3c34040404040404040404040404040404040404040404050405070407040404040404070409010b040404040405040704040404040504050704040404040404040404040405040407040404040404040404040504050704040404040404040404040405040407040404040404040404040404050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 014:7040f0303030303030303030303030308330303030303030303030d040507040f030303030303070407040503030303030d040f03030303040d0405070403030303030303030303030d04040f030303030303030303030d040507040f04040d0404040404040404040404040404040404040f04040d04050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 015:704040404040404040404040404040404040404040404040404040404050704040404040404040404070404040404040404040404040404040704050704040404040404040404040404040404040404040404040404040404050704040404040404040404040404040404040404040404040404040404050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 016:f030303030303030303030303030303030303030303030303030303030d0f030303030303030303030f0303030303030303030303030303030f030d0f030303030303030303030303030303030303030303030303030303030d0f030303030303030303030303030303030303030303030303030303030d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 120:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400f1f2f3f4f5f6f7f40404040404040404040404000000000000000000000
// 121:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000408c9cacbcccdcecfc40404040404040404040404000000000000000000000
// 122:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000408d9dadbdcdddedfd40404040404040404040404000000000000000000000
// 123:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000408e9eaebecedeeefe40404040404040404040404000000000000000000000
// 124:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000408f9fafbfcfdfefff40404040404040404040404000000000000000000000
// 125:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040400f5e2e1f5e7e4040404040404040404040404000000000000000000000
// 126:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040404040404040404040404040404040404040404000000000000000000000
// 127:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040404040404040404040404040404040404040404000000000000000000000
// 128:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040404040404040404040404040404040404040404000000000000000000000
// 129:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040404040404040404040404040404040404040404000000000000000000000
// 130:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040404040404040404040404040404040404040404000000000000000000000
// </MAP>

// <WAVES>
// 000:00000000ffffffff00000000ffffffff
// 001:0123456789abcdeffedcba9876543210
// 002:0123456789abcdef0123456789abcdef
// 003:0123456789abcdeffedcba9876543210
// 005:001112334555667788999999aaaa9886
// </WAVES>

// <SFX>
// 000:00f000c010904060c000d000d000e000e000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000100000000000
// 001:03f003e013d023c043b063a08390b380c370e360e300f300f300f300f300f300f300f300f300f300f300f300f300f300f300f300f300f300f300f300300000000000
// 002:64005400b400e400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400f400700000000000
// 003:510041003100310031003100310041004100410041004100410051005100510061006100610061006100610061006100610061006100610061006100300000000000
// 004:050005000500050005000500050005000500050005000500050005000500050005000500050005000500050005000500050005000500050005000500400000000000
// 010:c660b660c660c650c640c630d620d620d610e610e610e600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600400000000000
// 011:410021002100114011401140217031704170f100f100f100f100f100f100f100f100f100f100f100f100f100f100f100f100f100f100f100f100f100600000000000
// </SFX>

// <PATTERNS>
// 000:44000200000046002e4b002e47001600000046002e00000044000200000046002e00000046001600000046002e00000044000200000046002e4b002e47001600000046002e00000044000200000046002e00000046001600000046002e00000044000200000046002e4b002e47001600000046002e00000044000200000046002e00000046001600000046002e00000044000200000046002e4b002e47001600000046002e00000044000200000046002e00000046001600000046002e000000
// 001:d30034100030d30034100030d30034100030d30034100030d30034100030d30034100030d30034100030d30034100030b30034100000b30034100000b30034100000b30034100000b30034100000b30034100000b30034100000b30034100000930034100000930034100000930034100000930034100000930034100000930034100000930034100000930034100030100000100000630036000000630034100000100030100000100000100000630034000000930034000000b30034000000
// 002:d40048000000100000000000d4004800000010000000000084004a00000044004a000000100000000000f40048000000000000000000000000000000f50048000000000000000000f60048f70048f80048f90048fb0048fd0048100000100000d40048000000100000000000d4004800000010000000000084004a00000044004a00000010000000000064004a00000000000000000065004a66004a67004a69004a6b004a6d004a10000000000084004a00000064004a00000044004a000000
// 003:4b004a0000001000000000004b004a000000100000000000bb004a0000008b004a0000001000000000006b004a0000000000000000000000000000006b004a0000000000000000006b004a0000006b004a6c004a6c004a6d004a1000001000004b004a0000001000000000004b004a000000100000000000bb004a0000008b004a0000001000000000009b004a0000000000000000009b004a0000009c004a0000000000009d004a100000000000bb004a0000009b004a0000008b004a000000
// 004:de0046dd0046dc0046db0046da0046d90046d80046d70046d60046d50046d40046d30046000000000000000000000000000000000000000000000000000000000000000000000000000000000000d40046d50046d70046d90046db0046000000be0046bd0046bc0046bb0046ba0046b90046b80046b70046b60046b50046b40046b30046000000000000000000000000000000000000000000000000000000000000000000000000000000000000b40046b50046b70046b90046bb0046000000
// 005:4e00484d00484c00484b00484a00484900484800484700484600484500484400484300480000000000000000000000000000000000000000000000000000000000000000000000000000000000004400484500484700484900484b0048000000fe0046fd0046fc0046fb0046fa0046f90046f80046f70046f60046f50046f40046f30046000000000000000000000000000000000000000000000000000000000000000000000000000000000000f40046f50046f70046f90046fb0046000000
// 007:470002000000000000000000000000000000000000000000470002000000000000000000000000000000000000000000470002000000000000000000000000000000000000000000470002000000000000000000000000000000000000000000470002000000000000000000000000000000000000000000470002000000000000000000000000000000000000000000470002000000000000000000000000000000000000000000470002000000000000000000000000000000000000000000
// 008:4e00484d00484c00484b00484a00484900484800484700484600484500484400484300480000000000000000000000000000000000000000000000000000000000000000000000000000000000004400484500484700484900484b0048000000fe0046fd0046fc0046fb0046fa0046f90046f80046f70046f60046f50046f40046f30046000000000000000000000000000000000000000000000000000000000000000000000000000000000000f40046f50046f70046f90046fb0046000000
// 009:8e00488d00488c00488b00488a00488900488800488700488600488500488400488300480000000000000000000000000000000000000000000000000000000000000000000000000000000000008400488500488700488900488b00480000006e00486d00486c00486b00486a00486900486800486700486600486500486400486300480000000000000000000000000000000000000000000000000000000000000000000000000000000000006400486500486700486900486b0048000000
// </PATTERNS>

// <TRACKS>
// 000:301240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ce00ff
// 001:581000982000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// </TRACKS>

// <PALETTE>
// 000:140c1cb2bab230346d847e6f854c30346524d04648757161597dced27d2c8595a16daa2cd2aa996dc2cadad45edeeed6
// </PALETTE>
