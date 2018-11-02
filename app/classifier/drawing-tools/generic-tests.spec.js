import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import drawingTools from '../drawing-tools';

const x = 200;
const y = 400;
const event = (e) => e;
const cursors = [
  {
    x: 300,
    y: 400
  },
  {
    x: 250,
    y: 450
  },
  {
    x: 200,
    y: 500
  }
];

for (const property in drawingTools) {
  let wrapper;
  const TaskComponent = drawingTools[property];
  const props = {
    color: 'red',
    containerRect: {
      height: 100,
      width: 100
    },
    getEventOffset: sinon.stub().callsFake((e) => e),
    getScreenCurrentTransformationMatrix: () => null,
    naturalHeight: 100,
    naturalWidth: 100,
    onChange: sinon.stub().callsFake(() => null),
    preferences: {
      preferences: {}
    },
    scale: {
      horizontal: 1,
      vertical: 1
    },
    task: {
      tools: [{ offsetX: 50, offsetY: 50 }]
    }
  };

  describe(`Task  ${property}`, function() {
    let defaultValues;

    before(function () {
      defaultValues = TaskComponent.defaultValues({ x, y }, props);
      defaultValues.tool = 0
    });

    it('should return an object with initStart', function() {
      // let mark = TaskComponent.defaultValues();
      if (TaskComponent.initStart) {
        TaskComponent.initStart({ x, y }, defaultValues);
      }
    });

    it ('should run initMove', function() {
      if (TaskComponent.initMove) {
        TaskComponent.initMove(cursors[1], defaultValues, event);
      }
    });

    it ('should run initRelease', function() {
      if (TaskComponent.initRelease) {
        TaskComponent.initRelease(cursors[2], defaultValues, event);
      }
    });

    it ('should run initValid', function() {
      if (TaskComponent.initValid) {
        TaskComponent.initValid(defaultValues, props);
      }
    });

    it ('should run getDistance', function() {
      if (TaskComponent.getDistance) {
        TaskComponent.getDistance(cursors[0].x, cursors[0].y, cursors[1].x, cursors[1].y);
      }
    });

    it ('should run getAngle', function() {
      if (TaskComponent.getAngle) {
        TaskComponent.getAngle(cursors[0].x, cursors[0].y, cursors[1].x, cursors[1].y);
      }
    });

    it ('should run isComplete', function() {
      if (TaskComponent.isComplete) {
        TaskComponent.isComplete(defaultValues);
      }
    });

    it ('should run forceComplete', function() {
      if (TaskComponent.forceComplete) {
        TaskComponent.forceComplete(defaultValues);
      }
    });
  });

  describe('rendered component', function() {
    const mark = TaskComponent.defaultValues({ x, y }, props);

    if (TaskComponent.initStart) {
      TaskComponent.initStart({ x, y }, mark);
    }

    before(function () {
      wrapper = shallow(
        <TaskComponent {...props} mark={mark} />
      );
    });

    it('should render correctly', function () {
      expect(wrapper).to.be.ok;
    });
  });
}
