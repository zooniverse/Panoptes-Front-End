/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { mount } from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import assert from 'assert';
import SliderTask from './index';
import { mockReduxStore } from '../testHelpers';

const task = {
  instruction: 'A slider',
  help: '',
  min: '0',
  max: '1',
  step: '0.1',
  defaultValue: '0.5'
};

describe('SliderTask', function () {
  let wrapper;
  let onChangeSpy;

  beforeEach(function () {
    onChangeSpy = sinon.spy();

    wrapper = mount(<SliderTask task={task} translation={task} onChange={onChangeSpy} />, mockReduxStore);
  });

  it('should render without crashing', function () {
  });

  it('should have an instruction', function () {
    const instruction = wrapper.find('.question');
    assert.equal(instruction.hostNodes().length, 1);
  });

  // it('should have the defaultValue as the initial annotation value', function () {
  //   const annotation = wrapper.
  // });

  describe('the slider input', function () {
    let slider;

    beforeEach(function () {
      slider = wrapper.find('input[type="range"]');
    });

    it('should have only one', function () {
      assert.equal(slider.length, 1);
    });

    it('should have the default value as the initial slider value', function () {
      assert.equal(slider.instance().value, task.defaultValue);
    });

    it('should have the correct max value', function () {
      assert.equal(slider.instance().max, task.max);
    });

    it('should have the correct min value', function () {
      assert.equal(slider.instance().min, task.min);
    });

    it('should have the correct step value', function () {
      assert.equal(slider.instance().step, task.step);
    });

    it('should call onChange with a value selected within range', function () {
      slider.simulate('change', { target: { value: 0.3 }});
      assert(onChangeSpy.calledWith({
        value: 0.3
      }));
    });

    it('should call onChange with the min value if below range', function () {
      slider.simulate('change', { target: { value: -1 }});
      assert(onChangeSpy.calledWith({
        value: 0
      }));
    });

    it('should call onChange with the max value if above range', function () {
      slider.simulate('change', { target: { value: 2 }});
      assert(onChangeSpy.calledWith({
        value: 1
      }));
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

    it('should have the default value as the initial number value', function () {
      assert.equal(number.instance().value, task.defaultValue);
    });

    it('should have the correct max value', function () {
      assert.equal(number.instance().max, task.max);
    });

    it('should have the correct min value', function () {
      assert.equal(number.instance().min, task.min);
    });

    it('should have the correct step value', function () {
      assert.equal(number.instance().step, task.step);
    });

    it('should call onChange with a value selected within range', function () {
      number.simulate('change', { target: { value: 0.3 }});
      assert(onChangeSpy.calledWith({
        value: 0.3
      }));
    });

    it('should call onChange with the min value if below range', function () {
      number.simulate('change', { target: { value: -1 }});
      assert(onChangeSpy.calledWith({
        value: 0
      }));
    });

    it('should call onChange with the max value if above range', function () {
      number.simulate('change', { target: { value: 2 }});
      assert(onChangeSpy.calledWith({
        value: 1
      }));
    });
  });

  describe('static methods', function () {
    it('should be complete with valid annotation', function () {
      assert.equal(SliderTask.isAnnotationComplete(task, { value: '0.7' }), true);
    });

    it('should not be complete when the annotation is null', function () {
      assert.equal(SliderTask.isAnnotationComplete(task, { value: null }), false);
    });

    it('should have the correct instruction text', function () {
      assert.equal(SliderTask.getTaskText(task), task.instruction);
    });

    it('should have the correct default annotation', function () {
      assert.equal(SliderTask.getDefaultAnnotation(task).value, task.defaultValue);
    });
  });
});

describe('SliderSummary', function () {
  let summary;

  beforeEach(function () {
    summary = mount(<SliderTask.Summary task={task} translation={task} annotation={{ value: '0.7' }} />, mockReduxStore);
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

  it('should have the correct answer label when the value is falsy (i.e. 0)', function () {
    summary = mount(<SliderTask.Summary task={task} translation={task} annotation={{ value: '0' }} />, mockReduxStore);
    const answers = summary.find('.answer');
    assert.notEqual(answers.text(), 'No answer');
  });
});
