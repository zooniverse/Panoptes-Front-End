import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import WorkflowToggle from './workflow-toggle';

const workflow = {
  display_name: 'test'
};

describe('WorkflowToggle', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<WorkflowToggle workflow={workflow} />);
  });

  it('renders without crashing', () => {
    const workflowToggleContainer = wrapper.find('span');
    assert.equal(workflowToggleContainer.length, 1);
  });

  it('renders a checkbox input', () => {
    assert.equal(wrapper.find('input[type="checkbox"]').length, 1);
  });
});
