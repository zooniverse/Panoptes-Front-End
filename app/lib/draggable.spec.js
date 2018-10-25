import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Draggable } from './draggable';

describe('Draggable', function () {
  let wrapper;
  let handleDrag;
  let handleEnd;
  before(function () {
    wrapper = shallow(
      <Draggable>
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
        preventDefault: () => null
      };
      wrapper.find('p').simulate('mousedown', fakeEvent);
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
        preventDefault: () => null
      };
      wrapper.find('p').simulate('touchstart', fakeEvent);
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
    });
  })
});