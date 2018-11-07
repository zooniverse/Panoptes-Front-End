import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import drawingTools from '../drawing-tools';

const x = 200;
const y = 400;
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

const props = {
  color: 'red',
  containerRect: {
    height: 100,
    width: 100
  },
  naturalHeight: 100,
  naturalWidth: 100,
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

for (const toolType in drawingTools) {
  let wrapper;
  const TaskComponent = drawingTools[toolType];

  describe(`Task  ${toolType}`, function() {
    let mark;

    before(function () {
      mark = TaskComponent.defaultValues({ x, y }, props);
      mark.tool = 0;
    });

    it('should make changes with initStart', function() {
      const initialMark = Object.assign({}, mark);
      if (TaskComponent.initStart) {
        const initStartResult = TaskComponent.initStart(cursors[0], mark);
        expect(initialMark).to.not.equal(mark);
        expect(initStartResult).to.be.an('object');
      }
    });

    it ('should make changes with initMove', function() {
      const initialMark = Object.assign({}, mark);
      if (TaskComponent.initMove) {
        const markChanges = TaskComponent.initMove(cursors[1], mark);
        expect(initialMark).to.not.equal(mark);
        expect(markChanges).to.be.an('object');
      }
    });

    it ('should run initRelease', function() {
      const initialMark = Object.assign({}, mark);
      if (TaskComponent.initRelease) {
        const initReleaseResult = TaskComponent.initRelease(cursors[2], mark);
        expect(initialMark).to.not.equal(mark);
        expect(initReleaseResult).to.be.an('object');
      }
    });

    it ('should return a boolean with initValid', function() {
      if (TaskComponent.initValid) {
        const isValid = TaskComponent.initValid(mark, props);
        expect(isValid).to.be.a('boolean');
      }
    });

    it ('should run getDistance', function() {
      if (TaskComponent.getDistance) {
        const distance = TaskComponent.getDistance(cursors[0].x, cursors[0].y, cursors[1].x, cursors[1].y);
        expect(Math.round(distance)).to.equal(71);
      }
    });

    it ('should correctly calculate getAngle', function() {
      if (TaskComponent.getAngle) {
        const angle = TaskComponent.getAngle(cursors[0].x, cursors[0].y, cursors[1].x, cursors[1].y);
        expect(Math.abs(angle)).to.equal(135);
      }
    });

    it ('should successfuly check for completed mark', function() {
      if (TaskComponent.forceComplete) {
        TaskComponent.forceComplete(mark);
      }

      if (TaskComponent.isComplete) {
        const isComplete = TaskComponent.isComplete(mark);
        expect(isComplete).to.be.true;
      }
    });
  });

  describe('rendered component', function () {
    const mark = TaskComponent.defaultValues({ x, y }, props);

    if (TaskComponent.initStart) {
      Object.assign(mark, TaskComponent.initStart({ x, y }, mark));
    }

    before(function () {
      wrapper = shallow(
        <TaskComponent {...props} mark={mark} />
      );
    });

    it('should render correctly', function () {
      expect(wrapper).to.be.ok;
      expect(wrapper.instance()).to.be.an.instanceof(TaskComponent);
    });
  });
}
