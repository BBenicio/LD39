function GameOver(won, score) {
	this.score = new Text("Score: " + (score || 0).toString(), "32px monospace");
	this.score.x = SCREEN_WIDTH / 2 - this.score.w / 2;
	this.score.y = SCREEN_HEIGHT / 2;

	this.again = new Button(new Text("Play Again", "48px monospace", "#fff", "center"), "#333", "#eee", "#000", 64);
	this.again.text.x = SCREEN_WIDTH / 2 - this.again.text.w - 64;
	this.again.text.y = SCREEN_HEIGHT - 64 - 20;

	this.menu = new Button(new Text("Go To Menu", "48px monospace", "#fff", "center"), "#333", "#eee", "#000", 64);
	this.menu.text.x = SCREEN_WIDTH / 2 + 64;
	this.menu.text.y = SCREEN_HEIGHT - 64 - 20;

	var hs = Cookies.get("score");
	if (hs === undefined) hs = 0;
	else hs = hs - 0;

	if (score > hs)
		Cookies.set("score", score.toString(), { expires: 365 });

	this.mouseClick = function(x, y) {
		if (this.again.over) {
			transition.from = this;
			transition.to = new Play();
			transition.time = 0;
			transition.color = "rgba(0, 0, 0, ";
		}
		else if (this.menu.over) {
			transition.from = this;
			transition.to = new Menu();
			transition.time = 0;
			transition.color = "rgba(0, 0, 0, ";
		}
	};

	this.update = function(delta) {
		this.again.update();
		this.menu.update();
	};

	this.draw = function(delta) {
		ctx.drawImage(won ? assets.overWon : assets.overLost, 0, 0);

		this.score.draw();

		this.again.draw();
		this.menu.draw();
	};
}