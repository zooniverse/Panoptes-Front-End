import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import GenericTask from './generic';

const task = {
  question: 'Is there something here?',
  answers: [<p>yes</p>, <p>no</p>]
};

const annotation = {
  value: 1
};

function runCommonTests(wrapper) {
  const question = wrapper.find('.question');
  const answers = wrapper.find('.answer');
  return {question, answers}
};

describe('GenericTask', function () {

  const wrapper = mount(<GenericTask question={task.question} answers={task.answers} />);
  const {question, answers} = runCommonTests(wrapper);
  
  it('should have a question and answers', function(){
    assert.equal(question.length, 1);
    assert.equal(answers.length, task.answers.length);
  });

  it('should not be required', function() {
    assert.equal(wrapper.find('.required-task-warning').length, 0);
  });

  it('should not show a help button', function() {
    assert.equal(wrapper.contains(<button type="button" className="minor-button" onClick={wrapper.instance().showHelp}>Need some help with this task?</button>), false)
  });

});

describe('GenericTask: required', function(){
  const wrapper= mount(<GenericTask question={task.question} answers={task.answers} required={true} />);
  const {question, answers} = runCommonTests(wrapper);
  
  it('should have a question and answers', function(){
    assert.equal(question.length, 1);
    assert.equal(answers.length, task.answers.length);
  });

  it('should be required', function() {
    assert.equal(wrapper.find('.required-task-warning').length, 1);
  });

  it('should not show a help button', function() {
    assert.equal(wrapper.contains(<button type="button" className="minor-button" onClick={wrapper.instance().showHelp}>Need some help with this task?</button>), false)
  });
});

describe('GenericTask: with help', function(){
  const wrapper= mount(<GenericTask question={task.question} answers={task.answers} help="This is some help text." />);
  const {question, answers} = runCommonTests(wrapper);
  
  it('should have a question and answers', function(){
    assert.equal(question.length, 1);
    assert.equal(answers.length, task.answers.length);
  });

  it('should not be required', function() {
    assert.equal(wrapper.find('.required-task-warning').length, 0);
  });

  it('should show a help button', function() {
    assert.equal(wrapper.contains(<button type="button" className="minor-button" onClick={wrapper.instance().showHelp}>Need some help with this task?</button>), true)
  });
});
