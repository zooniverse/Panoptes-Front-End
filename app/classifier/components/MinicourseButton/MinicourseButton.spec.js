/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MinicourseButton, StyledRestartButton } from './MinicourseButton';

describe('MinicourseButton', function() {
  let wrapper;
  before(function() {
    wrapper = mount(<MinicourseButton />);
  });

  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  });

  it('should render a VisibilitySplit component', function() {
    expect(wrapper.find('VisibilitySplit')).to.have.lengthOf(1);
  });

  it('should render a ThemeProvider component', function() {
    expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
  });

  it('should render a StyledRestartButton component', function() {
    expect(wrapper.find(StyledRestartButton)).to.have.lengthOf(1);
  });

  it('should render a Translate component', function() {
    expect(wrapper.find('Translate')).to.have.lengthOf(1);
  });
});
