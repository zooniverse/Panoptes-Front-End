import React from 'react';
import ChartistGraph from 'react-chartist';
import moment from 'moment';
import PropTypes from 'prop-types';
import Rcslider from 'rc-slider';

export const Progress = (props) => {
  let progress = props.progress;
  if (props.progress > 1) {
    progress = 1;
  }
  const percent = progress * 100;
  const data = {
    series: [progress, 1 - progress],
  };
  return (
    <div className="svg-container progress-container">
      <span className="progress-label">{`${percent.toFixed(0)}% Complete`}</span>
      <ChartistGraph className="ct-square" type="Pie" data={data} options={props.options} />
    </div>
  );
};

Progress.defaultProps = {
  progress: 0,
  options: {
    donut: true,
    donutWidth: '20%',
    startAngle: 0,
    total: 1,
    showLabel: false,
  },
};

Progress.propTypes = {
  progress: PropTypes.number,
  options: PropTypes.object,
};

export class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.onDraw = this.onDraw.bind(this);
    this.onDrawSmall = this.onDrawSmall.bind(this);
    this.onSlide = this.onSlide.bind(this);
    this.onSlideMid = this.onSlideMid.bind(this);
    this.onRangeChange = this.onRangeChange.bind(this);
    this.processData = this.processData.bind(this);
    this.processRange = this.processRange.bind(this);
    this.setDefaultRange = this.setDefaultRange.bind(this);

    this.formatDiff = {
      hour: 'asHours',
      day: 'asDays',
      week: 'asWeeks',
      month: 'asMonths',
    };

    this.formatLabel = {
      hour: (date) => { return moment.utc(date).format('MMM-DD hh:mm A'); },
      day: (date) => { return moment.utc(date).format('MMM-DD-YYYY'); },
      week: (date) => { return moment.utc(date).format('MMM-DD-YYYY'); },
      month: (date) => { return moment.utc(date).format('MMM-DD-YYYY'); },
    };

    const data = this.processData(props.data, props.by);
    const min = Math.max(data.labels.length - props.num, 0);
    const max = data.labels.length - 1;
    this.state = this.processRange(min, max);
    this.state.data = data;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      const data = this.processData(nextProps.data, nextProps.by);
      const min = Math.max(data.labels.length - this.props.num, 0);
      const max = data.labels.length - 1;
      const newState = this.processRange(min, max);
      newState.data = data;
      this.setState(newState);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newState = (this.state !== nextState);
    const newBy = (this.props.by !== nextProps.by);
    const newData = (this.props.data !== nextProps.data);
    return newState || newBy || newData;
  }

  onDraw(data) {
    const length = this.state.maxIdx - this.state.minIdx + 1;
    if (data.type === 'label') {
      if (data.axis.units.dir === 'horizontal') {
        const svgWidth = data.element.parent().parent().width();
        const width = (svgWidth - 65) / length;
        const dx = width / 2 + (100 - width);
        data.element.attr({ x: data.element.attr('x') - dx });
        // number of bars that fit inside an axis label (17px)
        const numberBars = Math.ceil(17 / width);
        if (data.index % numberBars) {
          data.element.attr({ style: 'display: none' });
        }
      }
    } else if (data.type === 'bar') {
      data.element.attr({
        style: `stroke-width: ${100 / length}%`,
        focusable: true,
        tabindex: 0,
      });
      data.group.elem('text', {
        x: data.x1,
        y: 15,
        class: 'ct-label ct-tooltip',
      }
      ).text(data.series[data.index]);
    }
  }

  onDrawSmall(data) {
    if (data.type === 'label') {
      if (data.axis.units.dir === 'horizontal') {
        if ([0, this.state.data.labels.length - 1].indexOf(data.index) < 0) {
          data.element.attr({ style: 'display: none' });
        } else {
          data.element.attr({ width: 100 });
          if (data.index > 0) {
            const newX = data.element.parent().parent().width() - 100;
            data.element.attr({ x: newX, class: 'ct-label-range-last' });
          }
        }
      }
    }
    if (data.type === 'bar') {
      let style = `stroke-width: ${100 / this.state.data.labels.length}%`;
      if (data.index >= this.state.minIdx & data.index <= this.state.maxIdx) {
        style += '; stroke: #f78d27';
      }
      data.element.attr({ style });
    }
  }

  onSlide(event) {
    const newState = {
      minIdx: event[0],
      maxIdx: event[1],
      midIdx: event[1] + event[0],
    };
    this.setState(newState, this.onRangeChange);
  }

  onSlideMid(event) {
    const diff = this.state.maxIdx - this.state.minIdx;
    const newState = {
      minIdx: Math.floor((event - diff) / 2),
      maxIdx: Math.floor((event + diff) / 2),
      midIdx: event,
    };
    if (newState.minIdx >= 0 & newState.maxIdx < this.state.data.labels.length) {
      this.setState(newState, this.onRangeChange);
    }
  }

  onRangeChange() {
    this.props.handleRangeChange(`${this.state.minIdx},${this.state.maxIdx}`);
  }

  setDefaultRange() {
    const min = Math.max(this.state.data.labels.length - this.props.num, 0);
    const max = this.state.data.labels.length - 1;
    const newState = {
      minIdx: min,
      maxIdx: max,
      midIdx: min + max,
    };
    this.setState(newState, this.onRangeChange);
  }

  processData(inputData, binBy) {
    const data = {
      labels: [],
      series: [[]],
    };
    let previousLabel = '';
    let idx = 0;
    for (const { label, value } of inputData) {
      if (idx > 0) {
        // fill in bins wint zero as a value
        const dateDiff = moment.utc(label).diff(moment.utc(previousLabel));
        const difference = Math.floor(moment.duration(dateDiff)[this.formatDiff[binBy]]());
        if (difference > 1) {
          for (let jdx = 1; jdx < difference; jdx += 1) {
            const shouldBe = moment.utc(previousLabel).add(jdx, `${binBy}s`).format();
            data.labels.push(this.formatLabel[binBy](shouldBe));
            data.series[0].push(0);
          }
        }
      }
      data.labels.push(this.formatLabel[binBy](label));
      data.series[0].push(value);
      previousLabel = label;
      idx++;
    }
    return data;
  }

  processRange(min, max) {
    const minIdx = this.props.range[0] || min;
    const maxIdx = this.props.range[1] || max;
    const midIdx = minIdx + maxIdx;
    return { minIdx, maxIdx, midIdx };
  }

  render() {
    const dataSlice = {
      labels: this.state.data.labels.slice(this.state.minIdx, this.state.maxIdx + 1),
      series: [this.state.data.series[0].slice(this.state.minIdx, this.state.maxIdx + 1)],
    };

    let smallChart = undefined;
    if (this.state.data.labels.length > this.props.num) {
      smallChart = (
        <div>
          <DateRange
            dateMin={this.state.data.labels[this.state.minIdx]}
            dateMax={this.state.data.labels[this.state.maxIdx]}
            setDefaultRange={this.setDefaultRange}
          />
          <ChartistGraph
            listener={{ draw: this.onDrawSmall }}
            type="Bar" data={this.state.data}
            options={this.props.optionsSmall}
          />
          <div className="top-slider">
            <Rcslider.Range
              ref="top-slider"
              min={0}
              max={this.state.data.labels.length - 1}
              range
              allowCross={false}
              value={[this.state.minIdx, this.state.maxIdx]}
              tipFormatter={null}
              onChange={this.onSlide}
            />
          </div>
          <div className="mid-slider">
            <Rcslider
              ref="mid-slider"
              min={0}
              max={2 * (this.state.data.labels.length - 1)}
              value={this.state.midIdx}
              step={2}
              included={false}
              tipFormatter={null}
              onChange={this.onSlideMid}
            />
          </div>
          <br />
        </div>
      );
    }

    return (
      <div className="svg-container">
        {smallChart}
        <ChartistGraph
          className="ct-major-tenth"
          listener={{ draw: this.onDraw }}
          type="Bar" data={dataSlice}
          options={this.props.options}
        />
      </div>
    );
  }
}

Graph.defaultProps = {
  data: [],
  options: {
    axisX: {
      offset: 90,
      showGrid: false,
    },
    axisY: {
      onlyInteger: true,
    },
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 15
    },
  },
  optionsSmall: {
    axisX: {
      offset: 15,
      position: 'start',
      labelOffset: {
        y: -10,
      },
      showGrid: false,
    },
    axisY: {
      offset: 0,
      showLabel: false,
      showGrid: false,
    },
    width: '100%',
    height: '50px',
    chartPadding: {
      top: 0,
      right: 15,
      bottom: 0,
      left: 15,
    },
    classNames: {
      label: 'ct-label-range',
      labelGroup: 'ct-labels-range',
    },
  },
};

Graph.propTypes = {
  data: PropTypes.array,
  by: PropTypes.string,
  num: PropTypes.number,
  options: PropTypes.object,
  optionsSmall: PropTypes.object,
  range: PropTypes.array,
  handleRangeChange: PropTypes.func,
};

const DateRange = (props) => {
  return (
    <div className="date-range">
      <span className="progress-stats-label">Current date range:</span>
      <span>{` ${props.dateMin} to ${props.dateMax}`}</span>
      <button className="standard-button date-reset" onClick={props.setDefaultRange}>
        Reset date range
      </button>
    </div>
  );
};

DateRange.propTypes = {
  dateMin: PropTypes.string,
  dateMax: PropTypes.string,
  setDefaultRange: PropTypes.func,
};