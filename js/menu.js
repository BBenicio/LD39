function Menu() {
	this.nameText = new Text("GAME NAME", "64px monospace");
	this.nameText.x = SCREEN_WIDTH - this.nameText.w - 10;

	var temp = Cookies.get("score");
	if (temp === undefined) temp = "0";
	
	this.highScore = new Text("High Score: " + temp, "24px monospace");
	this.highScore.x = 10;
	this.highScore.y = SCREEN_HEIGHT - 32;

	this.play = new Button(new Text("Play", "48px monospace", "#fff", "center"), "#333", "#eee", "#000", 64);
	this.play.text.x = SCREEN_WIDTH / 2 - this.play.text.w / 2;
	this.play.text.y = SCREEN_HEIGHT / 2;

	this.mouseClick = function(x, y) {
		if (this.play.over) {
			//state = new Play();

			transition.from = this;
			transition.to = new Play();
			transition.time = 0;
			transition.color = "rgba(0, 0, 0, ";
		}
	};

	this.update = function(delta) {
		if (keyboard[" "] || keyboard["Enter"]) {
			//state = new Play();

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
	};
}