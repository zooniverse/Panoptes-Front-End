import { mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import ComboEditor from './editor';
import { workflow } from '../../../pages/dev-classifier/mock-data';

const task = {
  type: 'combo',
  loosen_requirements: true,
  tasks: ['write', 'ask', 'features', 'draw', 'survey', 'slider']
};

describe('ComboEditor', function () {
  const wrapper = mount(<ComboEditor workflow={workflow} task={task} />);

  it('should render for a workflow and task', function () {
    assert.equal(wrapper.instance() instanceof ComboEditor, true);
  });

  it('should add new tasks to the combo when selected', function () {
    wrapper.find('select[value="stuck"]').simulate('change', { target: { value: 'dropdown' }});
    const { props } = wrapper.instance();
    assert.notEqual(props.task.tasks.indexOf('dropdown'), -1);
  });

  it('should allow tasks to be deleted from the combo', function () {
    wrapper.find('ul.drag-reorderable button').first().simulate('click');
    const { props } = wrapper.instance();
    assert.equal(props.task.tasks.indexOf('write'), -1);
  });
});

describe('deleting a workflow task', function () {
  const workflowCopy = Object.assign({}, workflow);
  const tasks = Object.assign({}, workflow.tasks);
  delete tasks.ask;
  workflowCopy.tasks = tasks;
  it('should render and update the combo task', function () {
    const wrapper = mount(<ComboEditor workflow={workflowCopy} task={task} />);
    const { props } = wrapper.instance();
    assert.equal(props.task.tasks.indexOf('ask'), -1);
  });
});
