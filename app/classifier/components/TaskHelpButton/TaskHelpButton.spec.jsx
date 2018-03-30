/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import TaskHelpButton, { StyledTaskHelpButton } from './TaskHelpButton';

describe('TaskHelpButton', function() {
  let wrapper;
  const onClickSpy = sinon.spy();
  before(function() {
    wrapper = mount(<TaskHelpButton onClick={onClickSpy} />);
  });

  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  });

  it('should render a StyledTaskHelpButton', function() {
    expect(wrapper.find(StyledTaskHelpButton)).to.have.lengthOf(1);
  });

  it('should render a ThemeProvider', function() {
    expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
  });

  it('should render a Translate component', function() {
    expect(wrapper.find('Translate')).to.have.lengthOf(1);
  });

  it('should call props.onClick for the onClick event', function() {
    wrapper.find('button').simulate('click');
    expect(onClickSpy.calledOnce).to.be.true;
  });
});
