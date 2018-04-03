/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import TaskHelpButton, { StyledTaskHelpButton } from './TaskHelpButton';
import { mockReduxStore } from '../../testHelpers';

describe('TaskHelpButton', function() {
  const onClickSpy = sinon.spy();
  it('should render without crashing', function() {
    const wrapper = mount(<TaskHelpButton />, mockReduxStore);
    expect(wrapper).to.be.ok;
  });

  it('should render a StyledTaskHelpButton', function() {
    const wrapper = mount(<TaskHelpButton />, mockReduxStore);
    expect(wrapper.find(StyledTaskHelpButton)).to.have.lengthOf(1);
  });

  it('should render a Translate component', function() {
    const wrapper = mount(<TaskHelpButton />, mockReduxStore);
    expect(wrapper.find('Translate')).to.have.lengthOf(1);
  });

  it('should call props.onClick when button is clicked', function() {
    const wrapper = mount(<TaskHelpButton onClick={onClickSpy} />, mockReduxStore);
    wrapper.find('button').simulate('click');
    expect(onClickSpy.calledOnce).to.be.true;
  });
});
