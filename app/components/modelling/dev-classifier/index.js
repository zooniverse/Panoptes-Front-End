class Model {
  constructor(canvas, frame) {
    this.ctx = canvas.getContext('2d');
    this.frame = frame;
  }
  update(annotations, viewBoxDimensions) {
    console.log(viewBoxDimensions);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.width);
    for (let i = 0; i < annotations.length; i += 1) {
      if (annotations[i].task === 'draw') {
        for (let j = 0, drawing = {}; j < annotations[i].value.length; j += 1) {
          drawing = annotations[i].value[j];
          if (drawing.frame === this.frame) {
            console.log(
              (drawing.x * this.ctx.canvas.width) / 100,
              ((drawing.y * this.ctx.canvas.height) / 100) + 10 + 1
            );
            switch (drawing.tool) {
              case 0:
                this.ctx.beginPath();
                this.ctx.ellipse(
                  ((drawing.x * this.ctx.canvas.width) / 100),
                  // TODO: why do I need to +1 to center properly?
                  ((drawing.y * this.ctx.canvas.height) / 100) + 10 + 1,
                  10, 10, 0, 0, 2 * Math.PI
                );
                this.ctx.stroke();
                this.ctx.fill();
                break;
              default:
                break;
            }
          }
        }
      }
    }
  }
  getScore() {
    return Math.floor(Math.random() * 100);
  }
}

export {
  Model,
};
