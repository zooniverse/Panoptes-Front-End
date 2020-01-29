/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import WorkflowsHidden from './WorkflowsHidden';
import ToggleButton from './components/ToggleButton';
import ActionText from './components/ActionText';

describe('Workflows Hidden', function () {
  let wrapper;
  before(function () {
    wrapper = shallow(<WorkflowsHidden toggleWorkflows={() => {}} />);
  });

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok;
  });

  it('should render a ToggleButton', function () {
    expect(wrapper.find(ToggleButton)).to.have.lengthOf(1);
    expect(wrapper.find(ToggleButton).prop('label')).to.equal('expand workflow list');
  });

  it('should render ActionText with organization.stats.expandWorkflowStats content', function () {
    expect(wrapper.find(ActionText)).to.have.lengthOf(1);
    expect(wrapper.find(ActionText).prop('content')).to.equal('organization.stats.expandWorkflowStats');
  });
});
