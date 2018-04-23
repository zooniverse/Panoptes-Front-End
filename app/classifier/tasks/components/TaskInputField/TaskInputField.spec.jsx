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
import { TaskInputField, StyledTaskInputField } from './TaskInputField';
import { mockReduxStore, radioTypeAnnotation } from '../../testHelpers';

describe('TaskInputField', function() {
  let wrapper;
  before(function() {
    wrapper = mount(<TaskInputField annotation={radioTypeAnnotation} index={0} type="radio" />, mockReduxStore);
  });

  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  });

  it('should renders a ThemeProvider', function() {
    expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
  });

  it('should render a StyledTaskInputField', function () {
    expect(wrapper.find(StyledTaskInputField)).to.have.lengthOf(1);
  });

  it('should render a TaskInputLabel', function() {
    expect(wrapper.find('TaskInputLabel')).to.have.lengthOf(1);
  });

  it('should use props.className in its classlist', function() {
    wrapper.setProps({ className: 'active' });
    expect(wrapper.props().className).to.include('active');
  });
});
