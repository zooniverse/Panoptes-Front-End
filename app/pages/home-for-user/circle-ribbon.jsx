import React from 'react';

import style from './circle-ribbon.styl';
void style;

let instanceCount = 0;

const CircleRibbon = React.createClass({
  propTypes: {
    size: React.PropTypes.string,
    weight: React.PropTypes.number,
    gap: React.PropTypes.number,
    image: React.PropTypes.string,
    arcs: React.PropTypes.array,
    onClick: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      size: '10em',
      weight: 10,
      gap: 2,
      image: '//lorempixel.com/100/100/animals/1',
      arcs: [{
        label: 'First arc',
        color: 'red',
        value: 1 / 4,
      }, {
        label: 'Second arc',
        color: 'orange',
        value: 1 / 5,
      }, {
        label: 'Third arc',
        color: 'yellow',
        value: 1 / 6,
      }, {
        label: 'Fourth arc',
        color: 'lime',
        value: 1 / 7,
      }, {
        label: 'Fifth arc',
        color: 'blue',
        value: 1 / 8,
      }, {
        label: 'Sixth arc',
        color: 'magenta',
        value: 1 / 9,
      }],
      onClick: () => {},
    };
  },

  getInitialState() {
    return {
      weight: 1,
      hoverIndex: -1,
    };
  },

  componentDidMount() {
    this.id = instanceCount;
    this.point = this.refs.svg.createSVGPoint();
    instanceCount += 1;
  },

  getPointOnCircle(amount, radius) {
    const degrees = amount * 360;
    const startingFromTop = degrees - 90;
    const radians = startingFromTop * Math.PI / 180;
    return {
      x: radius * Math.cos(radians),
      y: radius * Math.sin(radians),
    };
  },

  getTooltipPoint(arc, radius) {
    const index = this.props.arcs.indexOf(arc);
    const amount = this.props.arcs.slice(0, index).reduce((start, anotherArc) => {
      return start + anotherArc.value;
    }, 0) + (arc.value / 2);

    const midpoint = this.getPointOnCircle(amount, radius);

    this.point.x = midpoint.x;
    this.point.y = midpoint.y;
    const currentTransformationMatrix = this.refs.arcGroup.getCTM();
    const { x, y } = this.point.matrixTransform(currentTransformationMatrix);
    const { offsetWidth, offsetHeight } = this.refs.container;

    return {
      x: x / offsetWidth,
      y: y / offsetHeight,
    };
  },

  handleMouseEnter(event) {
    this.setState({
      hoverIndex: event.target.getAttribute('data-index'),
    });
  },

  handleMouseLeave() {
    this.setState({
      hoverIndex: -1,
    });
  },

  handleClick() {
    this.props.onClick(this.state.hoverIndex);
  },

  renderArc(arc) {
    const index = this.props.arcs.indexOf(arc);

    const startAmount = this.props.arcs.slice(0, index).reduce((start, anotherArc) => {
      return start + anotherArc.value;
    }, 0);

    const endAmount = startAmount + arc.value;

    const radius = 50 - (this.props.weight / 2);

    const startPoint = this.getPointOnCircle(startAmount, radius);
    const endPoint = this.getPointOnCircle(endAmount, radius);

    return (
      <path
        className="circle-ribbon__project-arc"
        key={index + arc.label}
        d={`
          M ${startPoint.x} ${startPoint.y}
          A ${radius} ${radius} 0 0 1 ${endPoint.x}, ${endPoint.y}
        `}
        stroke={arc.color}
        data-index={index}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
      />
    );
  },

  render() {
    const imageSize = 100 - (this.props.weight * 2) - (this.props.gap * 2);

    const hoveredArc = this.props.arcs[this.state.hoverIndex];

    let tooltipPosition;
    if (hoveredArc !== undefined) {
      tooltipPosition = this.getTooltipPoint(hoveredArc, 50);
    }

    return (
      <div ref="container" className="circle-ribbon" style={{ position: 'relative' }}>
        <svg ref="svg" viewBox="0 0 100 100" width={this.props.size} height={this.props.size}>
          <defs>
            <clipPath id={`circle-ribbon-clip-${this.id}`}>
              <circle cx="50" cy="50" r={imageSize / 2} />
            </clipPath>
          </defs>

          {!!this.props.image && (
            <image
              xlinkHref={this.props.image}
              x={this.props.weight + this.props.gap}
              y={this.props.weight + this.props.gap}
              width={imageSize}
              height={imageSize}
              clipPath={`url('#circle-ribbon-clip-${this.id}')`}
              className={`url('#circle-ribbon-shadow-${this.id}')`}
            />
          )}

          <g ref="arcGroup" fill="none" stroke="none" transform="translate(50, 50)">
            <circle r={`${50 - (this.props.weight / 2)}`} stroke="gray" strokeWidth="1" />

            <g strokeWidth={this.props.weight}>
              {this.props.arcs.map(this.renderArc)}
            </g>
          </g>
        </svg>

        {hoveredArc !== undefined && (
          <div
            className={`
              circle-ribbon__tooltip
              circle-ribbon__tooltip--hangs-${tooltipPosition.x < 0.5 ? 'left' : 'right'}
            `}
            style={{
              backgroundColor: hoveredArc.color,
              position: 'absolute',
              left: `${tooltipPosition.x * 100}%`,
              top: `${tooltipPosition.y * 100}%`,
            }}
          >
            <strong>{hoveredArc.label}</strong>{' '}
            <small>{Math.round(hoveredArc.value * 100)}%</small>
          </div>
        )}
      </div>
    );
  },
});

export default CircleRibbon;
