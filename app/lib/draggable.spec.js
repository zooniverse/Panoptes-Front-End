import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Draggable } from './draggable';

describe('Draggable', function () {
  
  function testDragEnabled(startEvent, dragEvent, endEvent, usePointer) {
    let wrapper;
    let handleDrag = () => false;
    let handleEnd = () => false;
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
          usePointer={usePointer}
        >
          <p>Hello</p>
        </Draggable>
      );
    });

    describe('on ' + startEvent, function () {
      let fakeEvent;
      before(function () {
        document.body.addEventListener = sinon.stub().callsFake((eventType, handler) => {
          if (eventType === dragEvent) handleDrag = handler;
          if (eventType === endEvent) handleEnd = handler;
        });
        document.body.removeEventListener = sinon.stub();
        fakeEvent = {
          type: startEvent,
          preventDefault: sinon.stub(),
          stopPropagation: sinon.stub(),
          pageX: 50,
          pageY: 30
        };
        wrapper.find('p').simulate(startEvent, fakeEvent);
      });
      after(function () {
        onStart.resetHistory();
        onDrag.resetHistory();
        onEnd.resetHistory();
      });
      it('should cancel the default event', function () {
        expect(fakeEvent.preventDefault.callCount).to.equal(1);
      });
      it('should not cancel event bubbling', function () {
        expect(fakeEvent.stopPropagation.callCount).to.equal(0);
      });
      it('should add two event listeners', function () {
        expect(document.body.addEventListener.callCount).to.equal(2);
      });
      it('should add a listener for ' + dragEvent, function () {
        expect(document.body.addEventListener.calledWith(dragEvent)).to.be.true;
      });
      it('should add a listener for ' + endEvent, function () {
        expect(document.body.addEventListener.calledWith(endEvent)).to.be.true;
      });
      it('should call the onStart callback', function () {
        expect(onStart.callCount).to.equal(1);
      });
      describe('on drag', function () {
        let fakeEvent
        before(function () {
          fakeEvent = {
            preventDefault: sinon.stub(),
            stopPropagation: sinon.stub(),
            type: dragEvent,
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
        it('should cancel the default event', function () {
          expect(fakeEvent.preventDefault.callCount).to.equal(1);
        });
        it('should cancel event bubbling', function () {
          expect(fakeEvent.stopPropagation.callCount).to.equal(1);
        });
      });
      describe('on drag end', function () {
        before(function () {
          handleEnd({});
        });
        it('should remove the ' + dragEvent + ' listener', function () {
          expect(document.body.removeEventListener.calledWith(dragEvent)).to.be.true;
        });
        it('should remove the ' + endEvent + ' listener', function () {
          expect(document.body.removeEventListener.calledWith(endEvent)).to.be.true;
        });
        it('should call the onEnd callback', function () {
          expect(onEnd.callCount).to.equal(1);
        });
      });
    });
  }

  function testDragDisabled(startEvent, dragEvent, endEvent, usePointer) {
    let wrapper;
    let handleDrag = () => false;
    let handleEnd = () => false;
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
          usePointer={usePointer}
        >
          <p>Hello</p>
        </Draggable>
      );
    });

    describe('on ' + startEvent, function () {
      let fakeEvent;
      before(function () {
        document.body.addEventListener = sinon.stub().callsFake((eventType, handler) => {
          if (eventType === dragEvent) handleDrag = handler;
          if (eventType === endEvent) handleEnd = handler;
        });
        document.body.removeEventListener = sinon.stub();
        fakeEvent = {
          type: startEvent,
          preventDefault: sinon.stub(),
          pageX: 50,
          pageY: 30
        };
        wrapper.find('p').simulate(startEvent, fakeEvent);
      });
      after(function () {
        onStart.resetHistory();
        onDrag.resetHistory();
        onEnd.resetHistory();
      });
      it('should not cancel the default event', function () {
        expect(fakeEvent.preventDefault.callCount).to.equal(0);
      });
      it('should not add two event listeners', function () {
        expect(document.body.addEventListener.callCount).to.equal(0);
      });
      it('should not add a listener for ' + dragEvent, function () {
        expect(document.body.addEventListener.calledWith(dragEvent)).to.be.false;
      });
      it('should not add a listener for ' + endEvent, function () {
        expect(document.body.addEventListener.calledWith(endEvent)).to.be.false;
      });
      it('should not call the onStart callback', function () {
        expect(onStart.callCount).to.equal(0);
      });
      describe('on drag', function () {
        let fakeEvent
        before(function () {
          fakeEvent = {
            pageX: 100,
            pageY: 100
          };
          handleDrag(fakeEvent);
        });
        it('should not call the onDrag callback', function () {
          expect(onDrag.callCount).to.equal(0);
        });
      });
      describe('on drag end', function () {
        before(function () {
          handleEnd({});
        });
        it('should not call the onEnd callback', function () {
          expect(onEnd.callCount).to.equal(0);
        });
      });
    });
  }

  describe('with no support for pointer events', function () {

    testDragEnabled('mousedown', 'mousemove', 'mouseup', false);
    testDragEnabled('touchstart', 'touchmove', 'touchend', false);
    testDragDisabled('pointerdown', 'pointermove', 'pointerup', false);
  });

  describe('with support for pointer events', function () {
    
    testDragDisabled('mousedown', 'mousemove', 'mouseup', true);
    testDragDisabled('touchstart', 'touchmove', 'touchend', true);
    testDragEnabled('pointerdown', 'pointermove', 'pointerup', true);
  })

  describe('when disabled', function () {
    let wrapper;
    before(function () {
      document.body.addEventListener = sinon.stub().callsFake((eventType, handler) => {
        if (eventType === 'mousemove') handleDrag = handler;
        if (eventType === 'mouseup') handleEnd = handler;
      });
      wrapper = shallow(
        <Draggable
          disabled
          onStart={sinon.stub()}
          onDrag={sinon.stub()}
          onEnd={sinon.stub()}
        >
          <p>Hello</p>
        </Draggable>
      );
    });

    it('should not respond to mousedown', function () {
      wrapper.find('p').simulate('mousedown');
      expect(document.body.addEventListener.callCount).to.equal(0);
    });
    it('should not respond to touchstart', function () {
      wrapper.find('p').simulate('touchstart');
      expect(document.body.addEventListener.callCount).to.equal(0);
    });
    it('should not respond to pointerdown', function () {
      wrapper.find('p').simulate('pointerdown');
      expect(document.body.addEventListener.callCount).to.equal(0);
    });
  });

  describe('with multitouch gestures', function () {
    let wrapper;
    let handleDrag = () => false;
    let handleEnd = () => false;
    let onStart;
    let onDrag;
    let onEnd;
    function fakeEvent(type) {
      return {
        preventDefault: sinon.stub(),
        type,
        touches: [
          {
            pageX: 30,
            pageY: 50
          },
          {
            pageX: 40,
            pageY: 60
          }
        ]
      }
    }

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
      document.body.addEventListener = sinon.stub().callsFake((eventType, handler) => {
        if (eventType === 'touchmove') handleDrag = handler;
        if (eventType === 'touchend') handleEnd = handler;
      });
    });

    it('should not respond to touchstart', function () {
      wrapper.find('p').simulate('touchstart', fakeEvent('touchstart'));
      expect(onStart.callCount).to.equal(0);
    });

    it('should not cancel the default start event', function () {
      const startEvent = fakeEvent('touchstart');
      wrapper.find('p').simulate('touchstart', startEvent);
      expect(startEvent.preventDefault.callCount).to.equal(0);
    });

    it('should not respond to touchmove', function () {
      handleDrag(fakeEvent('touchmove'));
      expect(onDrag.callCount).to.equal(0);
    });

    it('should not respond to touchend', function () {
      handleEnd(fakeEvent('touchend'));
      expect(onEnd.callCount).to.equal(0);
    });
  });
});
