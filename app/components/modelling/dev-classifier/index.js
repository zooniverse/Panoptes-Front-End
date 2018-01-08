class Model {
  constructor(canvas, frame) {
    this.ctx = canvas.getContext('2d');
    this.frame = frame;
  }
  update(annotations, vBD) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.width);
    for (let i = 0; i < annotations.length; i += 1) {
      if (annotations[i].task === 'draw') {
        for (let j = 0, drawing = {}; j < annotations[i].value.length; j += 1) {
          drawing = annotations[i].value[j];
          if (drawing.frame === this.frame) {
            const xyCoords = [
              ((drawing.x - vBD.x) * 100 * this.ctx.canvas.width) / vBD.width / 100,
              // TODO: why do I need to +1 to center properly?
              (((drawing.y - vBD.y) * 100 * this.ctx.canvas.height) / vBD.height / 100) + 11
            ];
            const zoomLevel = [100 / vBD.width, 100 / vBD.height];
            switch (drawing.tool) {
              case 0:
                this.ctx.beginPath();
                this.ctx.ellipse(
                  xyCoords[0], xyCoords[1],
                  10 * zoomLevel[0],
                  10 * zoomLevel[0], 0, 0, 2 * Math.PI
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
