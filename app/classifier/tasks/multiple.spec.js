import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import MultipleTask from './multiple';

const task = {
  question: 'Is there something here?',
  answers: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
    { label: 'Maybe', value: 'maybe' }
  ],
  required: 3
};

const annotation = {
  value: [0, 1]
};

describe('MultipleChoiceTask', function () {
  let wrapper;

  beforeEach(function () {
    wrapper = mount(<MultipleTask task={task} annotation={annotation} />);
  });

  it('should render without crashing', function () {
  });

  it('should have a question', function () {
    const question = wrapper.find('.question');
    assert.equal(question.length, 1);
  });

  it('should have answers', function () {
    const answers = wrapper.find('.answer');
    assert.equal(answers.length, task.answers.length);
  });

  it('should have the supplied annotation checked', function(){
    assert.equal(wrapper.find('input[type="checkbox"]').find({checked: true}).length, 2);
  });

  it('other answers should not be checked', function(){
    assert.equal(wrapper.find('input[type="checkbox"]').find({checked: false}).length, 1);
  });

  describe('static methods', function(){
    it('should be incomplete', function(){
      assert.equal(MultipleTask.isAnnotationComplete(task, annotation), false);
    });

    it('should be complete', function(){
      assert.equal(MultipleTask.isAnnotationComplete(task, { value: [0, 1, 2] }), true);
    });

    it('should be complete when not required', function(){
      assert.equal(MultipleTask.isAnnotationComplete(Object.assign({}, task, { required: undefined }), { value: [] }), true);
    });

    it('should have the correct question text', function(){
      assert.equal(MultipleTask.getTaskText(task), task.question);
    });

    it('the default annotation should be an empty array', function(){
      assert.equal(MultipleTask.getDefaultAnnotation().value.length, 0);
    });
  });

});
