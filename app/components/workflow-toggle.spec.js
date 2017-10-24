import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import WorkflowToggle from './workflow-toggle';

const workflow = {
  display_name: 'test workflow',
  id: '1'
};

describe('WorkflowToggle', () => {
  let wrapper;
  let handleToggleSpy;

  before(() => {
    handleToggleSpy = sinon.spy();
    wrapper = shallow(<WorkflowToggle workflow={workflow} handleToggle={handleToggleSpy} />);
  });

  it('renders without crashing', () => {
    const workflowToggleContainer = wrapper.find('span');
    assert.equal(workflowToggleContainer.length, 1);
  });

  it('renders a checkbox input', () => {
    assert.equal(wrapper.find('input[type="checkbox"]').length, 1);
  });

  it('calls the handleToggle handler', () => {
    wrapper.find('input').simulate('change');
    sinon.assert.calledOnce(handleToggleSpy);
  });

  it('renders workflow prop text correctly', () => {
    const spanText = wrapper.find('span').text();
    assert.ok(spanText.match('1 - test workflow'), true);
  });

  it('renders a label for the input via Translate', () => {
    assert.equal(wrapper.find('Translate').prop('content'), 'workflowToggle.label');
  });
});
