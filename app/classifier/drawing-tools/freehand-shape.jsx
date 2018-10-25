import React from 'react';
import PropTypes from 'prop-types';
import { svgPathProperties } from 'svg-path-properties';
import DrawingToolRoot from './root';
import DeleteButton from './delete-button';
import { createPathFromCoords, filterDupeCoords, roundCoords } from './freehand-helpers';

const BUFFER = 16;
const DELETE_BUTTON_WIDTH = 8;
const MINIMUM_LENGTH = 5;

class FreehandShapeTool extends React.Component {
  static defaultValues() {
    return {
      points: [],
      _inProgress: false
    };
  }

  static initStart(coords, mark) {
    mark.points.push(roundCoords(coords));
    return Object.assign({}, mark, { _inProgress: true });
  }

  static initMove(coords, mark) {
    mark.points.push(roundCoords(coords));
    return Object.assign({}, mark);
  }

  static initRelease(coords, mark) {
    mark.points.push(mark.points[0]);
    mark.points = filterDupeCoords(mark.points);
    return Object.assign({}, mark, { _inProgress: false });
  }

  static initValid(mark) {
    const path = createPathFromCoords(mark.points);
    const properties = svgPathProperties(path);
    return properties.getTotalLength() > MINIMUM_LENGTH;
  }

  getDeletePosition([startCoords, ...otherCoords]) {
    const { scale } = this.props;
    const overallScale = (scale.horizontal + scale.vertical) / 2;
    const mod = (BUFFER / overallScale);
    const x = startCoords.x - mod;
    return {
      x: this.outOfBounds(x, overallScale) ? startCoords.x + mod : x,
      y: startCoords.y
    };
  }

  outOfBounds(deleteBtnX, scale) {
    return deleteBtnX - (DELETE_BUTTON_WIDTH / scale) < 0;
  }

  render() {
    const {
      color,
      getScreenCurrentTransformationMatrix,
      mark,
      selected
    } = this.props;
    const { _inProgress, points } = mark;
    const path = createPathFromCoords(points);
    const fill = _inProgress ? 'none' : color;
    const lineClass = _inProgress ? 'drawing' : 'clickable';
    const deletePosition = this.getDeletePosition(points);

    return (
      <DrawingToolRoot tool={this}>
        <path
          d={path}
          fill={fill}
          fillOpacity="0.2"
          className={lineClass}
        />

        {(!_inProgress && selected) && (
          <g>
            <DeleteButton
              tool={this}
              x={deletePosition.x}
              y={deletePosition.y}
              getScreenCurrentTransformationMatrix={getScreenCurrentTransformationMatrix}
            />
          </g>
        )}
      </DrawingToolRoot>
    );
  }
}

FreehandShapeTool.propTypes = {
  color: PropTypes.string.isRequired,
  getScreenCurrentTransformationMatrix: PropTypes.func.isRequired,
  mark: PropTypes.shape({
    points: PropTypes.arrayOf(PropTypes.object)
  }),
  scale: PropTypes.shape({
    horizontal: PropTypes.number,
    vertical: PropTypes.number
  }),
  selected: PropTypes.bool
};

FreehandShapeTool.defaultProps = {
  mark: null,
  scale: {
    horizontal: 0,
    vertical: 0
  },
  selected: true
};

export default FreehandShapeTool;
