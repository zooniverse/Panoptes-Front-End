import React from 'react';
import SVGLink from './svg-link';

import style from './circle-ribbon.styl';
void style;

let instanceCount = 0;

function defaultHREFTemplate(project) {
  return `#project=${project.id}`;
}

const CircleRibbon = React.createClass({
  propTypes: {
    size: React.PropTypes.string,
    weight: React.PropTypes.number,
    gap: React.PropTypes.number,
    image: React.PropTypes.string,
    loading: React.PropTypes.bool,
    data: React.PropTypes.array,
    hrefTemplate: React.PropTypes.func,
    onClick: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      size: '10em',
      weight: 10,
      gap: 2,
      image: '//lorempixel.com/100/100/animals/1',
      loading: false,
      data: [],
      hrefTemplate: defaultHREFTemplate,
      onClick: () => {},
    };
  },

  getInitialState() {
    return {
      totalClassifications: 0,
      hoverIndex: -1,
    };
  },

  componentDidMount() {
    this.id = instanceCount;
    this.point = this.refs.svg.createSVGPoint();
    instanceCount += 1;
    this.setTotal(this.props.data);
  },

  componentWillReceiveProps(nextProps) {
    this.setTotal(nextProps.data);
  },

  setTotal(data) {
    this.setState({
      totalClassifications: data.reduce((total, project) => {
        return total + project.classifications;
      }, 0),
    });
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

  getTooltipPoint(project, radius) {
    const index = this.props.data.indexOf(project);

    const amount = (this.props.data.slice(0, index).reduce((start, otherArc) => {
      return start + otherArc.classifications;
    }, 0) + (project.classifications / 2)) / this.state.totalClassifications;

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

  handleClick(event) {
    const index = event.currentTarget.querySelector('[data-index]').getAttribute('data-index');
    const clickedProject = this.props.data[index];
    this.props.onClick(clickedProject.id);
  },

  renderArc(project) {
    const index = this.props.data.indexOf(project);

    const startAmount = this.props.data.slice(0, index).reduce((count, otherArc) => {
      return count + otherArc.classifications;
    }, 0) / this.state.totalClassifications;

    if (!isFinite(startAmount)) {
      return null;
    }

    const endAmount = startAmount + (project.classifications / this.state.totalClassifications);

    const radius = 50 - (this.props.weight / 2);

    const startPoint = this.getPointOnCircle(startAmount, radius);
    const endPoint = this.getPointOnCircle(endAmount, radius);

    return (
      <SVGLink
        key={project.id}
        xlinkHref={this.props.hrefTemplate(project)}
        aria-label={`${project.owner}/${project.name} (${project.classifications} classifications)`}
        onClick={this.handleClick}
      >
        <path
          className="circle-ribbon__project-arc"
          d={`
            M ${startPoint.x} ${startPoint.y}
            A ${radius} ${radius} 0 0 1 ${endPoint.x}, ${endPoint.y}
          `}
          stroke={project.color}
          data-index={index}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
      </SVGLink>
    );
  },

  render() {
    const imageSize = 100 - (this.props.weight * 2) - (this.props.gap * 2);

    const hoveredArc = this.props.data[this.state.hoverIndex];

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
            {this.props.loading && (
              <circle className="circle-ribbon__loading-ring" r={50 - (this.props.weight / 2)} stroke="gray" strokeWidth="0.5" />
            )}

            <g strokeWidth={this.props.weight}>
              {this.props.data.map(this.renderArc)}
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
            {hoveredArc.owner}/
            <strong>{hoveredArc.name}</strong>{' '}
            <br />
            <small>
              {hoveredArc.classifications} classifications{' '}
              ({Math.round((hoveredArc.classifications / this.state.totalClassifications) * 100)}%)
            </small>
          </div>
        )}
      </div>
    );
  },
});

export default CircleRibbon;
