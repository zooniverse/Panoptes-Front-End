// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */
import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import CanvasViewer from './canvas-viewer';

const annotation = {};
const annotations = [annotation];
const subject = {
  locations: [
    { 'application/json': '' }
  ],
  metadata: {
    '#isModelling': true,
    '#models': [{ frame: 0, model: 'TEST_MODEL' }]
  }
};

const canvasViewerProps = {
  annotation,
  annotations,
  subject,
  frame: 0,
  overlayStyle: {},
  src: '',
  style: {},
  viewBoxDimensions: {
    height: 512, width: 512, x: 0, y: 0
  }
};

describe('CanvasViewer', function () {
  let wrapper;
  before(function () {
    wrapper = mount(<CanvasViewer {...canvasViewerProps} />);
  });

  it('should render one canvas', function () {
    assert.equal(wrapper.find('canvas').length, 1);
  });
  it('should start off loading', function () {
    assert.equal(wrapper.find('.loading-cover').length, 1);
  });
  describe('#resizeCanvas({ width, height })', function () {
    it('should correctly size the canvas', function () {
      const canvas = wrapper.find('canvas').instance();
      wrapper.instance().resizeCanvas({ width: 100, height: 100 });
      wrapper.update();
      assert.equal(canvas.width, 100);
      assert.equal(canvas.height, 100);
    });
  });
  describe('#changeCanvasStyleSize({ width, height })', function () {
    it('should correctly change the canvas style width and height', function () {
      const canvas = wrapper.find('canvas').instance();
      wrapper.instance().changeCanvasStyleSize({ width: '300px', height: '300px' });
      console.log(wrapper.instance().state);
      wrapper.update();
      assert.equal(canvas.style.width, '300px');
      assert.equal(canvas.style.height, '300px');
    });
  });
  describe('#onLoad()', function () {
    it('should remove loading indicator', function () {
      wrapper.instance().onLoad();
      wrapper.update();
      assert.equal(wrapper.find('.loading-cover').length, 0);
    });
  });
  describe('#setScore(setScore)', function () {
    before(function () {
      wrapper.instance().setScore(100);
      wrapper.update();
    });
    it('Should trigger the display of a score text', function () {
      assert.equal(wrapper.find('.canvas-renderer-score').length, 1);
    });
    it('should set the score to the correct value', function () {
      assert.equal(wrapper.instance().state.score, 100);
    });
  });
});
