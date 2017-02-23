/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import SliderTask from './index';

const task = {
  instruction: 'A slider',
  help: '',
  min: '0',
  max: '1',
  step: '0.1',
  defaultValue: '0',
  required: true
};

const annotation = {
  value: '0.2'
};

describe('SliderTask', function () {
  let wrapper;

  beforeEach(function () {
    wrapper = mount(<SliderTask task={task} annotation={annotation} />);
  });

  it('should render without crashing', function () {
  });

  it('should have an instruction', function () {
    const instruction = wrapper.find('.question');
    assert.equal(instruction.length, 1);
  });

  describe('the slider input', function () {
    let slider;

    beforeEach(function () {
      slider = wrapper.find('input[type="range"]');
    });

    it('should have only one', function () {
      assert.equal(slider.length, 1);
    });

    it('should have the annotation value', function () {
      assert.equal(slider.node.value, annotation.value);
    });

    it('should have the correct max value', function () {
      assert.equal(slider.node.max, task.max);
    });

    it('should have the correct min value', function () {
      assert.equal(slider.node.min, task.min);
    });

    it('should have the correct step value', function () {
      assert.equal(slider.node.step, task.step);
    });
  });

  describe('the number input', function () {
    let number;

    beforeEach(function () {
      number = wrapper.find('input[type="number"]');
    });

    it('should have only one', function () {
      assert.equal(number.length, 1);
    });

    it('should have the annotation value', function () {
      assert.equal(number.node.value, annotation.value);
    });

    it('should have the correct max value', function () {
      assert.equal(number.node.max, task.max);
    });

    it('should have the correct min value', function () {
      assert.equal(number.node.min, task.min);
    });

    it('should have the correct step value', function () {
      assert.equal(number.node.step, 'any');
    });
  });

  describe('when annotation is null', function () {
    beforeEach(function () {
      wrapper = mount(<SliderTask task={task} annotation={{ value: null }} />);
    });

    it('should have the default value for the slider input', function () {
      const slider = wrapper.find('input[type="range"]');
      assert.equal(slider.node.value, task.defaultValue);
    });

    it('should have the default value for the number input', function () {
      const number = wrapper.find('input[type="number"]');
      assert.equal(number.node.value, task.defaultValue);
    });
  });

  describe('static methods', function () {
    it('should be complete', function () {
      assert.equal(SliderTask.isAnnotationComplete(task, annotation), true);
    });

    it('should not be complete when the annotation is null', function () {
      assert.equal(SliderTask.isAnnotationComplete(task, { value: null }), false);
    });

    it('should be complete when task is not required', function () {
      assert.equal(SliderTask.isAnnotationComplete(Object.assign({}, task, { required: false }), { value: null }), true);
    });

    it('should have the correct instruction text', function () {
      assert.equal(SliderTask.getTaskText(task), task.instruction);
    });

    it('should have the correct default annoation', function () {
      assert.equal(SliderTask.getDefaultAnnotation().value, null);
    });
  });
});

describe('SliderSummary', function () {
  let summary;

  beforeEach(function () {
    summary = mount(<SliderTask.Summary task={task} annotation={annotation} />);
  });

  it('should render without crashing', function () {
  });

  it('should have a question', function () {
    const question = summary.find('.question');
    assert.equal(question.length, 1);
  });

  it('should have one answer', function () {
    const answers = summary.find('.answer');
    assert.equal(answers.length, 1);
  });

  it('should return "No answer" when annotation is null', function () {
    summary = mount(<SliderTask.Summary task={task} annotation={{ value: null }} />);
    const answers = summary.find('.answer');
    assert.equal(answers.text(), 'No answer');
  });

  it('should have the correct answer label when the value if falsy (i.e. 0)', function () {
    summary = mount(<SliderTask.Summary task={task} annotation={{ value: 0 }} />);
    const answers = summary.find('.answer');
    assert.notEqual(answers.text(), 'No answer');
  });
});
