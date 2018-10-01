import React from 'react';
import PropTypes from 'prop-types';
import DeleteButton from '../../delete-button';
import Draggable from '../../../../lib/draggable';
import DragHandle from '../../drag-handle';
import DrawingToolRoot from '../../root';
import deleteIfOutOfBounds from '../../delete-if-out-of-bounds';

const MINIMUM_SIZE = 10;
const MAXIMUM_SPREAD = 180;

class Fan extends React.Component {

  static defaultValues({ x, y }) {
    return {
      x,
      y,
      radius: 0,
      rotation: 0,
      spread: 30
    };
  }

  static initStart({ x, y }) {
    return Object.assign({}, Fan.defaultValues({ x, y }), { _inProgress: true });
  }

  static initMove(cursor, mark) {
    const radius = DrawingToolRoot.distance(mark.x, mark.y, cursor.x, cursor.y);
    const rotation = Fan.getCursorAngle(cursor, mark);
    return Object.assign({}, mark, { radius, rotation });
  }

  static initRelease() {
    return { _inProgress: false };
  }

  static initValid(mark) {
    return mark.radius > MINIMUM_SIZE;
  }

  static getCursorAngle(cursor, mark) {
    // calculates the angle between a cursor position and the mark position.
    const deltaX = cursor.x - mark.x;
    const deltaY = cursor.y - mark.y;
    const theta = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return theta < 0 ? 360 + theta : theta;
  }

  handleDrag(e, d) {
    const { mark } = this.props;
    const difference = this.props.normalizeDifference(e, d);
    mark.x += difference.x;
    mark.y += difference.y;
    this.props.onChange(mark);
  }

  handleRotate(e) {
    const { mark, getEventOffset } = this.props;
    const { x, y } = getEventOffset(e);
    const radius = DrawingToolRoot.distance(mark.x, mark.y, x, y);
    const rotation = Fan.getCursorAngle({ x, y }, mark);
    const newMark = Object.assign({}, mark, { radius, rotation });
    this.props.onChange(newMark);
  }

  handleSpread(e) {
    const { mark, getEventOffset } = this.props;
    const { x, y } = getEventOffset(e);
    const cursorAngle = Fan.getCursorAngle({ x, y }, mark);
    let spread = Math.abs(cursorAngle - mark.rotation);
    spread = spread > 180 ? 360 - spread : spread;
    spread = 2 * spread;
    spread = Math.min(spread, MAXIMUM_SPREAD);
    const newMark = Object.assign({}, mark, { spread });
    this.props.onChange(newMark);
  }

  render() {
    const { disabled, getScreenCurrentTransformationMatrix, mark, scale, selected } = this.props;
    const { x, y, rotation, radius, spread } = mark;
    const tanSpread = Math.tan(spread * (Math.PI / 360));
    const spreadRadius = (radius * tanSpread) / (1 + tanSpread);
    const spreadX = radius - spreadRadius;
    const positionAndRotate = `
      translate(${x} ${y})
      rotate(${rotation})
    `;
    const radiusLine = {
      x1: 0,
      y1: 0,
      x2: radius,
      y2: 0
    };
    const spreadLine = {
      x1: spreadX,
      y1: -spreadRadius,
      x2: spreadX,
      y2: spreadRadius
    };
    const fanPath = `
      M 0 0
      L ${spreadX} ${-spreadRadius}
      A ${spreadRadius} ${spreadRadius} 0 1 1 ${spreadX} ${spreadRadius}
      L 0 0
      Z
      `;
    return (
      <DrawingToolRoot
        tool={this}
        transform={positionAndRotate}
      >
        <line
          {...radiusLine}
          strokeWidth={1}
          strokeOpacity="1"
        />
        <line
          {...spreadLine}
          strokeWidth={1}
          strokeOpacity="1"
        />
        <Draggable
          onDrag={this.handleDrag.bind(this)}
          onEnd={deleteIfOutOfBounds.bind(null, this)}
          disabled={disabled}
        >
          <path
            d={fanPath}
          />
        </Draggable>
        {selected &&
          <React.Fragment>
            <DeleteButton
              tool={this}
              x={radius + 25}
              y={-25}
              getScreenCurrentTransformationMatrix={getScreenCurrentTransformationMatrix}
            />
            <DragHandle
              x={radius}
              y={0}
              scale={scale}
              onDrag={this.handleRotate.bind(this)}
              getScreenCurrentTransformationMatrix={getScreenCurrentTransformationMatrix}
            />
            <DragHandle
              x={spreadX}
              y={-spreadRadius}
              scale={scale}
              onDrag={this.handleSpread.bind(this)}
              getScreenCurrentTransformationMatrix={getScreenCurrentTransformationMatrix}
            />
            <DragHandle
              x={spreadX}
              y={spreadRadius}
              scale={scale}
              onDrag={this.handleSpread.bind(this)}
              getScreenCurrentTransformationMatrix={getScreenCurrentTransformationMatrix}
            />
          </React.Fragment>
        }
      </DrawingToolRoot>
    );
  }
}

Fan.propTypes = {
  disabled: PropTypes.bool,
  getEventOffset: PropTypes.func,
  getScreenCurrentTransformationMatrix: PropTypes.func.isRequired,
  mark: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    radius: PropTypes.number,
    angle: PropTypes.number
  }).isRequired,
  normalizeDifference: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  scale: PropTypes.shape({
    horizontal: PropTypes.number,
    vertical: PropTypes.number
  }),
  selected: PropTypes.bool
};

Fan.defaultProps = {
  disabled: false,
  getEventOffset: () => null,
  onChange: () => true,
  scale: {
    horizontal: 0,
    vertical: 0
  },
  selected: false
};

export default Fan;
