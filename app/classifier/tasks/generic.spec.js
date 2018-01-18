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
  return { question, answers };
}

describe('GenericTask', () => {
  const wrapper = mount(<GenericTask question={task.question} answers={task.answers} />);
  const { question, answers } = runCommonTests(wrapper);

  it('should have a question and answers', () => {
    assert.equal(question.hostNodes().length, 1);
    assert.equal(answers.length, task.answers.length);
  });

  it('should not be required', () => {
    assert.equal(wrapper.find('.required-task-warning').length, 0);
  });

  it('should not show a help button', () => {
    assert.equal(wrapper.contains(<button type="button" className="minor-button" onClick={wrapper.instance().showHelp}>Need some help with this task?</button>), false);
  });
});

describe('GenericTask: required', () => {
  const wrapper = mount(<GenericTask question={task.question} answers={task.answers} required={true} />);
  const { question, answers } = runCommonTests(wrapper);

  it('should have a question and answers', () => {
    assert.equal(question.hostNodes().length, 1);
    assert.equal(answers.length, task.answers.length);
  });

  it('should be required', () => {
    assert.equal(wrapper.find('.required-task-warning').length, 1);
  });

  it('should not show a help button', () => {
    assert.equal(wrapper.contains(<button type="button" className="minor-button" onClick={wrapper.instance().showHelp}>Need some help with this task?</button>), false);
  });
});

describe('GenericTask: with help', () => {
  const wrapper = mount(<GenericTask question={task.question} answers={task.answers} help="This is some help text." />);
  const { question, answers } = runCommonTests(wrapper);

  it('should have a question and answers', () => {
    assert.equal(question.hostNodes().length, 1);
    assert.equal(answers.length, task.answers.length);
  });

  it('should not be required', () => {
    assert.equal(wrapper.find('.required-task-warning').length, 0);
  });

  it('should show a help button', () => {
    assert.equal(wrapper.contains(<button type="button" className="minor-button" onClick={wrapper.instance().showHelp}>Need some help with this task?</button>), true);
  });
});
