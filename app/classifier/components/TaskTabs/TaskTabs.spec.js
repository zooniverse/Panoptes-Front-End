/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { expect } from 'chai';
import TaskTabs, { TabsWrapper } from './TaskTabs';
import TutorialTab from './components/TutorialTab';
import TaskTab from './components/TaskTab';

const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({ userInterface: { theme: 'light' } })
};

const mockReduxStore = {
  context: { store },
  childContextTypes: { store: PropTypes.object.isRequired }
};

describe('TaskTabs', function() {
  let wrapper;
  before(function() {
    wrapper = mount(<TaskTabs />, mockReduxStore);
  });

  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  });

  it('should render a TabsWrapper', function() {
    expect(wrapper.find(TabsWrapper)).to.have.lengthOf(1);
  });

  it('should render a TaskTab component', function() {
    expect(wrapper.find(TaskTab)).to.have.lengthOf(1);
  });

  it('should render a TutorialTab', function() {
    expect(wrapper.find(TutorialTab)).to.have.lengthOf(1);
  });
});
