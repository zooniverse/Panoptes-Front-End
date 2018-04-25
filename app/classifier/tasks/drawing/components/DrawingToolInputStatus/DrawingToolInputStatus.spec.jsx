/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import DrawingToolInputStatus, { StyledDrawingToolInputStatus } from './DrawingToolInputStatus';

describe('DrawingToolInputStatus', function () {
  it('should render without crashing', function () {
    const wrapper = mount(<DrawingToolInputStatus />);
    expect(wrapper).to.be.ok;
  });

  it('should render a StyledDrawingToolInputStatus component', function() {
    const wrapper = mount(<DrawingToolInputStatus />);
    expect(wrapper.find(StyledDrawingToolInputStatus)).to.have.lengthOf(1);
  });

  it('should not render any requirements if props.tool.min or props.tool.max is not defined', function() {
    const wrapper = mount(<DrawingToolInputStatus />);
    expect(wrapper.find('span')).to.have.lengthOf(0);
  });

  it('should render minimum drawing requirements if props.tool.min is defined', function() {
    const wrapper = mount(<DrawingToolInputStatus tool={{ min: 1 }} />);
    expect(wrapper.find('span')).to.have.lengthOf(1);
    expect(wrapper.text()).to.equal('0 of 1 required drawn');
  });

  it('should render maxmimum drawing requirements if props.tool.max is defined', function () {
    const wrapper = mount(<DrawingToolInputStatus tool={{ max: 2 }} />);
    expect(wrapper.find('span')).to.have.lengthOf(1);
    expect(wrapper.text()).to.equal('0 of 2 maximum drawn');
  });

  it('should render minimum and maxmimum drawing requirements if props.tool.min and props.tool.max are defined', function () {
    const wrapper = mount(<DrawingToolInputStatus tool={{ min: 1, max: 2 }} />);
    expect(wrapper.find('span')).to.have.lengthOf(2);
    expect(wrapper.text()).to.equal('0 of 1 required, 2 maximum drawn');
  });
});
