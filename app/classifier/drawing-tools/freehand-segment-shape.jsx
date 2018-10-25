import React from 'react';
import PropTypes from 'prop-types';
import DrawingToolRoot from './root';
import DeleteButton from './delete-button';
import { createPathFromCoords, filterDupeCoords, roundCoords } from './freehand-helpers';

const BUFFER = 16;
const DELETE_BUTTON_WIDTH = 8;
const FINISHER_RADIUS = 8;
const POINT_RADIUS = 4;

class FreehandSegmentShapeTool extends React.Component {
  static initCoords = null;

  static defaultValues() {
    return {
      points: [],
      _inProgress: false,
      _currentlyDrawing: false
    };
  }

  static initStart(coords, mark) {
    mark.points.push(roundCoords(coords));
    return Object.assign({}, mark, { _inProgress: true, _currentlyDrawing: true });
  }

  static initMove(coords, mark) {
    mark.points.push(roundCoords(coords));
    return Object.assign({}, mark);
  }

  static initRelease(coords, mark) {
    const points = filterDupeCoords(mark.points);
    return Object.assign({}, mark, { points, _currentlyDrawing: false });
  }

  static isComplete(mark) {
    return !mark._inProgress;
  }

  static forceComplete(mark) {
    mark.points = filterDupeCoords(mark.points);
    return Object.assign({}, mark, {
      _inProgress: false,
      _currentlyDrawing: false,
      auto_closed: true
    });
  }

  constructor() {
    super();

    this.handleFinishClick = this.handleFinishClick.bind(this);
    this.handleFinishHover = this.handleFinishHover.bind(this);
    this.handleFinishMove = this.handleFinishMove.bind(this);

    this.state = {
      mouseX: null,
      mouseY: null
    };
  }

  componentWillMount() {
    const { mark } = this.props;
    this.setState({
      mouseX: mark.points[0].x,
      mouseY: mark.points[0].y,
      mouseWithinViewer: true
    });
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  getDeletePosition([startCoords, ...otherCoords]) {
    const { scale } = this.props;
    const calculatedScale = (scale.horizontal + scale.vertical) / 2;
    const mod = (BUFFER / calculatedScale);
    const x = startCoords.x - mod;
    return {
      x: !this.outOfBounds(x, calculatedScale) ? x : startCoords.x + mod,
      y: startCoords.y
    };
  }

  handleFinishClick() {
    const { mark, onChange } = this.props;

    document.removeEventListener('mousemove', this.handleMouseMove);
    mark.points.push(mark.points[0]);
    mark._inProgress = false;
    onChange(mark);
  }

  handleFinishHover(e) {
    if (e.type === 'mouseenter') {
      this.setState({ firstPointHover: true });
    } else if (e.type === 'mouseleave') {
      this.setState({ firstPointHover: false });
    }
  }

  handleFinishMove(e) {
    const { containerRect, getEventOffset } = this.props;
    const newCoord = getEventOffset(e);

    let mouseWithinViewer = true;

    if (e.pageX < containerRect.left || e.pageX > containerRect.right
      || e.pageY < containerRect.top || e.pageY > containerRect.bottom) {
      mouseWithinViewer = false;
    }

    this.setState({
      mouseX: newCoord.x,
      mouseY: newCoord.y,
      mouseWithinViewer
    });
  }

  outOfBounds(deleteBtnX, scale) {
    return deleteBtnX - (DELETE_BUTTON_WIDTH / scale) < 0;
  }

  render() {
    const {
      firstPointHover,
      mouseWithinViewer,
      mouseX,
      mouseY
    } = this.state;
    const {
      color,
      disabled,
      getScreenCurrentTransformationMatrix,
      mark,
      scale,
      selected
    } = this.props;
    const { _currentlyDrawing, _inProgress, points } = mark;
    const fill = _inProgress ? 'none' : color;
    const lineClass = _inProgress ? 'drawing' : 'clickable';
    const path = createPathFromCoords(points);
    const pointerEvents = disabled ? 'none' : 'painted';

    const averageScale = (scale.horizontal + scale.vertical) / 2;
    const deletePosition = this.getDeletePosition(points);
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    return (
      <DrawingToolRoot
        tool={this}
        pointerEvents={pointerEvents}
      >
        <path
          d={path}
          fill={fill}
          fillOpacity="0.2"
          className={lineClass}
        />

        {selected && (
          <g>
            <DeleteButton
              tool={this}
              x={deletePosition.x}
              y={deletePosition.y}
              getScreenCurrentTransformationMatrix={getScreenCurrentTransformationMatrix}
            />
          </g>
        )}

        {(selected && _inProgress && points.length && mouseWithinViewer) && (
          <line
            className="guideline"
            x1={lastPoint.x}
            y1={lastPoint.y}
            x2={mouseX}
            y2={mouseY}
          />
        )}

        {(selected && _inProgress && !_currentlyDrawing) && (
          <g>
            {firstPointHover && (
              <circle
                r={FINISHER_RADIUS / averageScale}
                cx={firstPoint.x}
                cy={firstPoint.y}
              />
            )}

            <circle
              className="clickable"
              r={POINT_RADIUS / averageScale}
              cx={firstPoint.x}
              cy={firstPoint.y}
              onClick={this.handleFinishClick}
              onMouseEnter={this.handleFinishHover}
              onMouseLeave={this.handleFinishHover}
              fill="currentColor"
            />
          </g>
        )}
      </DrawingToolRoot>
    );
  }
}

FreehandSegmentShapeTool.propTypes = {
  color: PropTypes.string.isRequired,
  containerRect: PropTypes.shape({
    bottom: PropTypes.number,
    height: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number
  }).isRequired,
  disabled: PropTypes.bool,
  getEventOffset: PropTypes.func.isRequired,
  getScreenCurrentTransformationMatrix: PropTypes.func.isRequired,
  mark: PropTypes.shape({
    points: PropTypes.arrayOf(PropTypes.object)
  }),
  onChange: PropTypes.func.isRequired,
  scale: PropTypes.shape({
    horizontal: PropTypes.number,
    vertical: PropTypes.number
  }),
  selected: PropTypes.bool
};

FreehandSegmentShapeTool.defaultProps = {
  disabled: false,
  mark: null,
  scale: null,
  selected: true
};

export default FreehandSegmentShapeTool;
