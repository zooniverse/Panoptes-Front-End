import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import FreehandShapeTool from './freehand-shape';

describe('FreehandShapeTool', function () {
  let mark = FreehandShapeTool.defaultValues();
  const x = 200;
  const y = 400;

  const coords = [
    {
      x: 300.01,
      y: 400.02
    },
    {
      x: 250.03,
      y: 450.04
    },
    {
      x: 200.051,
      y: 500.06
    }
  ];

  const roundedCoords = [
    {
      x: 300,
      y: 400
    },
    {
      x: 250,
      y: 450
    },
    {
      x: 200.1,
      y: 500.1
    }
  ];

  before(function () {
    mark = FreehandShapeTool.initStart({ x, y }, mark);
  });

  it('create an initial mark', function () {
    expect(mark.points[0].x).to.equal(x);
    expect(mark.points[0].y).to.equal(y);
    expect(mark._inProgress).to.be.true;
  });

  coords.forEach(function (coord, i) {
    it('should round coordinates on move to angle ' + roundedCoords[i].x, function () {
      const newMark = FreehandShapeTool.initMove(coord, mark);
      expect(newMark.points[i + 1].x).to.equal(roundedCoords[i].x);
      expect(newMark.points[i + 1].y).to.equal(roundedCoords[i].y);
    });
  });

  it('should finish drawing on initial release', function () {
    const newMark = FreehandShapeTool.initRelease({ x, y }, mark);
    expect(newMark._inProgress).to.be.false;
  });

  it('should designate a mark as valid', function () {
    expect(FreehandShapeTool.initValid(mark)).to.be.true;
  });

  describe('rendered component', function () {
    let wrapper;

    const mark = {
      points: roundedCoords,
      _inProgress: false
    };

    const scale = {
      horizontal: 1,
      vertical: 1
    };

    before(function () {
      wrapper = shallow(
        <FreehandShapeTool
          mark={mark}
          color="blue"
          getScreenCurrentTransformationMatrix={() => null}
          scale={scale}
        />
      );
    });

    it('should correctly render the delete position', function () {
      const deleteButtonPos = wrapper.instance().getDeletePosition(mark.points);
      expect(deleteButtonPos.x).to.equal(284);
      expect(deleteButtonPos.y).to.equal(400);
    });
  });
});
