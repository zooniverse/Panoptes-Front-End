import { shallow } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import taskComponents from '.';

const tasks = Object.keys(taskComponents);
const tasksWithoutTranscription = tasks.filter(taskType => taskType !== 'transcription');

tasksWithoutTranscription.forEach((taskType) => {
  const TaskComponent = taskComponents[taskType];
  const task = TaskComponent.getDefaultTask();
  const workflow = {};
  const annotation = TaskComponent.getDefaultAnnotation(task, workflow, taskComponents);
  describe(`Task ${taskType}`, () => {
    let wrapper;

    before(() => {
      wrapper = shallow(<TaskComponent translation={task} />);
    });

    it('should render with default props', () => {
      expect(wrapper).to.be.ok;
    });

    it('should render with an annotation', () => {
      wrapper.setProps({ annotation });
      expect(wrapper).to.be.ok;
    });

    describe('task description', () => {
      it('should be an object', () => {
        expect(task).to.be.an('object');
      });
    });

    describe('annotations', () => {
      it('should be objects', () => {
        expect(annotation).to.be.an('object');
      });
      it('should have a value', () => {
        expect(annotation).to.have.property('value');
      });
    });
  });
});
