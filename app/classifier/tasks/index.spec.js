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

    describe('task description', function () {
      it('should be an object', function () {
        expect(task).to.be.an('object');
      });
    });

    describe('annotations', function () {
      it('should be objects', function () {
        expect(annotation).to.be.an('object');
      });
      it('should have a value', function () {
        expect(annotation).to.have.property('value');
      });
    });
  });
});

