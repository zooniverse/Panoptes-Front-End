/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import DrawingToolInputIcon, { StyledDrawingToolInputIcon } from './DrawingToolInputIcon';

describe('DrawingToolInputIcon', function() {
  it('should render without crashing', function() {
    const wrapper = mount(<DrawingToolInputIcon />);
    expect(wrapper).to.be.ok;
  });

  it('should render a StyledDrawingToolInputIcon component', function() {
    const wrapper = mount(<DrawingToolInputIcon />);
    expect(wrapper.find(StyledDrawingToolInputIcon)).to.have.lengthOf(1);
  });
});
