import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Draggable } from './draggable';

describe('Draggable', function () {
  let wrapper;
  let handleDrag;
  let handleEnd;
  let onStart;
  let onDrag;
  let onEnd;
  before(function () {
    onStart = sinon.stub();
    onDrag = sinon.stub().callsFake((e, d) => d);
    onEnd = sinon.stub();
    wrapper = shallow(
      <Draggable
        onStart={onStart}
        onDrag={onDrag}
        onEnd={onEnd}
      >
        <p>Hello</p>
      </Draggable>
    );
  });
  describe('on mousedown', function () {
    before(function () {
      document.body.addEventListener = sinon.stub().callsFake((eventType, handler) => {
        if (eventType === 'mousemove') handleDrag = handler;
        if (eventType === 'mouseup') handleEnd = handler;
      });
      document.body.removeEventListener = sinon.stub();
      const fakeEvent = {
        type: 'mousedown',
        preventDefault: () => null,
        pageX: 50,
        pageY: 30
      };
      wrapper.find('p').simulate('mousedown', fakeEvent);
    });
    after(function () {
      onStart.resetHistory();
      onDrag.resetHistory();
      onEnd.resetHistory();
    });
    it('should add two event listeners', function () {
      expect(document.body.addEventListener.callCount).to.equal(2);
    });
    it('should add a listener for mousemove', function () {
      expect(document.body.addEventListener.calledWith('mousemove')).to.be.true;
    });
    it('should add a listener for mouseup', function () {
      expect(document.body.addEventListener.calledWith('mouseup')).to.be.true;
    });
    it('should call the onStart callback', function () {
      expect(onStart.callCount).to.equal(1);
    });
    describe('on drag', function () {
      before(function () {
        const fakeEvent = {
          pageX: 100,
          pageY: 100
        };
        handleDrag(fakeEvent);
      });
      it('should call the onDrag callback', function () {
        expect(onDrag.callCount).to.equal(1);
      });
      it('should pass the change in x', function () {
        expect(onDrag.returnValues[0].x).to.equal(50);
      });
      it('should pass the change in y', function () {
        expect(onDrag.returnValues[0].y).to.equal(70);
      });
    });
    describe('on drag end', function () {
      before(function () {
        handleEnd({});
      });
      it('should remove the mousemove listener', function () {
        expect(document.body.removeEventListener.calledWith('mousemove')).to.be.true;
      });
      it('should remove the mouseup listener', function () {
        expect(document.body.removeEventListener.calledWith('mouseup')).to.be.true;
      });
      it('should call the onEnd callback', function () {
        expect(onEnd.callCount).to.equal(1);
      });
    });
  });
  describe('on touchstart', function () {
    before(function () {
      document.body.addEventListener = sinon.stub().callsFake((eventType, handler) => {
        if (eventType === 'touchmove') handleDrag = handler;
        if (eventType === 'touchend') handleEnd = handler;
      });
      document.body.removeEventListener = sinon.stub();
      const fakeEvent = {
        type: 'touchstart',
        preventDefault: () => null,
        pageX: 50,
        pageY: 30
      };
      wrapper.find('p').simulate('touchstart', fakeEvent);
    });
    after(function () {
      onStart.resetHistory();
      onDrag.resetHistory();
      onEnd.resetHistory();
    });
    it('should add two event listeners', function () {
      expect(document.body.addEventListener.callCount).to.equal(2);
    });
    it('should add a listener for touchmove', function () {
      expect(document.body.addEventListener.calledWith('touchmove')).to.be.true;
    });
    it('should add a listener for touchend', function () {
      expect(document.body.addEventListener.calledWith('touchend')).to.be.true;
    });
    it('should call the onStart callback', function () {
      expect(onStart.callCount).to.equal(1);
    });
    describe('on drag', function () {
      before(function () {
        const fakeEvent = {
          pageX: 100,
          pageY: 100
        };
        handleDrag(fakeEvent);
      });
      it('should call the onDrag callback', function () {
        expect(onDrag.callCount).to.equal(1);
      });
      it('should pass the change in x', function () {
        expect(onDrag.returnValues[0].x).to.equal(50);
      });
      it('should pass the change in y', function () {
        expect(onDrag.returnValues[0].y).to.equal(70);
      });
    });
    describe('on drag end', function () {
      before(function () {
        handleEnd({});
      });
      it('should remove the touchmove listener', function () {
        expect(document.body.removeEventListener.calledWith('touchmove')).to.be.true;
      });
      it('should remove the touchend listener', function () {
        expect(document.body.removeEventListener.calledWith('touchend')).to.be.true;
      });
      it('should call the onEnd callback', function () {
        expect(onEnd.callCount).to.equal(1);
      });
    });
    describe('when disabled', function () {
      before(function () {
        document.body.addEventListener = sinon.stub().callsFake((eventType, handler) => {
          if (eventType === 'mousemove') handleDrag = handler;
          if (eventType === 'mouseup') handleEnd = handler;
        });
        wrapper.setProps({ disabled: true });
      });
      it('should not respond to mousedown', function () {
        wrapper.find('p').simulate('mousedown');
        expect(document.body.addEventListener.callCount).to.equal(0);
      });
      it('should not respond to touchstart', function () {
        wrapper.find('p').simulate('touchstart');
        expect(document.body.addEventListener.callCount).to.equal(0);
      });
    })
  });
});