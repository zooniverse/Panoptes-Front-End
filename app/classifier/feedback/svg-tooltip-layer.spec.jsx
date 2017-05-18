// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach, before */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { SVGToolTipLayer, __RewireAPI__ as RewireAPI } from './svg-tooltip-layer';

class Tooltip extends React.Component {
  render() {
    <div />
  }
}

RewireAPI.__Rewire__('Tooltip', Tooltip);

const FEEDBACK = [
  { x: '10', y: '10' },
  { x: '20', y: '20' }
];

describe('<SVGToolTipLayer />', function() {
  it('should return null if not passed any feedback', function () {
    const wrapper = shallow(<SVGToolTipLayer feedback={[]} />);
    assert.strictEqual(wrapper.type(), null);
  });

  it('should return the correct element and class', function () {
    const wrapper = shallow(<SVGToolTipLayer feedback={FEEDBACK} />);
    assert.strictEqual(wrapper.type(), 'div');
    assert(wrapper.hasClass('classifier-tooltips'));
  });

  it('should return a Tooltip for each feedback item', function () {
    const wrapper = shallow(<SVGToolTipLayer feedback={FEEDBACK} />);
    assert.strictEqual(wrapper.find('Tooltip').length, 2);
  });
});
