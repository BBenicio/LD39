function Play() {
	this.battery = {
		text: new Text("Battery", "16px monospace", "#fff", "bottom"),
		bg: "black",
		height: 64,
		value: 1
	};

	this.battery.text.x = 10;
	this.battery.text.y = SCREEN_HEIGHT - this.battery.height + 10;

	this.score = 0;

	this.level = createLevel(0);

	this.paused = false;
	
	this.pausedText = new Text("Paused", "32px monospace", "#fff", "center");
	this.pausedText.x = SCREEN_WIDTH / 2 - this.pausedText.w / 2;
	this.pausedText.y = SCREEN_HEIGHT / 2;

	this.onkeyup = function(e) {
		if (e.key === "Escape" || e.key === "p") {
			this.paused = !this.paused;
		}
	};

	this.update = function(delta) {
		if (this.paused) return;

		if (this.battery.value <= 0) {
			//state = new GameOver(false, this.score); // game over (lost)

			transition.from = this;
			transition.to = new GameOver(false, this.score);
			transition.time = 0;
			transition.color = "rgba(0, 0, 0, ";
			
			return;
		}

		if (this.level.isOver()) {
			console.log("next level");
			this.score += Math.round(this.battery.value * 100);

			var next = createLevel(this.level.id + 1);
			if (next == null) {
				//state = new GameOver(true, this.score); // game over (won)
				transition.from = this;
				transition.to = new GameOver(true, this.score);
				transition.time = 0;
				transition.color = "rgba(0, 0, 0, ";
				return;
			}

			this.level = next;
			this.battery.value = 1;

			transition.from = this;
			transition.to = this;
			transition.time = 0;
			transition.color = "rgba(128, 128, 0, ";
		}

		this.level.update(delta);

		if (keyboard["ArrowRight"] && this.level.movePlayer("right")) {
			this.battery.value -= 0.01;
		} else if (keyboard["ArrowLeft"] && this.level.movePlayer("left")) {
			this.battery.value -= 0.01;
		} else if (keyboard["ArrowDown"] && this.level.movePlayer("down")) {
			this.battery.value -= 0.01;
		} else if (keyboard["ArrowUp"] && this.level.movePlayer("up")) {
			this.battery.value -= 0.01;
		}

		if (keyboard["r"]) {
			this.level = createLevel(this.level.id);

			transition.from = this;
			transition.to = this;
			transition.time = 0;
			transition.color = "rgba(32, 32, 0, ";
		}
	};

	this.draw = function(delta) {
		this.level.draw(delta);

		ctx.fillStyle = this.battery.bg;
		ctx.fillRect(0, SCREEN_HEIGHT - this.battery.height, SCREEN_WIDTH, this.battery.height);

		ctx.drawImage(assets.battery, 0, 0, SCREEN_WIDTH * this.battery.value, this.battery.height,
			0, SCREEN_HEIGHT - this.battery.height, SCREEN_WIDTH * this.battery.value, this.battery.height);

		ctx.strokeStyle = "#fff";
		ctx.strokeRect(0, SCREEN_HEIGHT - this.battery.height, this.battery.text.x - 5, 1);
		ctx.strokeRect(this.battery.text.x + this.battery.text.w + 5, SCREEN_HEIGHT - this.battery.height, SCREEN_WIDTH, 1);

		this.battery.text.draw();

		if (this.level.id < 5) {
			ctx.drawImage(assets.tut[this.level.id], 20, 20);
		}

		if (this.paused) {
			ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
			ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

			this.pausedText.draw();
		}
	};
}