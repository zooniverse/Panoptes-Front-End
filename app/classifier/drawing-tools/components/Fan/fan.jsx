import React from 'react';
import PropTypes from 'prop-types';
import DeleteButton from '../../delete-button';
import Draggable from '../../../../lib/draggable';
import DragHandle from '../../drag-handle';
import DrawingToolRoot from '../../root';
import deleteIfOutOfBounds from '../../delete-if-out-of-bounds';

const GRAB_STROKE_WIDTH = 6;
const MINIMUM_SIZE = 10;

class Fan extends React.Component {

  static defaultValues({ x, y }) {
    return {
      x,
      y,
      radius: 0,
      rotation: 0,
      spread: 5
    };
  }

  static initStart({ x, y }) {
    return Object.assign({}, Fan.defaultValues({ x, y }), { _inProgress: true });
  }

  static initMove(cursor, mark) {
    const radius = DrawingToolRoot.distance(mark.x, mark.y, cursor.x, cursor.y);
    const deltaY = cursor.y - mark.y;
    const deltaX = mark.x - cursor.x;
    const rotation = Math.atan2(deltaX, deltaY) * (180 / Math.PI);
    return Object.assign({}, mark, { radius, rotation });
  }

  static initRelease() {
    return { _inProgress: false };
  }

  static initValid(mark) {
    return mark.radius > MINIMUM_SIZE;
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
    const deltaY = y - mark.y;
    const deltaX = mark.x - x;
    const rotation = Math.atan2(deltaX, deltaY) * (180 / Math.PI);
    const newMark = Object.assign({}, mark, { radius, rotation });
    this.props.onChange(newMark);
  }

  handleSpread(e) {
    const { mark, getEventOffset } = this.props;
    const { x, y } = getEventOffset(e);
    const deltaY = y - mark.y;
    const deltaX = mark.x - x;
    const cursorAngle = Math.atan2(deltaX, deltaY) * (180 / Math.PI);
    const spread = Math.abs(cursorAngle - mark.rotation);
    const newMark = Object.assign({}, mark, { spread });
    this.props.onChange(newMark);
  }

  render() {
    const { disabled, getScreenCurrentTransformationMatrix, mark, scale, selected } = this.props;
    const { x, y, rotation, radius, spread } = mark;
    const tanSpread = Math.tan(spread * (Math.PI / 180));
    const spreadRadius = (radius * tanSpread) / (1 + tanSpread);
    const spreadY = radius - spreadRadius;
    const positionAndRotate = `
      translate(${x} ${y})
      rotate(${rotation})
    `;
    const radiusLine = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: radius
    };
    const spreadLine = {
      x1: -spreadRadius,
      y1: spreadY,
      x2: spreadRadius,
      y2: spreadY
    };
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
          <line
            {...radiusLine}
            strokeWidth={GRAB_STROKE_WIDTH / ((scale.horizontal + scale.vertical) / 2)}
            strokeOpacity="0"
          />
        </Draggable>
        {selected &&
          <React.Fragment>
            <DeleteButton
              tool={this}
              x={0}
              y={-20}
              getScreenCurrentTransformationMatrix={getScreenCurrentTransformationMatrix}
            />
            <DragHandle
              x={0}
              y={radius}
              scale={this.scale}
              onDrag={this.handleRotate.bind(this)}
              getScreenCurrentTransformationMatrix={getScreenCurrentTransformationMatrix}
            />
            <DragHandle
              x={spreadRadius}
              y={spreadY}
              scale={this.scale}
              onDrag={this.handleSpread.bind(this)}
              getScreenCurrentTransformationMatrix={getScreenCurrentTransformationMatrix}
            />
            <DragHandle
              x={-spreadRadius}
              y={spreadY}
              scale={this.scale}
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
