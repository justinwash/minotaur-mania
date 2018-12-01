// title:  minotaur mania
// author: cyberhunk studios
// desc:   sacrifices must be made
// script: js

class Dimen {
    constructor(w, h) {
        this.w = w
        this.h = h
    }
}

class Entity {
    constructor(type, x, y, dimen) {
        this.type = type
        this.x = x
        this.y = y
        this.dimen = dimen
    }
}

var entities = [
    Entity(type = "player", x = 212, y = 4, dimen = Dimen(6, 6))
]

var x = 212;
var y = 04;

function TIC() {
    if (btn(0)) y--;
    if (btn(1)) y++;
    if (btn(2)) x--;
    if (btn(3)) x++;

    cls();
    spr(0, x, y, 14, 3, 0, 0, 1, 1);

    if (btnp(4, 40, 1)) {
        attack()
    }
}

function attack() {
    print("4: 'A' pressed")
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
