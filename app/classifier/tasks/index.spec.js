import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import tasks from './';
import { workflow } from '../../pages/dev-classifier/mock-data';

for (const key in workflow.tasks) {
  const task = workflow.tasks[key];
  const TaskComponent = tasks[task.type];
  describe('Task ' + task.type, function() {
    let wrapper;

    it('should render with default props', function() {
      wrapper = shallow(<TaskComponent />);
    });

    it('should update on annotation change', function() {
      wrapper = shallow(<TaskComponent />);
      let annotation = TaskComponent.getDefaultAnnotation(task, workflow, tasks);
      wrapper.setProps({annotation});
    });
  });
}
