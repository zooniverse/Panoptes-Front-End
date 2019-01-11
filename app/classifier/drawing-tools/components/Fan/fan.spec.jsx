import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Fan from './fan';

describe('Fan Tool', function () {
  let mark;
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
    },
    {
      x: 150,
      y: 450
    },
    {
      x: 100,
      y: 400
    },
    {
      x: 150,
      y: 350
    },
    {
      x: 200,
      y: 300
    },
    {
      x: 250,
      y: 350
    }
  ];
  const rotations = [0, 45, 90, 135, 180, 225, 270, 315];
  before(function () {
    mark = Fan.initStart({ x, y });
  });
  it('should create a mark at a given position', function () {
    expect(mark.x).to.equal(x);
    expect(mark.y).to.equal(y);
    expect(mark._inProgress).to.be.true;
  });
  cursors.forEach(function (cursor, i) {
    it('should update after a cursor move to angle ' + rotations[i], function () {
      const newMark = Fan.initMove(cursor, mark);
      expect(newMark.rotation).to.equal(rotations[i]);
    });
  });
  it('should update mark radius after a cursor move', function () {
    const cursor = {
      x: 170,
      y: 360
    };
    const newMark = Fan.initMove(cursor, mark);
    expect(newMark.radius).to.equal(50);
  });
  it('should finish drawing on initial release', function () {
    const newMark = Fan.initRelease();
    expect(newMark._inProgress).to.be.false;
  });

  describe('rendered component', function () {
    let wrapper;
    const onChange = sinon.stub().callsFake(() => null);
    const mark = {
      x: 200,
      y: 400,
      radius: 70,
      rotation: 45,
      spread: 30
    };

    before(function () {
      wrapper = shallow(
        <Fan
          mark={mark}
          getEventOffset={e => e}
          onChange={onChange}
          getScreenCurrentTransformationMatrix={() => null}
          normalizeDifference={() => null}
          selected={true}
        />
      );
    });

    describe('the rotation drag handle', function () {

      afterEach(function () {
        onChange.resetHistory();
      });

      cursors.forEach(function (cursor, i) {
        it('should update rotation to ' + rotations[i], function () {
          wrapper.instance().handleRotate(cursor);
          expect(onChange.callCount).to.equal(1);
          const newMark = onChange.getCall(0).args[0];
          expect(newMark.rotation).to.equal(rotations[i]);
        });
      });

      it('should update radius when dragged', function () {
        const cursor = {
          x: 170,
          y: 360
        };
        wrapper.instance().handleRotate(cursor);
        expect(onChange.callCount).to.equal(1);
        const newMark = onChange.getCall(0).args[0];
        expect(newMark.radius).to.equal(50);
      });
    });

    describe('the spread drag handles', function () {

      afterEach(function () {
        onChange.resetHistory();
      });

      cursors.forEach(function (cursor, i) {
        const cursorAngle = rotations[i];
        [15, 30, 45, 70, 90].forEach(function (halfSpread) {
          it('should update spread correctly for mark rotation ' + (rotations[i] - halfSpread) + ', spread ' + halfSpread, function () {
            mark.rotation = cursorAngle - halfSpread;
            wrapper.setProps({ mark });
            wrapper.instance().handleSpread(cursor);
            expect(onChange.callCount).to.equal(1);
            const newMark = onChange.getCall(0).args[0];
            expect(newMark.spread).to.equal(halfSpread * 2);
          });

          it('should update spread correctly for mark rotation ' + (rotations[i] - halfSpread) + ', spread ' + -halfSpread, function () {
            mark.rotation = cursorAngle + halfSpread;
            wrapper.setProps({ mark });
            wrapper.instance().handleSpread(cursor);
            expect(onChange.callCount).to.equal(1);
            const newMark = onChange.getCall(0).args[0];
            expect(newMark.spread).to.equal(Math.abs(halfSpread) * 2);
          });
        });
      });

      it('should not allow spreads greater than 180 degrees', function () {
        cursors.forEach(function (cursor, i) {
          [95, 120, -95, -120].forEach(function (halfSpread) {
            const cursorAngle = rotations[i];
            mark.rotation = cursorAngle - halfSpread;
            wrapper.setProps({ mark });
            wrapper.instance().handleSpread(cursor);
            expect(onChange.callCount).to.equal(1);
            const newMark = onChange.getCall(0).args[0];
            expect(newMark.spread).to.equal(180);
            onChange.resetHistory();
          });
        });
      });
      it('should update correctly when the cursor crosses the x-axis', function () {
        const cursor = {
          x: 300,
          y: 400
        };
        mark.rotation = 315;
        wrapper.setProps({ mark });
        wrapper.instance().handleSpread(cursor);
        expect(onChange.callCount).to.equal(1);
        const newMark = onChange.getCall(0).args[0];
        expect(newMark.spread).to.equal(90);
        onChange.resetHistory();
      });
    });
  });
});
