import { shallow, mount } from 'enzyme';
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
  it('should render for a workflow and task', () => {
    const wrapper = shallow(<ComboEditor workflow={workflow} task={task} />);
    assert.equal(wrapper.instance() instanceof ComboEditor, true);
  });
});

describe('deleting a workflow task', () => {
  const workflowCopy = Object.assign({}, workflow);
  const tasks = Object.assign({}, workflow.tasks);
  delete tasks.ask;
  workflowCopy.tasks = tasks;
  it('should render and update the combo task', () => {
    const wrapper = mount(<ComboEditor workflow={workflowCopy} task={task} />);
    const { props } = wrapper.instance();
    assert.equal(props.task.tasks.indexOf('ask'), -1);
  });
});
