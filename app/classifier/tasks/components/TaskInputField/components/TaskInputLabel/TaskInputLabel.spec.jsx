/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import TaskInputLabel, { StyledTaskInputLabel } from './TaskInputLabel';

describe('TaskInputLabel', function() {
  it('should render without crashing', function() {
    const wrapper = mount(<TaskInputLabel />);
    expect(wrapper).to.be.ok;
  });

  it('should render a StyledTaskInputLabel', function() {
    const wrapper = mount(<TaskInputLabel />);
    expect(wrapper.find(StyledTaskInputLabel)).to.have.lengthOf(1);
  });

  it('should use props.label as the innerHTML text', function() {
    const label = 'test label';
    const wrapper = mount(<TaskInputLabel label={label} />);
    // \n added by markdown
    expect(wrapper.text()).to.equal(`${label}\n`);
  });
});