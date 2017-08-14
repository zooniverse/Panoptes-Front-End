/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ['error', { 'devDependencies': true }]
  no-underscore-dangle: 0,
  prefer-arrow-callback: 0,
  'react/jsx-boolean-value': ['error', 'always']
*/

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

describe('<FeedbackPoint />', function () {
  it('should return a <circle /> element', function () {
    const wrapper = shallow(<FeedbackPoint point={POINT} />);
    assert.strictEqual(wrapper.type(), 'circle', 'Didn\'t return a <circle /> element');
  });

  it('should have the correct attributes', function () {
    const wrapper = shallow(<FeedbackPoint point={POINT} />);
    assert.strictEqual(wrapper.prop('cx'), POINT.x, 'X prop not correctly set');
    assert.strictEqual(wrapper.prop('cy'), POINT.y, 'Y prop not correctly set');
    assert.strictEqual(wrapper.prop('r'), POINT.tol, 'Radius prop not correctly set');
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
