function Play() {
	this.battery = {
		text: new Text("Battery", "16px monospace", "#fff", "bottom"),
		fg: "green",
		bg: "red",
		height: 64,
		value: 1
	};

	this.battery.text.x = 10;
	this.battery.text.y = SCREEN_HEIGHT - this.battery.height - 2;

	this.map = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
		[2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	this.player = {
		x: 0,
		y: 4,
		lastMove: 1
	};

	this.update = function(delta) {
		if (this.battery.value <= 0)
			state = undefined; // game over (lost)

		if (this.map[this.player.y][this.player.x] % 3 === 0)
			console.log("next level");

		this.player.lastMove += delta;

		if (keyboard["ArrowRight"] && this.player.x < this.map[this.player.y].length - 1 &&
			this.map[this.player.y][this.player.x + 1] >= 1 && this.player.lastMove > 500) {

			this.map[this.player.y][this.player.x] /= 2;
			this.map[this.player.y][++this.player.x] *= 2;

			this.battery.value -= 0.05;

			this.player.lastMove = 0;
		}

		if (keyboard["ArrowLeft"] && this.player.x > 0 &&
			this.map[this.player.y][this.player.x - 1] >= 1 && this.player.lastMove > 500) {

			this.map[this.player.y][this.player.x] /= 2;
			this.map[this.player.y][--this.player.x] *= 2;

			this.battery.value -= 0.05;

			this.player.lastMove = 0;
		}

		if (keyboard["ArrowDown"] && this.player.y < this.map[this.player.y].length - 1 &&
			this.map[this.player.y + 1][this.player.x] >= 1 && this.player.lastMove > 500) {

			this.map[this.player.y][this.player.x] /= 2;
			this.map[++this.player.y][this.player.x] *= 2;

			this.battery.value -= 0.05;

			this.player.lastMove = 0;
		}

		if (keyboard["ArrowUp"] && this.player.y > 0 &&
			this.map[this.player.y - 1][this.player.x] >= 1 && this.player.lastMove > 500) {

			this.map[this.player.y][this.player.x] /= 2;
			this.map[--this.player.y][this.player.x] *= 2;

			this.battery.value -= 0.05;

			this.player.lastMove = 0;
		}
	};

	this.draw = function(delta) {
		ctx.strokeStyle = "#fff";
		ctx.strokeRect(0, SCREEN_HEIGHT - this.battery.height - 8, SCREEN_WIDTH, 1);

		ctx.clearRect(this.battery.text.x - 5, (SCREEN_HEIGHT - this.battery.height) - 9, this.battery.text.w + 10, 3);

		this.battery.text.draw();	

		ctx.fillStyle = this.battery.bg;
		ctx.fillRect(0, SCREEN_HEIGHT - this.battery.height, SCREEN_WIDTH, this.battery.height);

		ctx.fillStyle = this.battery.fg;
		ctx.fillRect(0, SCREEN_HEIGHT - this.battery.height, SCREEN_WIDTH * this.battery.value, this.battery.height);

		for (var i = this.map.length - 1; i >= 0; i--) {
			for (var j = this.map[i].length - 1; j >= 0; j--) {
				if (this.map[i][j] >= 1) {
					ctx.fillStyle = "gray";
					ctx.fillRect(50 * j, 50 * i, 50, 50);

					if (this.map[i][j] % 3 === 0) {
						ctx.fillStyle = "gold";
						ctx.fillRect(50 * j + 10, 50 * i + 10, 30, 30);
					}

					if (this.map[i][j] % 2 === 0) {
						ctx.fillStyle = "white";
						ctx.fillRect(50 * j + 15, 50 * i + 15, 20, 20);
					}
				}
			}
		}
	};
}