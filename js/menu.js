function Menu() {
	this.nameText = new Text("GAME NAME", "64px monospace");
	this.nameText.x = SCREEN_WIDTH - this.nameText.w - 10;

	this.playText = new Text("SPACE to play", "24px monospace", "#fff", "bottom");
	this.playText.y = SCREEN_HEIGHT - 10;
	this.playText.x = SCREEN_WIDTH / 2 - this.playText.w / 2;

	this.update = function(delta) {
		if (keyboard[" "])
			state = new Play();
	};

	this.draw = function(delta) {
		this.nameText.draw();
		this.playText.draw();
	};
}