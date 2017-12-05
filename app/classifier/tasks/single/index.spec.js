/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import SingleTask from './';

const task = {
  question: 'Is there something here?',
  answers: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ],
  required: true
};

const annotation = {
  value: 1
};

describe('SingleChoiceTask', function () {
  let wrapper;

  beforeEach(function () {
    wrapper = mount(<SingleTask task={task} annotation={annotation} translation={task} />);
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

  it('should have the supplied annotation checked', function () {
    assert.equal(wrapper.find('input[type="radio"]').find({ checked: true, value: 1 }).length, 1);
  });

  it('other answers should not be checked', function () {
    assert.equal(wrapper.find('input[type="radio"]').find({ checked: false, value: 0 }).length, 1);
  });

  describe('static methods', function () {
    it('should be complete', function () {
      assert.equal(SingleTask.isAnnotationComplete(task, annotation), true);
    });

    it('should be complete when value is 0 (i.e. falsy)', function () {
      assert.equal(SingleTask.isAnnotationComplete(task, { value: 0 }), true);
    });

    it('should not be complete when value is null', function () {
      assert.equal(SingleTask.isAnnotationComplete(task, { value: null }), false);
    });

    it('should be complete when task is not required', function () {
      assert.equal(SingleTask.isAnnotationComplete(Object.assign({}, task, { required: false }), { value: null }), true);
    });

    it('should have the correct question text', function () {
      assert.equal(SingleTask.getTaskText(task), task.question);
    });

    it('the default annotation should be null', function () {
      assert.equal(SingleTask.getDefaultAnnotation().value, null);
    });
  });
});

describe('SingleChoiceSummary', function () {
  let summary;

  beforeEach(function () {
    summary = mount(<SingleTask.Summary task={task} annotation={annotation} translation={task} />);
  });

  it('should render without crashing', function () {
  });

  it('should have a question', function () {
    const question = summary.find('.question');
    assert.equal(question.length, 1);
  });

  it('the default expanded state should be false', function () {
    assert.equal(summary.state().expanded, false);
  });

  it('should have one answer when collapsed', function () {
    const answers = summary.find('.answer');
    assert.equal(answers.length, 1);
  });

  it('should have the correct answer label when the value if falsy (i.e. 0)', function () {
    summary = mount(<SingleTask.Summary task={task} annotation={{ value: 0 }} translation={task} />);
    const answers = summary.find('.answer');
    assert.notEqual(answers.text(), 'No answer');
  });

  it('should return "No answer" when annotation is null', function () {
    summary = mount(<SingleTask.Summary task={task} annotation={{ value: null }} translation={task} />);
    const answers = summary.find('.answer');
    assert.equal(answers.text(), 'No answer');
  });

  it('button should read "More" when not expanded', function () {
    const button = summary.find('button');
    assert.equal(button.text(), 'More');
  });

  describe('when summary is expanded', function () {
    beforeEach(function () {
      summary.find('button').simulate('click');
    });

    it('should set expanded to true in state', function () {
      assert.equal(summary.state().expanded, true);
    });

    it('should show all answers', function () {
      const answers = summary.find('.answer');
      assert.equal(answers.length, task.answers.length);
    });

    it('should have one answer selected', function () {
      const checks = summary.find('.fa-check-circle-o');
      assert.equal(checks.length, 1);
    });

    it('should have the correct number of non-selected answers', function () {
      const unchecks = summary.find('.fa-circle-o');
      assert.equal(unchecks.length, task.answers.length - 1);
    });

    it('button should read "Less"', function () {
      const button = summary.find('button');
      assert.equal(button.text(), 'Less');
    });

    it('clicking the button should set expanded to false in state', function () {
      summary.find('button').simulate('click');
      assert.equal(summary.state().expanded, false);
    });
  });
});
