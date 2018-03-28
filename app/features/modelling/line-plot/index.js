import { Chart } from 'chart.js';

// Help at http://www.chartjs.org/docs/latest
class LinePlotModel {
  constructor(canvas, { frame, src }) {
    this.ctx = canvas.getContext('2d');
    console.log('Line Plot', this.ctx, frame, src);
    this.frame = frame;
    fetch(`${src}?=`)
      .then(response => response.json())
      .then((data) => {
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
        console.warn(e);
      });
  }
  update() {
    return null;
  }
}

export default LinePlotModel;
