// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import RestartButton from './restart-button';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

describe('RestartButton', function() {
  it('should render without crashing', function() {
    shallow(<RestartButton shouldRender={true} />);
  });

  it('should render child nodes', function() {
    const wrapper = shallow(<RestartButton shouldRender={true}><span>button</span></RestartButton>);
    assert.equal(wrapper.children('span').length, 1);
  });

  it('should should call onClick handler', function() {
    const onStart = sinon.spy();
    const wrapper = mount(<RestartButton shouldRender={true} start={onStart} />);
    wrapper.find('button').simulate('click');
    assert.equal(onStart.calledOnce, true);
  });

  it('should not render if shouldRender is false', function() {
    const wrapper = shallow(<RestartButton shouldRender={false} />);
    assert.equal(wrapper.find('button').length, 0);
  });
});