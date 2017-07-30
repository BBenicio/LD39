var assets = {
	robot: new Image(28, 41),
	menuBg: new Image(800, 600),
	overWon: new Image(800, 600),
	overLost: new Image(800, 600),
	path: new Image(50, 50),
	box: new Image(40, 40),
	boxHint: new Image(40, 40),
	goal: new Image(40, 40),
	goalInactive: new Image(40, 40),
	tileBg: new Image(800, 800),

	battery: new Image(800, 64),

	sound: new Image(48, 64),

	clickEffect: new Audio("sfx/click.wav"),
	nextLevelEffect: new Audio("sfx/next_level.wav"),
	winEffect: new Audio("sfx/win.wav"),
	loseEffect: new Audio("sfx/lose.wav"),

	tut: [],

	loaded: 0,
	toLoad: 21,

	finished: function() {
		return this.loaded >= this.toLoad;
	}
};

assets.robot.onload = assets.menuBg.onload = assets.overWon.onload = assets.overLost.onload = assets.path.onload =
	assets.box.onload = assets.boxHint.onload = assets.goal.onload = assets.goalInactive.onload = assets.tileBg.onload =
	assets.battery.onload = assets.sound.onload = assets.clickEffect.oncanplay = assets.nextLevelEffect.oncanplay =
	assets.winEffect.oncanplay = assets.loseEffect.oncanplay = function() {

	assets.loaded++;
}

assets.robot.src = "img/robot.png";
assets.menuBg.src = "img/menu_bg.png";
assets.overWon.src = "img/game_over_won_bg.png";
assets.overLost.src = "img/game_over_lost_bg.png";
assets.path.src = "img/path.png";
assets.box.src = "img/box.png";
assets.boxHint.src = "img/box_hint.png";
assets.goal.src = "img/goal.png";
assets.goalInactive.src = "img/goal_inactive.png";
assets.tileBg.src = "img/tile_bg.png";

assets.battery.src = "img/battery.png";

assets.sound.src = "img/sound.png";

for (var i = 0; i < 5; i++) {
	assets.tut.push(new Image());
	assets.tut[i].onload = assets.battery.onload;
	assets.tut[i].src = "img/tut" + i + ".png";
}