function Text(text, font, color, baseline) {
	this.text = text || "";
	this.color = color || "#fff";
	this.baseline = baseline || "top";
	this.font = font;

	this.x = 0;
	this.y = 0;

	ctx.font = this.font;
	this.w = ctx.measureText(this.text).width;

	this.draw = function() {
		ctx.fillStyle = this.color;
		ctx.font = this.font;
		ctx.textBaseline = this.baseline;
		ctx.fillText(this.text, this.x, this.y);
	};
}