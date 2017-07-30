const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

const MOVE_INTERVAL = 250;
const TRANSITION_TIME = 500;

var state = undefined;
var canvas, ctx;
var keyboard = {};
var transition = {
	from: null,
	to: null,
	time: TRANSITION_TIME,
	color: "rgba(0, 0, 0, "
};

var sound = true;

var mouse = {
	x: 0,
	y: 0
};

// other constants