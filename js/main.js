(function() {
	var lastTimestamp = 0;

	function init() {
		canvas = document.getElementById("screen");
		ctx = canvas.getContext("2d");

		canvas.width = SCREEN_WIDTH;
		canvas.height = SCREEN_HEIGHT;

		document.body.onkeydown = function(e) {
			keyboard[e.key] = true;

			if (e.key.startsWith("Arrow") || e.key == " ")
				e.preventDefault();
		};

		document.body.onkeyup = function(e) {
			delete keyboard[e.key];

			if (e.key.startsWith("Arrow") || e.key == " ")
				e.preventDefault();
		};

		state = new Menu();

		window.requestAnimationFrame(tick);
	}


	function tick(timestamp) {
		window.requestAnimationFrame(tick);

		var delta = timestamp - lastTimestamp;

		update(delta);
		draw(delta);

		lastTimestamp = timestamp;
	}

	function update(delta) {
		if (state != undefined) {
			state.update(delta);
		}
	}

	function draw(delta) {
		ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

		if (state != undefined) {
			state.draw(delta);
		}
	}

	document.body.onload = init;
})();