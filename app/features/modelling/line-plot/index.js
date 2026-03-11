import { Chart } from 'chart.js/auto';
/**
 * @typedef {Object} ChartData
 * @property {Object} data - The data for the chart, which can be in various formats (e.g., x/y arrays, series data).
 * @property {Object} chartOptions - Optional chart configuration options (e.g., axis labels, invert axes).
 * @property {string} chartOptions.xAxisLabel - Label for the x-axis.
 * @property {string} chartOptions.yAxisLabel - Label for the y-axis.
 * @property {Object} chartOptions.invertAxes - Optional configuration to invert axes.
 * @property {boolean} chartOptions.invertAxes.x - Whether to invert the x-axis.
 * @property {boolean} chartOptions.invertAxes.y - Whether to invert the y-axis.
 */
/**
 * Convert PH TESS data format (with x and y arrays) into a ChartData object
 * that includes the data and chart options.
 * @param {Object} data
 * @param {Array} data.x
 * @param {Array} data.y 
 * @returns {ChartData} A ChartData object matching other Zooniverse JSON subjects.
 */
function convertPHTessDataToChartData(data) {
  if(data?.x && data?.y) {
    return {
      data: {
        x: data.x,
        y: data.y
      },
      chartOptions: {
        xAxisLabel: 'Days',
        yAxisLabel: 'Brightness'
      }
    };
  }
  return data;
}

/**
 * Convert x,y arrays into a Chart.js dataset object.
 * @param {Object} data
 * @param {Array} data.x
 * @param {Array} data.y
 * @returns {Object} A dataset object for Chart.js with x and y data points, point style, and colors.
 */
function getXYData(data) {
  return {
    data: data.x.map((x, index) => ({ x, y: data.y[index] })),
    pointStyle: 'circle',
    backgroundColor: '#ffffff',
    borderColor: '#000000'
  }
}

/**
 * Convert series data into a Chart.js dataset object.
 * @param {Object} series
 * @param {Array} series.seriesData - An array of data points for the series.
 * @param {Object} series.seriesOptions - Options for the series.
 * @param {string} series.seriesOptions.label - The label for the series.
 * @param {string} series.seriesOptions.glyph - The point style for the series (e.g., 'circle', 'rect').
 * @param {string} series.seriesOptions.color - The color for the series points.
 * @param {number} index
 * @returns {Object} A dataset object for Chart.js with data points, label, point style, and colors.
 */
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

/**
 * Convert Zooniverse data into an array of Chart.js dataset objects. The data can be in various formats, such as:
 * - An array of datasets directly in the `datasets` property.
 * - A map of series data in the `map` property, which will be converted using `getSeriesData`.
 * - Separate x and y arrays, which will be converted using `getXYData`.
 * If none of these formats are present, an empty array is returned.
 * @param {Object} data - The data object which may contain datasets, an array of series data, or x/y arrays.
 * @returns {Array} An array of Chart.js dataset objects.
 */
function getDatasets(data) {
  if (data?.datasets) {
    return data.datasets;
  }
  if (Array.isArray(data)) {
    return data.map(getSeriesData);
  }
  if (data?.x && data?.y) {
    return [getXYData(data)];
  }
  return [];
}

// Help at http://www.chartjs.org/docs/latest
class LinePlotModel {
  constructor(canvas, { frame, src, jsonData }, { onLoad, modelDidError }) {
    this.ctx = canvas.getContext('2d');
    console.log('Line Plot', this.ctx, frame, src);
    this.frame = frame;
    
    // Use jsonData if available to avoid duplicate fetch
    if (jsonData) {
      this.processData(jsonData, canvas, onLoad);
    } else {
      fetch(`${src}?=`)
        .then(response => response.json())
        .then((data) => {
          this.processData(data, canvas, onLoad);
        })
        .catch((error) => {
          modelDidError({ modelErrorMessage: error.message })
          console.warn(error);
        });
    }
  }
  
  /**
   * Renders a line plot on the provided canvas using Chart.js, based on the given API data.
   * The API data can be in various formats, and this method will convert it into a format
   * suitable for Chart.js before rendering.
   * @param {Object} apiData 
   * @param {Object} apiData.data - The data for the chart, which can be in various formats (e.g., x/y arrays, series data).
   * @param {ChartData.chartOptions} apiData.chartOptions - Optional chart configuration options (e.g., axis labels, invert axes).
   * @param {HTMLCanvasElement} canvas The canvas element where the chart will be rendered.
   * @param {Function} onLoad Callback that fires after the chart is rendered, providing the dimensions of the canvas for any necessary adjustments in the parent component.
   * @returns {void}
   */
  processData(apiData, canvas, onLoad) {
    const { data: chartData, chartOptions, ...rest } = convertPHTessDataToChartData(apiData);
    const datasets = getDatasets(chartData);
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
    const { height, width } = canvas.getBoundingClientRect();
    onLoad({ height, width });
  }

  update() {
    return null;
  }
}

export default LinePlotModel;
