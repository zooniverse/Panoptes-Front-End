import React from 'react';
import createReactClass from 'create-react-class';
import DrawingToolRoot from './root';
import DragHandle from './drag-handle';
import Draggable from '../../lib/draggable';
import deleteIfOutOfBounds from './delete-if-out-of-bounds';
import DeleteButton from './delete-button';

const DEFAULT_SQUASH = 1 / 2;
const MINIMUM_RADIUS = 5;
const GUIDE_WIDTH = 1;
const GUIDE_DASH = [4, 4];
const DELETE_BUTTON_ANGLE = 45;
const BUFFER = 16;

export default class AnchoredEllipseTool extends React.Component {
  constructor(props) {
  }

  getDeletePosition(xIn, width) {
    const scale = this.props.scale.horizontal;
    let x = xIn + width + (BUFFER / scale);
    if ((this.props.containerRect.width / scale) < x + (DELETE_BUTTON_WIDTH / scale)) {
      x -= (BUFFER / scale) * 2;
    }
    return { x };
  }

  handleRadiusHandleDrag(coord, e, d) {
    {x, y} = this.props.getEventOffset(e);
    r = this.constructor.GetDistance(this.props.mark.x, this.props.mark.y, x, y)
    angle = this.constructor.getAngle(this.props.mark.x, this.props.mark.y, x, y)
    this.props.mark["r#{coord}"] = r
    this.props.mark.angle = angle;
    if (coord == y){
      this.props.mark.angle -= angle;
    }
    this.props.onChange(this.props.mark);
  }

  render() {
    const { x, y, width, height, angle } = this.props.mark;
    const xCenter = width / 2;
    const yCenter = height / 2;
    const deletePosition = this.getDeletePosition(0, width);
    const positionAndRotate = `
      translate(${x} ${y})
      rotate(${angle} ${xCenter} ${yCenter})
    `;
    let guideLine;
    let dragHandles;
    if (this.props.selected) {
      const guideWidth = GUIDE_WIDTH / ((this.props.scale.horizontal + this.props.scale.vertical) / 2);
      const xRot = width + (3 * (BUFFER / this.props.scale.horizontal));
      guideLine = (
        <g>
          <line
            x1={xCenter}
            y1={yCenter}
            x2={xRot}
            y2={yCenter}
            strokeWidth={guideWidth}
            strokeDasharray={GUIDE_DASH}
          />
        </g>
      );
      dragHandles = (
        <g>
          <DeleteButton
            tool={this}
            x={deletePosition.x}
            y={0}
            getScreenCurrentTransformationMatrix={this.props.getScreenCurrentTransformationMatrix}
          />

          <DragHandle
            x={0}
            y={0}
            scale={this.props.scale}
            onDrag={this.handleTopLeftDrag}
            onEnd={this.normalizeMark}
            getScreenCurrentTransformationMatrix={this.props.getScreenCurrentTransformationMatrix}
          />
          <DragHandle
            x={width}
            y={0}
            scale={this.props.scale}
            onDrag={this.handleTopRightDrag}
            onEnd={this.normalizeMark}
            getScreenCurrentTransformationMatrix={this.props.getScreenCurrentTransformationMatrix}
          />
          <DragHandle
            x={width}
            y={height}
            scale={this.props.scale}
            onDrag={this.handleBottomRightDrag}
            onEnd={this.normalizeMark}
            getScreenCurrentTransformationMatrix={this.props.getScreenCurrentTransformationMatrix}
          />
          <DragHandle
            x={0}
            y={height}
            scale={this.props.scale}
            onDrag={this.handleBottomLeftDrag}
            onEnd={this.normalizeMark}
            getScreenCurrentTransformationMatrix={this.props.getScreenCurrentTransformationMatrix}
          />
          <DragHandle
            x={xRot}
            y={yCenter}
            scale={this.props.scale}
            onDrag={this.handleRotate}
            onEnd={this.normalizeMark}
            getScreenCurrentTransformationMatrix={this.props.getScreenCurrentTransformationMatrix}
          />
        </g>
      );
    }
    return (
      <DrawingToolRoot
        tool={this}
        transform={positionAndRotate}
      >
        {guideLine}
        <Draggable
          onDrag={this.handleMainDrag}
          onEnd={deleteIfOutOfBounds.bind(null, this)}
          disabled={this.props.disabled}
        >
          <rect
            width={width}
            height={height}
          />
        </Draggable>
        {dragHandles}
      </DrawingToolRoot>
    );
  }
}

RotateRectangleTool.initCoords = null;
RotateRectangleTool.defaultValues = ({ x, y }) => (
  {
    x,
    y,
    width: 0,
    height: 0,
    angle: 0
  }
);

RotateRectangleTool.initStart = ({ x, y }) => {
  RotateRectangleTool.initCoords = { x, y };
  return {
    x,
    y,
    _inProgress: true
  };
};

RotateRectangleTool.initMove = (cursor, mark) => {
  let width;
  let height;
  let x;
  let y;
  if (cursor.x > RotateRectangleTool.initCoords.x) {
    width = cursor.x - mark.x;
    x = mark.x;
  } else {
    width = RotateRectangleTool.initCoords.x - cursor.x;
    x = cursor.x;
  }
  if (cursor.y > RotateRectangleTool.initCoords.y) {
    height = cursor.y - mark.y;
    y = mark.y;
  } else {
    height = RotateRectangleTool.initCoords.y - cursor.y;
    y = cursor.y;
  }
  return {
    x,
    y,
    width,
    height
  };
};

RotateRectangleTool.initRelease = () => ({ _inProgress: false });
RotateRectangleTool.initValid = mark => mark.width > MINIMUM_SIZE && mark.height > MINIMUM_SIZE;
RotateRectangleTool.getAngle = (xCenter, yCenter, x, y) => {
  const deltaX = x - xCenter;
  const deltaY = y - yCenter;
  return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
};

RotateRectangleTool.rotateXY = ({ x, y }, angle) => {
  const theta = angle * (Math.PI / 180);
  const xTheta = (x * Math.cos(theta)) + (y * Math.sin(theta));
  const yTheta = -(x * Math.sin(theta)) + (y * Math.cos(theta));
  return { x: xTheta, y: yTheta };
};

RotateRectangleTool.propTypes = {
  scale: PropTypes.shape({
    horizontal: PropTypes.number,
    vertical: PropTypes.number
  }),
  containerRect: PropTypes.shape({
    width: PropTypes.number
  }),
  mark: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    angle: PropTypes.number
  }),
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  normalizeDifference: PropTypes.func,
  getEventOffset: PropTypes.func,
  getScreenCurrentTransformationMatrix: PropTypes.shape({
    a: PropTypes.number,
    b: PropTypes.number,
    c: PropTypes.number,
    d: PropTypes.number,
    e: PropTypes.number,
    f: PropTypes.number
  })
};
