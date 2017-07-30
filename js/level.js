function Level() {
	const BACKGROUND = 0;
	const PATH = 1;
	const PLAYER = 2;
	const GOAL = 3;
	const BOX = 5;
	const INACTIVE = 7;
	const BOX_PLATE = 11;

	const TILE_SIZE = 50;

	
	this.map = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
		[2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	this.player = {
		x: 0,
		y: 6,
		lastMove: 1,

		imgX: 0,
		imgY: 0,

		moving: {
			from: {
				x: 0,
				y: 0
			},
			dir: {
				x: 0,
				y: 0
			},
			time: 10
		},

		lastFrameChange: 0
	};

	this.remainingKeys = 0;
	this.totalKeys = 0;

	this.getCurrentTile = function() {
		return this.map[this.player.y][this.player.x];
	};

	this.isOver = function() {
		return this.getCurrentTile() % GOAL === 0 && this.getCurrentTile() % INACTIVE != 0;
	};

	this.update = function(delta) {
		this.player.lastMove += delta;
		this.player.lastFrameChange += delta;

		if (this.player.moving.time < 1) {
			this.player.moving.time = this.player.lastMove / MOVE_INTERVAL;
			if (this.player.moving.time > 1) this.player.moving.time = 1;
		} else {
			this.player.moving.time = 10;
		}

		if (this.totalKeys > 0 && this.remainingKeys <= 0) {
			for (var i = this.map.length - 1; i >= 0; i--) {
				for (var j = this.map[i].length - 1; j >= 0; j--) {
					if (this.map[i][j] % INACTIVE === 0)
						this.map[i][j] /= INACTIVE;
				}
			}
		}

		if (this.player.lastFrameChange >= 200) {
			this.player.imgX = this.player.imgX === 0 ? assets.robot.width : 0;
			this.player.lastFrameChange = 0;
		}
	};

	this.draw = function(delta) {
		ctx.drawImage(assets.tileBg, 0, 0);

		for (var i = this.map.length - 1; i >= 0; i--) {
			for (var j = this.map[i].length - 1; j >= 0; j--) {
				if (this.map[i][j] >= 1) {
					//ctx.fillStyle = "gray";
					//ctx.fillRect(TILE_SIZE * j, TILE_SIZE * i, TILE_SIZE, TILE_SIZE);
					ctx.drawImage(assets.path, TILE_SIZE * j, TILE_SIZE * i);

					if (this.map[i][j] % GOAL === 0) {
						/*ctx.fillStyle = "gold";
						ctx.fillRect(TILE_SIZE * j + 10, TILE_SIZE * i + 10, 30, 30);*/
						var img = this.map[i][j] % INACTIVE === 0 ? assets.goalInactive : assets.goal;
						ctx.drawImage(img, TILE_SIZE * j + 5, TILE_SIZE * i + 5);
					}

					if (this.map[i][j] % BOX_PLATE === 0) {
						/*ctx.strokeStyle = "brown";
						ctx.strokeRect(TILE_SIZE * j + 10, TILE_SIZE * i + 10, 30, 30);*/
						ctx.drawImage(assets.boxHint, TILE_SIZE * j + 5, TILE_SIZE * i + 5);
					}

					if (this.map[i][j] % BOX === 0) {
						/*ctx.fillStyle = "brown";
						ctx.fillRect(TILE_SIZE * j + 10, TILE_SIZE * i + 10, 30, 30);*/
						ctx.drawImage(assets.box, TILE_SIZE * j + 5, TILE_SIZE * i + 5);
					}

					if (this.map[i][j] % INACTIVE === 0) {
						/*ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
						ctx.fillRect(TILE_SIZE * j + 10, TILE_SIZE * i + 10, 30, 30);*/
					}
				} else {
					//ctx.drawImage(assets.tile_bg, TILE_SIZE * j, TILE_SIZE * i);
				}
			}
		}

		var x = TILE_SIZE * this.player.x + 25 - assets.robot.width / 2;
		var y = TILE_SIZE * this.player.y + (TILE_SIZE - assets.robot.height);

		if (this.player.moving.time <= 1) {
			x = TILE_SIZE * this.player.moving.from.x + 25 - assets.robot.width / 2;
			y = TILE_SIZE * this.player.moving.from.y + TILE_SIZE - assets.robot.height;

			x += TILE_SIZE * this.player.moving.dir.x * this.player.moving.time;
			y += TILE_SIZE * this.player.moving.dir.y * this.player.moving.time;
		}

		ctx.drawImage(assets.robot, this.player.imgX, this.player.imgY, assets.robot.width,
			assets.robot.height, x, y, assets.robot.width, assets.robot.height);
	}

	this.canMovePlayer = function(direction) {
		switch(direction) {
			case "left":
				return this.player.x > 0 && this.map[this.player.y][this.player.x - 1] >= 1 && this.player.lastMove > MOVE_INTERVAL;
			case "right":
				return this.player.x < this.map[this.player.y].length - 1 && this.map[this.player.y][this.player.x + 1] >= 1 && this.player.lastMove > MOVE_INTERVAL;
			case "up":
				return this.player.y > 0 && this.map[this.player.y - 1][this.player.x] >= 1 && this.player.lastMove > MOVE_INTERVAL;
			case "down":
				return this.player.y < this.map[this.player.y].length - 1 && this.map[this.player.y + 1][this.player.x] >= 1 && this.player.lastMove > MOVE_INTERVAL;
		};
	};

	this.movePlayer = function(direction) {
		if (this.canMovePlayer(direction)) {
			switch (direction) {
				case "left":
					this.player.moving.from.x = this.player.x;
					this.player.moving.from.y = this.player.y;

					if (this.map[this.player.y][this.player.x - 1] % BOX === 0) {
						this.player.x--;
						if (this.canMovePlayer(direction) && this.map[this.player.y][this.player.x - 1] % 5 != 0) {
							this.map[this.player.y][this.player.x] /= BOX;
							this.map[this.player.y][this.player.x - 1] *= BOX;

							if (this.map[this.player.y][this.player.x - 1] % BOX_PLATE === 0)
								this.remainingKeys--;
							if (this.map[this.player.y][this.player.x] % BOX_PLATE === 0)
								this.remainingKeys++;
						} else {
							this.player.x++;
							return false;
						}
						this.player.x++;
					}

					this.map[this.player.y][this.player.x] /= PLAYER;
					this.map[this.player.y][--this.player.x] *= PLAYER;

					this.player.lastMove = 0;
					this.player.imgY = assets.robot.height * 3;

					this.player.moving.time = 0;
					this.player.moving.dir.x = -1;
					this.player.moving.dir.y = 0;
					break;
				case "right":
					this.player.moving.from.x = this.player.x;
					this.player.moving.from.y = this.player.y;

					if (this.map[this.player.y][this.player.x + 1] % BOX === 0) {
						this.player.x++;
						if (this.canMovePlayer(direction) && this.map[this.player.y][this.player.x + 1] % 5 != 0) {
							this.map[this.player.y][this.player.x] /= BOX;
							this.map[this.player.y][this.player.x + 1] *= BOX;

							if (this.map[this.player.y][this.player.x + 1] % BOX_PLATE === 0)
								this.remainingKeys--;
							if (this.map[this.player.y][this.player.x] % BOX_PLATE === 0)
								this.remainingKeys++;
						} else {
							this.player.x--;
							return false;
						}
						this.player.x--;
					}

					this.map[this.player.y][this.player.x] /= PLAYER;
					this.map[this.player.y][++this.player.x] *= PLAYER;

					this.player.lastMove = 0;
					this.player.imgY = assets.robot.height * 2;

					this.player.moving.time = 0;
					this.player.moving.dir.x = 1;
					this.player.moving.dir.y = 0;
					break;
				case "up":
					this.player.moving.from.x = this.player.x;
					this.player.moving.from.y = this.player.y;

					if (this.map[this.player.y - 1][this.player.x] % BOX === 0) {
						this.player.y--;
						if (this.canMovePlayer(direction) && this.map[this.player.y - 1][this.player.x] % 5 != 0) {
							this.map[this.player.y][this.player.x] /= BOX;
							this.map[this.player.y - 1][this.player.x] *= BOX;

							if (this.map[this.player.y - 1][this.player.x] % BOX_PLATE === 0)
								this.remainingKeys--;
							if (this.map[this.player.y][this.player.x] % BOX_PLATE === 0)
								this.remainingKeys++;
						} else {
							this.player.y++;
							return false;
						}
						this.player.y++;
					}

					this.map[this.player.y][this.player.x] /= PLAYER;
					this.map[--this.player.y][this.player.x] *= PLAYER;

					this.player.lastMove = 0;
					this.player.imgY = assets.robot.height * 1;

					this.player.moving.time = 0;
					this.player.moving.dir.x = 0;
					this.player.moving.dir.y = -1;
					break;
				case "down":
					this.player.moving.from.x = this.player.x;
					this.player.moving.from.y = this.player.y;

					if (this.map[this.player.y + 1][this.player.x] % BOX === 0) {
						this.player.y++;
						if (this.canMovePlayer(direction) && this.map[this.player.y + 1][this.player.x] % 5 != 0) {
							this.map[this.player.y][this.player.x] /= BOX;
							this.map[this.player.y + 1][this.player.x] *= BOX;

							if (this.map[this.player.y + 1][this.player.x] % BOX_PLATE === 0)
								this.remainingKeys--;
							if (this.map[this.player.y][this.player.x] % BOX_PLATE === 0)
								this.remainingKeys++;
						} else {
							this.player.y--;
							return false;
						}
						this.player.y--;
					}

					this.map[this.player.y][this.player.x] /= PLAYER;
					this.map[++this.player.y][this.player.x] *= PLAYER;

					this.player.lastMove = 0;
					this.player.imgY = assets.robot.height * 0;

					this.player.moving.time = 0;
					this.player.moving.dir.x = 0;
					this.player.moving.dir.y = 1;
					break;
				default:
					return false;
			}

			return true;
		}
	}

	return false;
}

function createLevel(id) {
	id = id || 0;

	var lvl = new Level();
	lvl.id = id;
	
	if (id === 1) {
		lvl.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 3, 1, 1, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		lvl.player.y = 4;
	} else if (id === 2) {
		lvl.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[2, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		lvl.player.y = 4;
	} else if (id === 3) {
		lvl.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
			[2, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 3, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		lvl.player.y = 4;
	} else if (id === 4) {
		lvl.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
			[2, 1, 1, 1, 1, 1, 1, 1, 3*7, 5, 1, 11, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		lvl.player.y = 4;
		lvl.totalKeys = lvl.remainingKeys = 1;
	} else if (id === 5) {
		lvl.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
			[0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0],
			[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 3, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		lvl.player.y = 6;
		lvl.player.x = 3;
	} else if (id === 6) {
		lvl.map = [
			[0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
			[0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1],
			[0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
			[0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 3],
			[0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
			[0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
			[0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0],
			[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		lvl.player.y = 0;
		lvl.player.x = 7;
	} else if (id === 7) {
		lvl.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0],
			[0, 0, 0, 2, 1, 1, 1, 0, 0, 1, 1, 1, 0, 3, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0],
			[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		lvl.player.y = 5;
		lvl.player.x = 3;
	} else if (id === 8) {
		lvl.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0],
			[0, 0, 0, 0, 0, 1, 1, 1, 1, 21, 1, 1, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 11, 0, 0],
			[0, 0, 0, 0, 0, 1, 11, 1, 5, 1, 1, 2, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		lvl.player.y = 6;
		lvl.player.x = 11;
		lvl.totalKeys = lvl.remainingKeys = 2;
	} else if (id === 9) {
		lvl.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 21, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 5, 1, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 11, 5, 1, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 11, 1, 2, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		lvl.player.y = 7;
		lvl.player.x = 9;
		lvl.totalKeys = lvl.remainingKeys = 2;
	} else if (id === 10) {
		lvl.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1],
			[2, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
			[0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 5, 1, 1, 0, 1],
			[0, 0, 1, 0, 0, 1, 0, 5, 0, 1, 0, 1, 0, 0, 0, 21],
			[0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 11, 11, 0, 0, 0, 0],
			[0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		lvl.player.y = 3;
		lvl.player.x = 0;
		lvl.totalKeys = lvl.remainingKeys = 2;
	} else if (id != 0) {
		return null;
	}

	return lvl;
}