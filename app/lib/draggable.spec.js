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
  
  function testDragEnabled(startEvent, dragEvent, endEvent) {
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
      it('should cancel the default event', function () {
        expect(fakeEvent.preventDefault.callCount).to.equal(1);
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

  function testDragDisabled(startEvent, dragEvent, endEvent) {
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
    });
  }

  describe('with no support for pointer events', function () {
    testDragEnabled('mousedown', 'mousemove', 'mouseup');
    testDragEnabled('touchstart', 'touchmove', 'touchend');
    testDragDisabled('pointerdown', 'pointermove', 'pointerup');
  });

  describe('with support for pointer events', function () {
    before(function () {
      global.window.PointerEvent = {};
    });

    after(function () {
      delete global.window.PointerEvent;
    });
    
    testDragDisabled('mousedown', 'mousemove', 'mouseup');
    testDragDisabled('touchstart', 'touchmove', 'touchend');
    testDragEnabled('pointerdown', 'pointermove', 'pointerup');
  })

  describe('when disabled', function () {
    before(function () {
      document.body.addEventListener = sinon.stub().callsFake((eventType, handler) => {
        if (eventType === 'mousemove') handleDrag = handler;
        if (eventType === 'mouseup') handleEnd = handler;
      });
      wrapper = shallow(
        <Draggable
          disabled
          onStart={onStart}
          onDrag={onDrag}
          onEnd={onEnd}
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