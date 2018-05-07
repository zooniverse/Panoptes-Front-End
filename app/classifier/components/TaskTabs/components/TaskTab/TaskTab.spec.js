/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TaskTab } from './TaskTab';

describe('TaskTab', function() {
  it('should render without crashing', function() {
    const wrapper = shallow(<TaskTab />);
    expect(wrapper).to.be.ok;
  });
});
