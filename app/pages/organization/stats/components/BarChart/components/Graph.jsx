import ChartistGraph from 'react-chartist';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import formatLabel from '../helpers/formatLabel';

const gradientRed = 'hsla(6, 59%, 58%, 1)';
const gradientYellow = 'hsla(45, 100%, 47%, 1)';

const StyledChartistGraph = styled(ChartistGraph)`
  .ct-chart-bar {
    min-height: 250px;

    .ct-series, .ct-series-a {
      .ct-bar {
        stroke: url(#gradient);

        &:hover + .ct-tooltip, &:focus + .ct-tooltip {
          display: block;
          fill: #5C5C5C;
        }
      }

      .ct-tooltip {
        display: none;

        &:hover, &:focus {
          display: block;
          fill: #5C5C5C;
        }
      }
    }

    .ct-labels {
      .ct-label {
        color: #5C5C5C;

        &.ct-horizontal, &.ct-end {
          transform: rotate(-90deg);
          white-space: nowrap;
        }
      }
    }
  }
`;

function Graph({
  by,
  data
}) {
  const series = data.map(datum => datum.value);
  const labels = data.map(datum => datum.label);

  const options = {
    axisX: {
      labelInterpolationFnc: value => formatLabel[by](value),
      labelOffset: {
        x: 5,
        y: 28
      },
      showGrid: false
    },
    axisY: {
      onlyInteger: true
    },
    chartPadding: {
      bottom: 60
    }
  };

  function onDraw(ctx) {
    if (ctx.type === 'label') {
      let ticksLength = 0;
      if (ctx && ctx.axis && ctx.axis.ticks && ctx.axis.ticks.length) {
        ticksLength = ctx.axis.ticks.length;
      }
      if (ctx.axis.units.dir === 'horizontal') {
        const svgWidth = ctx.element.parent().parent().width();
        const width = svgWidth / ticksLength;
        const numberBars = Math.ceil(20 / width);
        if (ctx.index % numberBars) {
          ctx.element.attr({ style: 'display: none' });
        }
      }
    } else if (ctx.type === 'bar') {
      let seriesLength = 0;
      if (ctx && ctx.series && ctx.series.length) {
        seriesLength = ctx.series.length;
      }
      const strokeWidth = seriesLength ? (100 / seriesLength) : 5;
      ctx.element.attr({
        x1: ctx.x1 + 0.001,
        style: `stroke-width: ${strokeWidth}%`,
        focusable: true,
        tabindex: 0
      });
      ctx.group.elem('text', {
        x: ctx.x1,
        y: 15,
        class: 'ct-tooltip'
      })
        .text(ctx.series[ctx.index]);
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
      'stop-color': gradientRed
    }).parent().elem('stop', {
      offset: 1,
      'stop-color': gradientYellow
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
