/* TODO
 *
 * Puzzles
 * Music
 * Balancing
 * Optmizing (only if there's enough time)
 */

(function() {
	var lastTimestamp = 0;
	var loaded = false;

	sound = Cookies.get("sound") != false.toString(); // I can't believe I'm doing this...

	function init() {
		canvas = document.getElementById("screen");
		ctx = canvas.getContext("2d");

		canvas.width = SCREEN_WIDTH;
		canvas.height = SCREEN_HEIGHT;

		document.body.onkeydown = function(e) {
			keyboard[e.key] = true;

			if (e.key.startsWith("Arrow") || e.key == " ")
				e.preventDefault();

			if (state.onkeydown != undefined)
				state.onkeydown(e);
		};

		document.body.onkeyup = function(e) {
			delete keyboard[e.key];

			if (e.key.startsWith("Arrow") || e.key == " ")
				e.preventDefault();

			if (state.onkeyup != undefined)
				state.onkeyup(e);
		};

		canvas.onclick = function(e) {
			if (state.mouseClick != undefined) {
				state.mouseClick(e.layerX, e.layerY);
			}
		};

		canvas.onmousemove = function(e) {
			mouse.x = e.layerX;
			mouse.y = e.layerY;
		};

		state = new Menu();

		window.requestAnimationFrame(tick);
	}


	function tick(timestamp) {
		window.requestAnimationFrame(tick);

		if (!assets.finished()) {
			document.getElementById("loading-bar").style.width = 100 * (assets.loaded / assets.toLoad) + "%";
			console.log("assets not finished loading (" + assets.loaded + "/" + assets.toLoad + ")");

			return;
		} else if (!loaded) {
			document.getElementById("loading-screen").style.display = "none";
			document.getElementById("loading-bar").style.width = 100 * (assets.loaded / assets.toLoad) + "%";
			loaded = true;
		}

		var delta = timestamp - lastTimestamp;

		if (transition.from != null && transition.to != null) {
			transition.time += delta;

			state = transition.time < TRANSITION_TIME / 2 ? transition.from : transition.to;

			draw(state);
			// sin goes 0 -> 1 -> 0 for input (0 -> PI / 2 -> PI)
			var alpha = Math.sin(transition.time * Math.PI / TRANSITION_TIME);
			
			ctx.fillStyle = transition.color + alpha + ")" ;
			ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

			if (transition.time >= TRANSITION_TIME) {
				transition.from = transition.to = null;
			}
		} else {
			update(delta);
			draw(delta);
		}

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

	var bodyLoaded = false;
	document.body.onload = function() {
		bodyLoaded = true;
	}

	var loadingBar = function() {
		if (!assets.finished()) {
			document.getElementById("loading-bar").style.width = 100 * (assets.loaded / assets.toLoad) + "%";
			console.log("assets not finished loading (" + assets.loaded + "/" + assets.toLoad + ")");

			window.requestAnimationFrame(loadingBar);
		} else if (bodyLoaded) {
			init();
		} else {
			window.requestAnimationFrame(loadingBar);
		}
	};
	loadingBar();
	
})();