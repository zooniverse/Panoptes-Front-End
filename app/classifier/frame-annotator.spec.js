// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import FrameAnnotator from './frame-annotator';
import SVGImage from '../components/svg-image';
import { classification, workflow, subject, preferences } from '../pages/dev-classifier/mock-data';

const annotation = {
  task: 'init'
};

const viewBoxDimensions = {
  height: 0,
  width: 0,
  x: 0,
  y: 0
};

const naturalHeight = 0;
const naturalWidth = 0;

describe('FrameAnnotator', function() {
  let wrapper;
  beforeEach(function() {
    wrapper = shallow(
      <FrameAnnotator
        annotation={annotation}
        classification={classification}
        loading={false}
        naturalHeight={naturalHeight}
        naturalWidth={naturalWidth}
        subject={subject}
        viewBoxDimensions={viewBoxDimensions}
        workflow={workflow}
      />);
  });

  it('should render without crashing', function() {
    return wrapper;
  });

  describe('if subject type is an image', function() {
    it('renders the <SVGImage /> if subject type is an image', function() {
      assert.equal(wrapper.find(SVGImage).length, 1);
    });
  })
});
