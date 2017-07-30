function Menu() {
	this.nameText = new Text("Plug me in", "64px monospace");
	this.nameText.x = SCREEN_WIDTH - this.nameText.w - 10;

	var temp = Cookies.get("score");
	if (temp === undefined) temp = "0";
	
	this.highScore = new Text("High Score: " + temp, "24px monospace");
	this.highScore.x = 10;
	this.highScore.y = SCREEN_HEIGHT - 32;

	this.play = new Button(new Text("Play", "48px monospace", "#fff", "center"), "#333", "#eee", "#000", 64);
	this.play.text.x = SCREEN_WIDTH / 2 - this.play.text.w / 2;
	this.play.text.y = SCREEN_HEIGHT / 2;

	this.sound = {
		x: SCREEN_WIDTH - assets.sound.width - 5,
		y: SCREEN_HEIGHT - assets.sound.height - 5,
	}

	this.onkeyup = function(e) {
		if (e.key === "m") {
			sound = !sound;

			if (sound)
				assets.music.play();
			else
				assets.music.pause();
		}
	};

	this.mouseClick = function(x, y) {
		if (this.play.over) {
			transition.from = this;
			transition.to = new Play();
			transition.time = 0;
			transition.color = "rgba(0, 0, 0, ";

			if (sound)
				assets.clickEffect.play();
		}

		if (x >= this.sound.x && x <= this.sound.x + assets.sound.width &&
			y >= this.sound.y && y <= this.sound.y + assets.sound.height) {

			sound = !sound;
			Cookies.set("sound", sound, 365);

			if (sound) {
				assets.clickEffect.play();
				assets.music.play();
			} else {
				assets.music.pause();
			}
		}
	};

	this.update = function(delta) {
		if (keyboard[" "] || keyboard["Enter"]) {
			transition.from = this;
			transition.to = new Play();
			transition.time = 0;
			transition.color = "rgba(0, 0, 0, ";
		}

		this.play.update();
	};

	this.draw = function(delta) {
		ctx.drawImage(assets.menuBg, 0, 0);

		this.nameText.draw();
		this.highScore.draw();

		this.play.draw();

		ctx.drawImage(assets.sound, sound ? assets.sound.width : 0, 0, assets.sound.width, assets.sound.height,
			this.sound.x, this.sound.y, assets.sound.width, assets.sound.height);
	};
}