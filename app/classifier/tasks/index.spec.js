import { shallow } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import taskComponents from './';

const tasks = Object.keys(taskComponents);

tasks.forEach(function (taskType) {
  const TaskComponent = taskComponents[taskType];
  const task = TaskComponent.getDefaultTask();
  const workflow = {};
  const annotation = TaskComponent.getDefaultAnnotation(task, workflow, taskComponents);
  describe(`Task ${taskType}`, function () {
    let wrapper;

    before(function () {
      wrapper = shallow(<TaskComponent translation={task} />);
    });

    it('should render with default props', function () {
      expect(wrapper).to.be.ok;
    });

    it('should render with an annotation', function () {
      wrapper.setProps({ annotation });
      expect(wrapper).to.be.ok;
    });
  });
});

