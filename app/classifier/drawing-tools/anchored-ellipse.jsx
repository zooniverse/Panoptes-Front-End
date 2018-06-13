// Creates an ellipes in the center of the subject during the first click, and does not allow it to be dragged
import React from 'react';
import DrawingToolRoot from './root';
import DragHandle from './drag-handle';
import DeleteButton from './delete-button';

const MINIMUM_RADIUS = 5;
const GUIDE_WIDTH = 1;
const GUIDE_DASH = [4, 4];
const DELETE_BUTTON_ANGLE = 45;
const BUFFER = 16;

export default class AnchoredEllipseTool extends React.Component {
  constructor() {
    super();

    this.getDeletePosition = this.getDeletePosition.bind(this);
  }
  
  static defaultValues(values, dimensions) {
    // const x = (containerRect.width / 2) / scale.horizontal;
    // const y = (containerRect.height / 2) / scale.vertical;
    const x = dimensions.naturalWidth / 2;
    const y = dimensions.naturalHeight / 2;
    return {
      x,
      y,
      rx: 50,
      ry: 50,
      angle: 0
    };
  }

  static initStart() {
    return {
      _inProgress: true
    };
  }

  static initValid(mark) {
    return mark.rx > MINIMUM_RADIUS;
  }

  static getDistance(x1, y1, x2, y2) {
    const aSquared = Math.pow(x2 - x1, 2);
    const bSquared = Math.pow(y2 - y1, 2);
    return Math.sqrt(aSquared + bSquared);
  }

  static getAngle(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.atan2(deltaY, deltaX) * (-180 / Math.PI);
  }

  getDeletePosition() {
    const theta = (DELETE_BUTTON_ANGLE - this.props.mark.angle) * (Math.PI / 180);
    return {
      x: (this.props.mark.rx + (BUFFER / this.props.scale.horizontal)) * Math.cos(theta),
      y: -1 * (this.props.mark.ry + (BUFFER / this.props.scale.vertical)) * Math.sin(theta)
    };
  }

  handleRadiusHandleDrag(coord, e, d) {
    const { x, y } = this.props.getEventOffset(e);
    const r = this.constructor.getDistance(this.props.mark.x, this.props.mark.y, x, y);
    const angle = this.constructor.getAngle(this.props.mark.x, this.props.mark.y , x, y);
    this.props.mark[`r${coord}`] = r;
    this.props.mark.angle = angle;
    if (coord === 'y') this.props.mark.angle -= 90;
    this.props.onChange(this.props.mark);
  }

  render() {
    const positionAndRotate = `
      translate(${this.props.mark.x}, ${this.props.mark.y})
      rotate(${-1 * this.props.mark.angle})
    `;

    const deletePosition = this.getDeletePosition();
    const guideWidth = GUIDE_WIDTH / ((this.props.scale.horizontal + this.props.scale.vertical) / 2);

    return (
      <DrawingToolRoot tool={this} transform={positionAndRotate}>
        {this.props.selected &&
          <g>
            <line x1="0" y1="0" x2={this.props.mark.rx} y2="0" strokeWidth={guideWidth} strokeDasharray={GUIDE_DASH} />
            <line x1="0" y1="0" x2="0" y2={-1 * this.props.mark.ry} strokeWidth={guideWidth} strokeDasharray={GUIDE_DASH} />
          </g>}

        <ellipse rx={this.props.mark.rx} ry={this.props.mark.ry} />

        {this.props.selected &&
          <g>
            <DeleteButton tool={this} x={deletePosition.x} y={deletePosition.y} rotate={this.props.mark.angle} getScreenCurrentTransformationMatrix={this.props.getScreenCurrentTransformationMatrix} />
            <DragHandle onDrag={this.handleRadiusHandleDrag.bind(this, 'x')} x={this.props.mark.rx} y={0} scale={this.props.scale} getScreenCurrentTransformationMatrix={this.props.getScreenCurrentTransformationMatrix} />
            <DragHandle onDrag={this.handleRadiusHandleDrag.bind(this, 'y')} x={0} y={-1 * this.props.mark.ry} scale={this.props.scale} getScreenCurrentTransformationMatrix={this.props.getScreenCurrentTransformationMatrix} />
          </g>}
      </DrawingToolRoot>
    );
  }
}
