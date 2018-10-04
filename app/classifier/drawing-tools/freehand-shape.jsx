import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import DrawingToolRoot from './root';
import deleteIfOutOfBounds from './delete-if-out-of-bounds';
import DeleteButton from './delete-button';
import { svgPathProperties } from 'svg-path-properties';
import { createPathFromCoords, filterDupeCoords, roundCoords } from './freehand-helpers';

const BUFFER = 16;
const DELETE_BUTTON_WIDTH = 8;
const MINIMUM_LENGTH = 5;

export default class FreehandShapeTool extends React.Component {
  constructor(props) {
    super(props);
    this.getDeletePosition = this.getDeletePosition.bind(this);
    this.outOfBounds = this.outOfBounds.bind(this);
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
    const { color, getScreenCurrentTransformationMatrix, mark, selected } = this.props;
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

FreehandShapeTool.defaultValues = () => (
  {
    points: [],
    _inProgress: false
  }
);

FreehandShapeTool.initStart = (coords, mark) => {
  mark.points.push(roundCoords, coords);
  return {
    _inProgress: true
  };
};

FreehandShapeTool.initMove = (coords, mark) => {
  mark.points.push(roundCoords, coords);
};

FreehandShapeTool.initRelease = (coords, mark) => {
  mark.points.push(mark.points[0]);
  mark.points = filterDupeCoords(mark.points);
  return {
    _inProgress: false
  };
};

FreehandShapeTool.initValid = (mark) => {
  const path = createPathFromCoords(mark.points);
  const properties = svgPathProperties(path);
  return properties.getTotalLength() > MINIMUM_LENGTH;
};
