import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import FreehandSegmentShapeTool from './freehand-segment-shape';

describe('FreehandSegmentShapeTool', function () {
  let mark = FreehandSegmentShapeTool.defaultValues();
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

  it('should initialize with correct values', function () {
    expect(mark.points.length).to.equal(0);
    expect(mark._inProgress).to.be.false;
    expect(mark._currentlyDrawing).to.be.false;
  });

  describe('static methods', function () {
    before(function () {
      mark = FreehandSegmentShapeTool.initStart({ x, y }, mark);
    });

    it('create an initial mark', function () {
      expect(mark.points[0].x).to.equal(x);
      expect(mark.points[0].y).to.equal(y);
      expect(mark._inProgress).to.be.true;
      expect(mark._currentlyDrawing).to.be.true;
    });

    coords.forEach(function (coord, i) {
      it('should round coordinates on move to angle ' + roundedCoords[i].x, function () {
        const newMark = FreehandSegmentShapeTool.initMove(coord, mark);
        expect(newMark.points[i + 1].x).to.equal(roundedCoords[i].x);
        expect(newMark.points[i + 1].y).to.equal(roundedCoords[i].y);
      });
    });

    it('should finish drawing on initial release', function () {
      const newMark = FreehandSegmentShapeTool.initRelease({ x, y }, mark);
      expect(newMark._currentlyDrawing).to.be.false;
    });

    it('should designate as completed when forceComplete', function () {
      mark = FreehandSegmentShapeTool.forceComplete(mark);
      expect(FreehandSegmentShapeTool.isComplete(mark)).to.be.true;
    });
  });

  describe('rendered component', function () {
    let wrapper;
    const onChange = sinon.stub().callsFake(() => null);
    const getEventOffset = sinon.stub().callsFake((e) => e);

    const renderedMark = {
      points: roundedCoords,
      _inProgress: false
    };

    const scale = {
      horizontal: 1,
      vertical: 1
    };

    const containerRect = {
      top: 0,
      bottom: 500,
      left: 0,
      right: 500
    };

    const mockEventInViewer = {
      pageX: 0,
      pageY: 0,
      type: 'mouseenter'
    };

    const mockEventOutOfViewer = {
      pageX: -10,
      pageY: -10,
      type: 'mouseleave'
    };

    before(function () {
      wrapper = shallow(
        <FreehandSegmentShapeTool
          color="blue"
          containerRect={containerRect}
          getEventOffset={getEventOffset}
          getScreenCurrentTransformationMatrix={() => null}
          mark={renderedMark}
          onChange={onChange}
          scale={scale}
        />
      );
    });

    it('should correctly render the delete position', function () {
      const deleteButtonPos = wrapper.instance().getDeletePosition(renderedMark.points);
      expect(deleteButtonPos.x).to.equal(284);
      expect(deleteButtonPos.y).to.equal(400);
    });

    it('should handle finish click correctly', function () {
      wrapper.instance().handleFinishClick();
      const newMark = onChange.getCall(0).args[0];
      expect(onChange.callCount).to.equal(1);
      expect(newMark._inProgress).to.be.false;
    });

    it('should handle finish move correctly when in viewer', function () {
      wrapper.instance().handleFinishMove(mockEventInViewer);
      expect(wrapper.state().mouseWithinViewer).to.be.true;
    });

    it('should handle finish hover correctly when in viewer', function () {
      wrapper.instance().handleFinishHover(mockEventInViewer);
      expect(wrapper.state().firstPointHover).to.be.true;
    });

    it('should handle finish move correctly when out of viewer', function () {
      wrapper.instance().handleFinishMove(mockEventOutOfViewer);
      expect(wrapper.state().mouseWithinViewer).to.be.false;
    });

    it('should handle finish hover correctly when out of viewer', function () {
      wrapper.instance().handleFinishHover(mockEventOutOfViewer);
      expect(wrapper.state().firstPointHover).to.be.false;
    });
  });
});
