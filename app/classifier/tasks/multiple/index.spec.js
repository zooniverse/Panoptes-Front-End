/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import MultipleTask from './';

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
    wrapper = mount(<MultipleTask task={task} annotation={annotation} translation={task} />);
  });

  it('should render without crashing', function () {
  });

  it('should have a question', function () {
    const question = wrapper.find('.question');
    assert.equal(question.hostNodes().length, 1);
  });

  it('should have answers', function () {
    const answers = wrapper.find('.answer');
    assert.equal(answers.length, task.answers.length);
  });

  it('should have the supplied annotation checked', function () {
    assert.equal(wrapper.find('input[type="checkbox"]').find({ checked: true }).length, 2);
  });

  it('other answers should not be checked', function () {
    assert.equal(wrapper.find('input[type="checkbox"]').find({ checked: false }).length, 1);
  });

  describe('static methods', function () {
    it('should be incomplete', function () {
      assert.equal(MultipleTask.isAnnotationComplete(task, annotation), false);
    });

    it('should be complete', function () {
      assert.equal(MultipleTask.isAnnotationComplete(task, { value: [0, 1, 2] }), true);
    });

    it('should be complete when not required', function () {
      assert.equal(MultipleTask.isAnnotationComplete(Object.assign({}, task, { required: undefined }), { value: [] }), true);
    });

    it('should have the correct question text', function () {
      assert.equal(MultipleTask.getTaskText(task), task.question);
    });

    it('the default annotation should be an empty array', function () {
      assert.equal(MultipleTask.getDefaultAnnotation().value.length, 0);
    });
  });
});

describe('MultipleChoiceSummary', function () {
  let summary;

  beforeEach(function () {
    summary = mount(<MultipleTask.Summary task={task} annotation={annotation} translation={task} />);
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

  it('should have the selected number of answers when collapsed', function () {
    const answers = summary.find('.answer');
    assert.equal(answers.length, annotation.value.length);
  });

  it('should return "No answer" when an empty annotation is provided', function () {
    summary = mount(<MultipleTask.Summary task={task} annotation={{ value: [] }} />);
    const answer = summary.find('.answer');
    assert.equal(answer.text(), 'No answer');
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

    it('should have correct number of checked answers', function () {
      const checks = summary.find('.fa-check-square-o');
      assert.equal(checks.length, annotation.value.length);
    });

    it('should have the correct number of un-checked answers', function () {
      const unchecks = summary.find('.fa-square-o');
      assert.equal(unchecks.length, task.answers.length - annotation.value.length);
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
