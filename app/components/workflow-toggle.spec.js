import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import WorkflowToggle from './workflow-toggle';

const project = {
  display_name: 'test'
};

const workflow = {
  display_name: 'test'
};

describe('WorkflowToggle', () => {
  let wrapper;
  let handleToggleActiveStub;

  before(() => {
    handleToggleActiveStub = sinon.stub(WorkflowToggle.prototype, 'handleToggleActive');
    wrapper = shallow(<WorkflowToggle project={project} workflow={workflow} field="active" />);
    handleToggleActiveStub.restore();
  });

  it('renders without crashing', () => {
    const workflowToggleContainer = wrapper.find('span');
    assert.equal(workflowToggleContainer.length, 1);
  });

  it('renders a checkbox input', () => {
    assert.equal(wrapper.find('input[type="checkbox"]').length, 1);
  });

  it('calls this.handleToggleActive() when checkbox is clicked', () => {
    const toggleActiveInput = wrapper.find('input');
    toggleActiveInput.simulate('change', { target: { checked: false }});
    sinon.assert.calledOnce(handleToggleActiveStub);
  });
});
