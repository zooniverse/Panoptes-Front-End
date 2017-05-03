// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach, before */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import FeedbackPoint from './feedback-point';

const POINT = {
  x: '10',
  y: '20',
  tol: '30',
  success: true
};

describe('<FeedbackPoint />', function() {
  it('should return a circle element', function () {
    const wrapper = shallow(<FeedbackPoint point={POINT} />);
    assert(wrapper.type() === 'circle');
  });

  it('should have the correct attributes', function () {
    const wrapper = shallow(<FeedbackPoint point={POINT} />);
    assert(wrapper.prop('cx') === POINT.x);
    assert(wrapper.prop('cy') === POINT.y);
    assert(wrapper.prop('r') === POINT.tol);
  });

  it('should have the correct element class', function () {
    const wrapper = shallow(<FeedbackPoint point={POINT} />);
    assert(wrapper.hasClass('feedback-points__point'));
  });

  it('should have the correct modifier class if successful', function () {
    const wrapper = shallow(<FeedbackPoint point={POINT} />);
    assert(wrapper.hasClass('feedback-points__point--success'));
  });

  it('should have the correct modifier class if unsuccessful', function () {
    const failurePoint = Object.assign({}, POINT, { success: false });
    const wrapper = shallow(<FeedbackPoint point={failurePoint} />);
    assert(wrapper.hasClass('feedback-points__point--failure'));
  });
});
