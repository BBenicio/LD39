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
	
	this.pausedText = new Text("Paused", "48px monospace", "#fff", "center");
	this.pausedText.x = SCREEN_WIDTH / 2 - this.pausedText.w / 2;
	this.pausedText.y = SCREEN_HEIGHT / 2;

	this.menuButton = new Button(new Text("Menu", "32px monospace"), "#333", "#eee", "#000", 48);
	this.menuButton.text.x = SCREEN_WIDTH / 2 - this.menuButton.text.w - 20;
	this.menuButton.text.y = this.pausedText.y + 48;

	this.continueButton = new Button(new Text("Continue", "32px monospace"), "#333", "#eee", "#000", 48);
	this.continueButton.text.x = SCREEN_WIDTH / 2 + 20;
	this.continueButton.text.y = this.pausedText.y + 48;

	this.onkeyup = function(e) {
		if (e.key === "Escape" || e.key === "p") {
			this.paused = !this.paused;

			if (sound)
				assets.clickEffect.play();
		}
	};

	this.mouseClick = function(x, y) {
		if (this.paused) {
			if (this.menuButton.over) {
				transition.from = this;
				transition.to = new Menu();
				transition.time = 0;
				transition.color = "rgba(0, 0, 0, ";

				if (sound)
					assets.clickEffect.play();
			} else if (this.continueButton.over) {
				this.paused = !this.paused;

				if (sound)
					assets.clickEffect.play();
			}
		}
	};

	this.update = function(delta) {
		if (this.paused) {
			this.menuButton.update();
			this.continueButton.update();
			return;
		}

		if (this.battery.value <= 0) {
			transition.from = this;
			transition.to = new GameOver(false, this.score);
			transition.time = 0;
			transition.color = "rgba(0, 0, 0, ";

			if (sound)
				assets.loseEffect.play();
			
			return;
		}

		if (this.level.isOver() || (/*DEBUG*/ transition.time > TRANSITION_TIME && keyboard["+"])) {
			console.log("next level");
			this.score += Math.round((this.battery.value * 1000) * (this.level.id + 1));

			var next = createLevel(this.level.id + 1);
			if (next == null) {
				transition.from = this;
				transition.to = new GameOver(true, this.score);
				transition.time = 0;
				transition.color = "rgba(0, 0, 0, ";

				if (sound)
					assets.winEffect.play();
				return;
			}

			this.level = next;
			this.battery.value = 1;

			transition.from = this;
			transition.to = this;
			transition.time = 0;
			transition.color = "rgba(128, 128, 0, ";

			if (sound)
				assets.nextLevelEffect.play();
		}

		this.level.update(delta);

		if (keyboard["ArrowRight"] && this.level.movePlayer("right")) {
			this.battery.value -= 0.022;
		} else if (keyboard["ArrowLeft"] && this.level.movePlayer("left")) {
			this.battery.value -= 0.022;
		} else if (keyboard["ArrowDown"] && this.level.movePlayer("down")) {
			this.battery.value -= 0.022;
		} else if (keyboard["ArrowUp"] && this.level.movePlayer("up")) {
			this.battery.value -= 0.022;
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
			this.menuButton.draw();
			this.continueButton.draw();
		}
	};
}