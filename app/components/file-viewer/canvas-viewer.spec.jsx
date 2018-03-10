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
  frame: 0,
  onBlur: () => null,
  onFocus: () => null,
  overlayStyle: {},
  src: '',
  style: {},
  subject,
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
});
describe('CanvasViewer with TestModel', function () {
  let wrapper;
  before(function (done) {
    wrapper = mount(<CanvasViewer {...canvasViewerProps} />);
    // slight delay before running the tests
    setTimeout(
      () => { wrapper.update(); done(); },
      100
    );
  });
  it('should correctly size the canvas', function () {
    const canvas = wrapper.find('canvas').instance();
    assert.equal(canvas.width, 100);
    assert.equal(canvas.height, 100);
  });
  it('should tell the canvas when done loading', function () {
    assert.equal(wrapper.find('.loading-cover').length, 0);
  });
});
