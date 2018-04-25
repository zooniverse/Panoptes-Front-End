/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import TaskArea from './TaskArea';

describe('TaskArea', function() {
  it('should render without crashing', function() {
    const wrapper = mount(<TaskArea />);
    expect(wrapper).to.be.ok;
  });
});
