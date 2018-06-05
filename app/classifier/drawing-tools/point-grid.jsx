import PropTypes from 'prop-types';

import React from 'react';
import DrawingToolRoot from './root';
import DeleteButton from './delete-button';

class PointGridTool extends React.Component {

  static defaultValues({ x, y }) {
    return { x, y };
  }

  static initStart({ x, y }) {
    return { x, y, _inProgress: true };
  }

  static initRelease() {
    return { _inProgress: false };
  }

  static initValid(mark, props) {
    const naturalWidth = props.naturalWidth;
    const naturalHeight = props.naturalHeight;
    const offsetX = Number.parseInt(props.task.tools[mark.tool].offsetX, 10);
    const offsetY = Number.parseInt(props.task.tools[mark.tool].offsetX, 10);

    const notBeyondWidth = mark.x < naturalWidth;
    const notBeyondHeight = mark.y < naturalHeight;
    const beyondOffset = mark.x > offsetX && mark.y > offsetY;

    return notBeyondWidth && notBeyondHeight && beyondOffset;
  }

  getDeleteButtonPosition(row, col, width, height) {
    const y = (row === 0) ? (1.1 * height) : (-0.1 * height);
    const x = (col + 1 === this.props.cols) ? (-0.1 * width) : (1.1 * width);
    return {
      x, y
    };
  }

  render() {
    const { offsetX } = this.props;
    const { offsetY } = this.props;

    const width = ((this.props.containerRect.width / this.props.scale.horizontal) - offsetX) / this.props.rows;
    const height = ((this.props.containerRect.height / this.props.scale.vertical) - offsetY) / this.props.cols;

    let x = (this.props.mark.x - offsetX);
    let y = (this.props.mark.y - offsetY);

    x = (Math.floor(x / width));
    y = Math.floor(y / height);
    const row = y;
    const col = x;

    x = (x * width) + offsetX;
    y = (y * height) + offsetY;

    return (
      <DrawingToolRoot tool={this} transform={`translate(${x}, ${y})`}>
        <rect
          x="0" y="0" width={width}
          height={height}
          fill={this.props.color}
          fillOpacity={this.props.opacity / 100}
          strokeOpacity={(this.props.selected) ? '.8' : '0'}
        />

        {!!this.props.selected &&
          <DeleteButton
            tool={this} {...this.getDeleteButtonPosition(row, col, width, height)}
            getScreenCurrentTransformationMatrix={this.props.getScreenCurrentTransformationMatrix}
          />
        }
      </DrawingToolRoot>
    );
  }
}

PointGridTool.options = ['grid'];

PointGridTool.propTypes = {
  scale: PropTypes.shape({
    horizontal: PropTypes.number,
    vertical: PropTypes.number
  }),
  rows: PropTypes.number,
  cols: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  opacity: PropTypes.number,
  getScreenCurrentTransformationMatrix: PropTypes.func, // ????
  mark: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  containerRect: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  color: PropTypes.string,
  selected: PropTypes.bool
};

PointGridTool.defaultProps = {
  rows: 10,
  cols: 10,
  offsetX: 50,
  offsetY: 50,
  opacity: 50
};

export default PointGridTool;
