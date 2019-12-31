import ChartistGraph from 'react-chartist';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledChartistGraph = styled(ChartistGraph)`
  .ct-series-a .ct-bar,
    .ct-series-a .ct-line,
      .ct-series-a .ct-point,
        .ct-series-a .ct-slice-donut {
    stroke: url(#gradient);
  }
`;

const formatLabel = {
  hour: date => moment.utc(date).format('MMM-DD hh:mm A'),
  day: date => moment.utc(date).format('MMM-DD-YYYY'),
  week: date => moment.utc(date).format('MMM-DD-YYYY'),
  month: date => moment.utc(date).format('MMM YYYY')
};

function Graph({
  by,
  data
}) {
  const series = data.map(datum => datum.value);
  const labels = data.map(datum => datum.label);

  const options = {
    axisX: {
      labelInterpolationFnc: value => formatLabel[by](value)
    }
  };

  function onDraw(ctx) {
    if (ctx.type === 'bar') {
      ctx.element.attr({
        x1: ctx.x1 + 0.001
      });
    }
  }

  function onCreated(ctx) {
    const defs = ctx.svg.elem('defs');
    defs.elem('linearGradient', {
      id: 'gradient',
      x1: 0,
      y1: 1,
      x2: 0,
      y2: 0
    }).elem('stop', {
      offset: 0,
      'stop-color': 'hsla(6, 59%, 58%, 1)'
    }).parent().elem('stop', {
      offset: 1,
      'stop-color': 'hsla(45, 100%, 47%, 1)'
    });
  }

  return (
    <StyledChartistGraph
      className="organization-chart"
      data={{ series: [series], labels }}
      listener={{ draw: onDraw, created: onCreated }}
      options={options}
      type="Bar"
    />
  );
}

Graph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number
    })
  ),
  by: PropTypes.string
};

Graph.defaultProps = {
  data: [],
  by: 'day'
};

export default Graph;
