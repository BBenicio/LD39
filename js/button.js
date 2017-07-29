function Button(text, bgColor, bgColorHover, textColorHover, size) {
	this.backgroundColor = bgColor || "#222";
	this.backgroundColorHover = bgColorHover || "#eee";
	this.text = text || new Text("Button", "24px monospace");
	
	textColorHover = textColorHover || this.text.color;
	var textColor = this.text.color;

	this.over = false;

	this.update = function() {
		this.over = mouse.x >= this.text.x - 15 && mouse.x <= this.text.x + this.text.w + 15 &&
			mouse.y >= this.text.y - 20 && mouse.y <= this.text.y + size;
	};

	this.draw = function() {
		if (this.over) {
			ctx.fillStyle = this.backgroundColorHover;
			this.text.color = textColorHover;
		} else {
			ctx.fillStyle = this.backgroundColor;
			this.text.color = textColor;
		}
		ctx.fillRect(this.text.x - 15, this.text.y - 20, this.text.w + 30, size + 20);

		this.text.draw();
	};
}