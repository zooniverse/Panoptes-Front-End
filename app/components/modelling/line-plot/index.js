import { Chart } from 'chart.js';

// Help at http://www.chartjs.org/docs/latest
class Model {
  constructor(canvas, { frame, src }) {
    this.ctx = canvas.getContext('2d');
    console.log('Line Plot', this.ctx, frame, src);
    this.frame = frame;
    fetch(`${src}?=`)
      .then(response => response.text())
      .then((content) => {
        const data = JSON.parse(content);
        console.log({
          type: 'scatter',
          data
        });
        this.lineChart = new Chart(
          this.ctx,
          {
            type: 'scatter',
            data,
            options: {}
          }
        );
      })
      .catch((e) => {
        const content = e.message;
        console.warn(content);
      });
  }
  update() {
    return null;
  }
  getScore() {
    return Math.floor(Math.random() * 100);
  }
}

export {
  Model
};
