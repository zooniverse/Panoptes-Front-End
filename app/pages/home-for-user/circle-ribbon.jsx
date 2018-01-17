import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';

let instanceCount = 0;

function defaultHREFTemplate(project) {
  return `#project=${project.id}`;
}

class CircleRibbon extends React.Component {
  static propTypes = {
    size: PropTypes.string,
    weight: PropTypes.number,
    gap: PropTypes.number,
    loading: PropTypes.bool,
    data: PropTypes.array,
    hrefTemplate: PropTypes.func,
    onClick: PropTypes.func,
    user: PropTypes.shape({
      avatar_src: PropTypes.string,
      login: PropTypes.string
    }).isRequired
  };

  static defaultProps = {
    size: '10em',
    weight: 10,
    gap: 2,
    loading: false,
    data: [],
    hrefTemplate: defaultHREFTemplate,
    onClick: () => {},
    user: { avatar_src: '/assets/simple-avatar.png' }
  };

  state = {
    totalClassifications: 0,
    hoverIndex: -1,
  };

  componentDidMount() {
    this.id = instanceCount;
    this.point = this.refs.svg.createSVGPoint();
    instanceCount += 1;
    this.setTotal(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) { this.setTotal(nextProps.data); }
  }

  setTotal = (data) => {
    this.setState({
      totalClassifications: data.reduce((total, project) => {
        return total + project.classifications;
      }, 0),
    });
  };

  getPointOnCircle = (amount, radius) => {
    const degrees = amount * 360;
    const startingFromTop = degrees - 90;
    const radians = startingFromTop * Math.PI / 180;
    return {
      x: radius * Math.cos(radians),
      y: radius * Math.sin(radians),
    };
  };

  getTooltipPoint = (project, radius) => {
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
  };

  handleMouseEnter = (event) => {
    this.setState({
      hoverIndex: event.target.getAttribute('data-index'),
    });
  };

  handleMouseLeave = () => {
    this.setState({
      hoverIndex: -1,
    });
  };

  handleClick = (event) => {
    const rightButtonPressed = (!!event.button && event.button > 0);
    const modifierKey = (event.ctrlKey || event.metaKey);
    const index = event.currentTarget.querySelector('[data-index]').getAttribute('data-index');
    const clickedProject = this.props.data[index];
    if (!clickedProject.redirect && !rightButtonPressed && !modifierKey) {
      browserHistory.push(`/projects/${clickedProject.slug}`);
      event.preventDefault();
    }
    this.props.onClick(clickedProject.id);
  };

  calcLargeArc = (classifications) => {
    if (classifications / this.state.totalClassifications >= 0.5) {
      return 1;
    } else {
      return 0;
    }
  };

  renderArc = (project) => {
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
    const largeArc = this.calcLargeArc(project.classifications);

    return (
      <a
        key={project.id}
        xlinkHref={this.props.hrefTemplate(project)}
        aria-label={`${project.slug} (${project.classifications} classifications)`}
        data-index={index}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onFocus={this.handleMouseEnter}
        onBlur={this.handleMouseLeave}
      >
        <path
          className="circle-ribbon__project-arc"
          d={`
            M ${startPoint.x} ${startPoint.y}
            A ${radius} ${radius} 0 ${largeArc} 1 ${endPoint.x}, ${endPoint.y}
          `}
          data-index={index}
          stroke={project.color}
        />
      </a>
    );
  };

  render() {
    const imageSize = 100 - (this.props.weight * 2) - (this.props.gap * 2);

    const hoveredArc = this.props.data[this.state.hoverIndex];

    let tooltipPosition;
    if (hoveredArc !== undefined) {
      tooltipPosition = this.getTooltipPoint(hoveredArc, 50);
    }

    const avatar = this.props.user.avatar_src ? this.props.user.avatar_src : '/assets/simple-avatar.png';

    return (
      <div ref="container" className="circle-ribbon" style={{ position: 'relative' }}>
        <svg ref="svg" viewBox="0 0 100 100" width={this.props.size} height={this.props.size}>
          <defs>
            <clipPath id={`circle-ribbon-clip-${this.id}`}>
              <circle cx="50" cy="50" r={imageSize / 2} />
            </clipPath>
          </defs>
          <image
            xlinkHref={avatar}
            x={this.props.weight + this.props.gap}
            y={this.props.weight + this.props.gap}
            width={imageSize}
            height={imageSize}
            clipPath={`url('#circle-ribbon-clip-${this.id}')`}
            className={`url('#circle-ribbon-shadow-${this.id}')`}
          />
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
              borderColor: hoveredArc.color,
              position: 'absolute',
              left: `${tooltipPosition.x * 100}%`,
              top: `${tooltipPosition.y * 100}%`,
            }}
          >
            <strong>{hoveredArc.slug}</strong>{' '}
            <br />
            <small>
              {hoveredArc.classifications} classifications{' '}
              ({Math.round((hoveredArc.classifications / this.state.totalClassifications) * 100)}%)
            </small>
          </div>
        )}
      </div>
    );
  }
}

export default CircleRibbon;