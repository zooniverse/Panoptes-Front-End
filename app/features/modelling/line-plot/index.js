import { Chart } from 'chart.js/auto';

// Help at http://www.chartjs.org/docs/latest
class LinePlotModel {
  constructor(canvas, { frame, src }, { onLoad, modelDidError }) {
    this.ctx = canvas.getContext('2d');
    console.log('Line Plot', this.ctx, frame, src);
    this.frame = frame;
    fetch(`${src}?=`)
      .then(response => response.json())
      .then((data) => {
        let datasets;
        const { chartOptions, data: FEMdata, ...rest } = data;
        if (FEMdata) {
          datasets = FEMdata.map( (data, index) => {
            const { seriesData, seriesOptions } = data
            return {
              data: seriesData,
              label: seriesOptions.label || `Series ${index + 1}`,
              pointStyle: seriesOptions.glyph,
              backgroundColor: seriesOptions.color,
              borderColor: '#000000'
            }
          });
        }
        if (data.datasets) {
          datasets = data.datasets
        }
        console.log({
          type: 'scatter',
          data: {
            datasets,
            ...rest
          }
        });
        this.lineChart = new Chart(
          this.ctx,
          {
            type: 'scatter',
            data: {
              datasets,
              ...rest
            },
            options: {
              plugins: {
                legend: {
                  labels: {
                    usePointStyle: true
                  }
                }
              },
              scales: {
                x: {
                  reverse: chartOptions?.invertAxes?.x || false,
                  title: {
                    display: true,
                    text: chartOptions?.xAxisLabel
                  }
                },
                y: {
                  reverse: chartOptions?.invertAxes?.y || false,
                  title: {
                    display: true,
                    text: chartOptions?.yAxisLabel
                  }
                }
              }
            }
          }
        );
        const { height, width } = canvas.getBoundingClientRect()
        onLoad({ height, width })
      })
      .catch((error) => {
        modelDidError({ modelErrorMessage: error.message })
        console.warn(error);
      });
  }
  update() {
    return null;
  }
}

export default LinePlotModel;
