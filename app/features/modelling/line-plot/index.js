import { Chart } from 'chart.js/auto';

function getXYData(data) {
  return {
    data: data.x.map((x, index) => ({ x, y: data.y[index] })),
    pointStyle: 'circle',
    backgroundColor: '#ffffff',
    borderColor: '#000000'
  }
}

function getSeriesData(series, index) {
  const { seriesData, seriesOptions } = series;
  return {
    data: seriesData,
    label: seriesOptions.label || `Series ${index + 1}`,
    pointStyle: seriesOptions.glyph,
    backgroundColor: seriesOptions.color,
    borderColor: '#000000'
  };
}

function getDatasets(data) {
  if (data?.datasets) {
    return data.datasets;
  }
  if (data?.map) {
    return data.map(getSeriesData);
  }
  if (data.x && data.y) {
    return [getXYData(data)];
  }
}

// Help at http://www.chartjs.org/docs/latest
class LinePlotModel {
  constructor(canvas, { frame, src }, { onLoad, modelDidError }) {
    this.ctx = canvas.getContext('2d');
    console.log('Line Plot', this.ctx, frame, src);
    this.frame = frame;
    fetch(`${src}?=`)
      .then(response => response.json())
      .then(data => {
        if(data.x && data.y) {
          return {
            data: {
              x: data.x,
              y: data.y
            }
          },
          {
            chartOptions: {
              xAxisLabel: 'Days',
              yAxisLabel: 'Brightness'
            }
          };
        }
        return data;
      })
      .then(({ data, chartOptions, ...rest }) => {
        const datasets = getDatasets(data);
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
