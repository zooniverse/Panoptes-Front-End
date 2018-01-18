// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import PanZoom from './pan-zoom';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

describe('PanZoom', function () {
  describe('if props.panEnabled is true', function () {
    let wrapper;

    beforeEach(function () {
      wrapper = shallow(<PanZoom enabled={true} />);
    });

    it('should render a zoom-in, a zoom-out, rotate, and reset button', function () {
      assert.equal(wrapper.find('button.zoom-out').length, 1);
      assert.equal(wrapper.find('button.zoom-in').length, 1);
      assert.equal(wrapper.find('button.rotate').length, 1);
      assert.equal(wrapper.find('button.reset').length, 1);
    });

    it('if this.state.panEnabled is false, PanZoom should render a pointer button', function () {
      assert.equal(wrapper.find('button.fa-mouse-pointer').length, 1);
    });

    it('if this.state.panEnabled is true, PanZoom should render a pan button', function () {
      wrapper.setState({ panEnabled: true });

      assert.equal(wrapper.find('button.fa-arrows').length, 1);
    });
  });

  describe('methods', function () {
    describe('#handleFocus', function () {
      let wrapper;
      let zoomInButton;

      beforeEach(function () {
        wrapper = mount(<PanZoom enabled={true} />);
        zoomInButton = wrapper.find('button.zoom-in');
        wrapper.instance().handleFocus('zoomIn');
      });

      it('should set state.panEnabled to true', function () {
        assert.equal(wrapper.state('panEnabled'), true);
      });

      it('should focus the button passed as the argument', function () {
        assert.equal(document.activeElement, zoomInButton.instance());
      });
    });

    describe('#cannotZoomOut()', function () {
      let wrapper;
      const originalFrameDimensions = { width: 100, height: 100, x: 0, y: 0 };

      beforeEach(function () {
        wrapper = mount(<PanZoom enabled={true} frameDimensions={originalFrameDimensions} />);
      });

      it('returns false if there is room to zoom out', function () {
        wrapper.setState({ viewBoxDimensions: { width: 50, heigth: 50, x: 25, y: 25 }});

        assert.equal(wrapper.instance().cannotZoomOut(), false);
      });

      it('returns true if there is not room to zoom out', function () {
        wrapper.setState({ viewBoxDimensions: { width: 100, height: 100, x: 0, y: 0 }});

        assert.equal(wrapper.instance().cannotZoomOut(), true);
      });
    });

    describe('#cannotResetZoomRotate', function () {
      let wrapper;
      const originalFrameDimensions = { width: 100, height: 100, x: 0, y: 0 };

      beforeEach(function () {
        wrapper = mount(<PanZoom enabled={true} frameDimensions={originalFrameDimensions} />);
      });

      it('returns false if state.rotation is not 0', function () {
        wrapper.setState({ viewBoxDimensions: { width: 100, height: 100, x: 0, y: 0 }, rotation: 90 });

        assert.equal(wrapper.instance().cannotResetZoomRotate(), false);
      });

      it('returns false if there frameDimensions are not identical to viewBoxDimensions', function () {
        wrapper.setState({ viewBoxDimensions: { width: 50, height: 50, x: 0, y: 0 }, rotation: 0 });

        assert.equal(wrapper.instance().cannotResetZoomRotate(), false);
      });

      it('returns true if there is not room to zoom out and degrees rotated is 0', function () {
        wrapper.setState({ viewBoxDimensions: { width: 100, height: 100, x: 0, y: 0 }, rotation: 0 });

        assert.equal(wrapper.instance().cannotResetZoomRotate(), true);
      });
    });

    describe('#continuousZoom()', function () {
      let wrapper;
      let clearZoomingTimeout;
      let zoomSpy;

      beforeEach(function () {
        wrapper = mount(<PanZoom enabled={true} />);
        clearZoomingTimeout = sinon.spy(wrapper.instance(), 'clearZoomingTimeout');
        zoomSpy = sinon.spy(wrapper.instance(), 'zoom');
      });

      it('should should call #clearZoomingTimeout and #zoom', function () {
        const change = 1;
        wrapper.instance().continuousZoom(change);

        sinon.assert.called(clearZoomingTimeout);
        sinon.assert.calledWith(zoomSpy, change);
        assert.equal(wrapper.state('zooming'), true);
      });

      it('if change is 0, state.zooming should remain false', function () {
        const change = 0;
        wrapper.instance().continuousZoom(change);

        assert.equal(wrapper.state('zooming'), false);
      });
    });

    describe('#clearZoomingTimeout()', function () {
      it('should call clearTimeout, if there is value for zoomingTimeoutID', function () {
        const clock = sinon.useFakeTimers();
        const wrapper = mount(<PanZoom enabled={true} />);
        const clearTimeoutSpy = sinon.spy(clock, 'clearTimeout');
        wrapper.instance().continuousZoom(1);
        wrapper.instance().clearZoomingTimeout();

        sinon.assert.called(clearTimeoutSpy);
      });
    });

    describe('#keyDownZoomButton()', function () {
      it('it should call #zoom()', function () {
        const originalFrameDimensions = { width: 100, height: 100, x: 0, y: 0 };
        const wrapper = mount(<PanZoom enabled={true} frameDimensions={originalFrameDimensions} />);
        const zoomSpy = sinon.spy(wrapper.instance(), 'zoom');
        const change = 10;
        const keyEvent = { which: 13, preventDefault() { return 'This is a mock'; } };
        wrapper.setState(
          { viewBoxDimensions: { width: 50, height: 50, x: 25, y: 25 }, panEnabled: true }
        );
        wrapper.instance().keyDownZoomButton(change, keyEvent);

        sinon.assert.calledWith(zoomSpy, 10);
        assert.equal(wrapper.state('zooming'), true);
      });
    });

    describe('#stopZoom()', function () {
      it('should set this.state.zooming to false', function () {
        const wrapper = mount(<PanZoom enabled={true} />);
        const clickEvent = { stopPropagation() { return 'This is a mock'; } };
        const continuousZoomSpy = sinon.spy(wrapper.instance(), 'continuousZoom');
        wrapper.setState({ zooming: true });
        wrapper.instance().stopZoom(clickEvent);

        assert.equal(wrapper.state('zooming'), false);
        sinon.assert.calledWith(continuousZoomSpy, 0);
      });
    });

    describe('#zoomReset()', function () {
      it('should reset the viewBoxDimensions to the orignal frame dimensions', function () {
        const originalFrameDimensions = { width: 100, height: 100, x: 0, y: 0 };
        const wrapper = mount(<PanZoom enabled={true} frameDimensions={originalFrameDimensions} />);
        wrapper.setState({ viewBoxDimensions: { width: 50, heigth: 50, x: 25, y: 25 }});
        wrapper.instance().zoomReset();

        assert.deepEqual(wrapper.state('viewBoxDimensions'), originalFrameDimensions);
      });
    });

    describe('#togglePanOn()', function () {
      it('should set this.state.panEnabled to true', function () {
        const wrapper = mount(<PanZoom enabled={true} />);
        wrapper.instance().togglePanOn();

        assert.equal(wrapper.state('panEnabled'), true);
      });
    });

    describe('#togglePanOff()', function () {
      it('should set this.state.panEnabled to false', function () {
        const wrapper = mount(<PanZoom enabled={true} />);
        wrapper.instance().togglePanOff();

        assert.equal(wrapper.state('panEnabled'), false);
      });
    });

    describe('#toggleKeyPanZoom()', function () {
      let wrapper;

      beforeEach(function () {
        wrapper = mount(<PanZoom enabled={true} />);
      });

      it('should change the this.state.keyPanZoomEnabled from true to false', function () {
        wrapper.setState({ keyPanZoomEnabled: true });
        wrapper.instance().toggleKeyPanZoom();

        assert.equal(wrapper.state('keyPanZoomEnabled'), false);
      });

      it('should change the this.state.keyPanZoomEnabled from false to true', function () {
        wrapper.setState({ keyPanZoomEnabled: false });
        wrapper.instance().toggleKeyPanZoom();

        assert.equal(wrapper.state('keyPanZoomEnabled'), true);
      });
    });

    describe('#panByDrag()', function () {
      let wrapper;
      const originalFrameDimensions = { width: 100, height: 100, x: 0, y: 0 };
      const zoomedViewBoxDimensions = { width: 50, height: 50, x: 25, y: 25 };

      beforeEach(function () {
        wrapper = mount(<PanZoom enabled={true} frameDimensions={originalFrameDimensions} />);
        wrapper.setState({ viewBoxDimensions: zoomedViewBoxDimensions, panEnabled: true });
      });

      it('should not change state.viewBoxDimensions, if state.panEnabled is false', function () {
        const event = { preventDefault() { return 'This is a mock'; } };
        const direction = 10;
        wrapper.setState({ panEnabled: false });
        wrapper.instance().panByDrag(event, direction);

        assert.equal(wrapper.state('viewBoxDimensions'), zoomedViewBoxDimensions);
      });
    });

    describe('#frameKeyPan()', function () {
      const originalFrameDimensions = { width: 100, height: 100, x: 0, y: 0 };
      const zoomedViewBoxDimensions = { width: 50, height: 50, x: 25, y: 25 };
      let panHorizontalSpy;
      let panVerticalSpy;
      let zoomSpy;
      let wrapper;

      beforeEach(function () {
        wrapper = mount(<PanZoom enabled={true} frameDimensions={originalFrameDimensions} />);
        panHorizontalSpy = sinon.spy(wrapper.instance(), 'panHorizontal');
        panVerticalSpy = sinon.spy(wrapper.instance(), 'panVertical');
        zoomSpy = sinon.spy(wrapper.instance(), 'zoom');
        wrapper.setState({ viewBoxDimensions: zoomedViewBoxDimensions, panEnabled: true });
      });

      it('should call #panHorizontal on keyPress 37', function () {
        const keyEvent = { which: 37, preventDefault() { return 'This is a mock'; } };
        wrapper.instance().frameKeyPan(keyEvent);

        sinon.assert.calledWith(panHorizontalSpy, -20);
      });

      it('should call #panVertical on keyPress 38', function () {
        const keyEvent = { which: 38, preventDefault() { return 'This is a mock'; } };
        wrapper.instance().frameKeyPan(keyEvent);

        sinon.assert.calledWith(panVerticalSpy, -20);
      });

      it('should call #panHorizontal on keyPress 39', function () {
        const keyEvent = { which: 39, preventDefault() { return 'This is a mock'; } };
        wrapper.instance().frameKeyPan(keyEvent);

        sinon.assert.calledWith(panHorizontalSpy, 20);
      });

      it('should call #panVerticalSpy on keyPress 40', function () {
        const keyEvent = { which: 40, preventDefault() { return 'This is a mock'; } };
        wrapper.instance().frameKeyPan(keyEvent);

        sinon.assert.calledWith(panVerticalSpy, 20);
      });

      it('should call #zoom on keyPress 187, set state.zooming to true', function () {
        const keyEvent = { which: 187, preventDefault() { return 'This is a mock'; } };
        wrapper.setState({ zooming: false });
        wrapper.instance().frameKeyPan(keyEvent);

        sinon.assert.calledWith(zoomSpy, 0.9);
        assert.equal(wrapper.state('zooming'), true);
      });

      it('should call #zoom on keyPress 61, set state.zooming to true', function () {
        const keyEvent = { which: 61, preventDefault() { return 'This is a mock'; } };
        wrapper.setState({ zooming: false });
        wrapper.instance().frameKeyPan(keyEvent);

        sinon.assert.calledWith(zoomSpy, 0.9);
        assert.equal(wrapper.state('zooming'), true);
      });

      it('should call #zoom on keyPress 189, set state.zooming to true', function () {
        const keyEvent = { which: 189, preventDefault() { return 'This is a mock'; } };
        wrapper.setState({ zooming: false });
        wrapper.instance().frameKeyPan(keyEvent);

        sinon.assert.calledWith(zoomSpy, 1.1);
        assert.equal(wrapper.state('zooming'), true);
      });

      it('should call #zoom on keyPress 173, set state.zooming to true', function () {
        const keyEvent = { which: 173, preventDefault() { return 'This is a mock'; } };
        wrapper.setState({ zooming: false });
        wrapper.instance().frameKeyPan(keyEvent);

        sinon.assert.calledWith(zoomSpy, 1.1);
        assert.equal(wrapper.state('zooming'), true);
      });
    });

    describe('#wheelZoom()', function () {
      const originalFrameDimensions = { width: 100, height: 100, x: 0, y: 0 };
      const zoomedViewBoxDimensions = { width: 50, height: 50, x: 25, y: 25 };
      let panHorizontalSpy;
      let panVerticalSpy;
      let zoomSpy;
      let wrapper;

      beforeEach(function () {
        wrapper = mount(<PanZoom enabled={true} frameDimensions={originalFrameDimensions} />);
        panHorizontalSpy = sinon.spy(wrapper.instance(), 'panHorizontal');
        panVerticalSpy = sinon.spy(wrapper.instance(), 'panVertical');
        zoomSpy = sinon.spy(wrapper.instance(), 'zoom');
        wrapper.setState({ viewBoxDimensions: zoomedViewBoxDimensions, panEnabled: true });
      });

      it('should call #zoom(1.1) on mousewheel event with deltaY > 0', function () {
        const mouseEvent = { deltaY: 4, preventDefault() { return 'This is a mock'; } };
        wrapper.setState({ zooming: false });
        wrapper.instance().wheelZoom(mouseEvent);

        sinon.assert.calledWith(zoomSpy, 1.1);
        assert.equal(wrapper.state('zooming'), true);
      });

      it('should call #zoom(0.9) on mousewheel event with deltaY < 0', function () {
        const mouseEvent = { deltaY: -4, preventDefault() { return 'This is a mock'; } };
        wrapper.setState({ zooming: false });
        wrapper.instance().wheelZoom(mouseEvent);

        sinon.assert.calledWith(zoomSpy, 0.9);
        assert.equal(wrapper.state('zooming'), true);
      });
    });

    describe('#panHorizontal()', function () {
      let originalFrameDimensions;
      let wrapper;

      beforeEach(function () {
        originalFrameDimensions = { width: 100, height: 100, x: 0, y: 0 };
        wrapper = mount(<PanZoom enabled={true} frameDimensions={originalFrameDimensions} />);
        wrapper.setState({ viewBoxDimensions: { width: 50, height: 50, x: 25, y: 25 }});
      });

      it('should change state.viewBoxDimensions.x value by the provided direction', function () {
        const direction = 20;
        const expectedX = wrapper.state('viewBoxDimensions').x + direction;
        wrapper.instance().panHorizontal(direction);

        assert.equal(wrapper.state('viewBoxDimensions').x, expectedX);
      });

      it('should not set state.viewBoxDimensions.x below the floor value', function () {
        const floor = wrapper.props().frameDimensions.width * 0.6;
        wrapper.instance().panHorizontal(-200);

        assert(wrapper.state('viewBoxDimensions').x, floor);
      });

      it('should not set state.viewBoxDimensions.x higher above the ceiling value', function () {
        const sixtyPercentOfFrameWidth = wrapper.props().frameDimensions.width * 0.6;
        const frameWidth = wrapper.props().frameDimensions.width;
        const viewBoxWidth = wrapper.state('viewBoxDimensions').width;
        const ceiling = (frameWidth - viewBoxWidth) + sixtyPercentOfFrameWidth;
        wrapper.instance().panHorizontal(200);

        assert(wrapper.state('viewBoxDimensions').x, ceiling);
      });
    });

    describe('#panVertical()', function () {
      let originalFrameDimensions;
      let wrapper;

      beforeEach(function () {
        originalFrameDimensions = { width: 100, height: 100, x: 0, y: 0 };
        wrapper = mount(<PanZoom enabled={true} frameDimensions={originalFrameDimensions} />);
        wrapper.setState({ viewBoxDimensions: { width: 50, height: 50, x: 25, y: 25 }});
      });

      it('should change state.viewBoxDimensions.y by the provided direction', function () {
        const direction = 20;
        const expectedY = wrapper.state('viewBoxDimensions').y + direction;
        wrapper.instance().panVertical(direction);

        assert.equal(wrapper.state('viewBoxDimensions').y, expectedY);
      });

      it('should not set state.viewBoxDimensions.y below the floor value', function () {
        const floor = -(originalFrameDimensions.height * 0.6);
        wrapper.instance().panVertical(-200);

        assert.equal(wrapper.state('viewBoxDimensions').y, floor);
      });

      it('should not set state.viewBoxDimensions.y above ceiling value', function () {
        const sixtyPercentOfFrameHeight = originalFrameDimensions.height * 0.6;
        const frameHeight = originalFrameDimensions.height;
        const viewBoxHeight = wrapper.state('viewBoxDimensions').height;
        const ceiling = (frameHeight - viewBoxHeight) + sixtyPercentOfFrameHeight;
        wrapper.instance().panVertical(200);

        assert.equal(wrapper.state('viewBoxDimensions').y, ceiling);
      });
    });

    describe('#rotateClockwise()', function () {
      let originalFrameDimensions;
      let wrapper;

      beforeEach(function () {
        originalFrameDimensions = { width: 100, height: 100, x: 0, y: 0 };
        wrapper = mount(<PanZoom enabled={true} frameDimensions={originalFrameDimensions} />);
      });

      it('should add 90 to this.state.rotation', function () {
        wrapper.instance().rotateClockwise();

        assert.equal(wrapper.state('rotation'), 90);
      });

      it('should create a new transformation statement with the updated rotation', function () {
        wrapper.instance().rotateClockwise();
        const updatedTransformation = `rotate(90 ${wrapper.props().frameDimensions.width / 2} ${wrapper.props().frameDimensions.height / 2})`;

        assert.equal(wrapper.state('transform'), updatedTransformation);
      });
    });
  });
});
