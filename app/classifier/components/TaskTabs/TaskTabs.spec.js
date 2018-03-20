/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import TaskTabs, { TabsWrapper, QuestionTab } from './TaskTabs';
import TutorialTab from './components/TutorialTab';

describe('TaskTabs', function() {
  let wrapper;
  before(function() {
    wrapper = mount(<TaskTabs />);
  });

  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  });

  it('should render a TabsWrapper', function() {
    expect(wrapper.find(TabsWrapper)).to.have.lengthOf(1);
  });

  it('should render a QuestionTab component', function() {
    expect(wrapper.find(QuestionTab)).to.have.lengthOf(1);
  });

  it('should render a Translate component', function() {
    expect(wrapper.find('Translate')).to.have.lengthOf(1);
  });

  it('should render a TutorialTab', function() {
    expect(wrapper.find(TutorialTab)).to.have.lengthOf(1);
  });
});
