/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { mount } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import MultipleTask from './';
import { mockReduxStore, checkboxTypeAnnotation, checkboxTypeTask } from '../testHelpers';

const annotation = Object.assign({}, checkboxTypeAnnotation, {
  value: [0, 1]
});

describe('MultipleChoiceTask', function () {
  describe('when it renders', function() {
    let wrapper;

    beforeEach(function () {
      wrapper = mount(<MultipleTask
        task={checkboxTypeTask}
        annotation={annotation}
        translation={checkboxTypeTask}
      />, mockReduxStore);
    });

    it('should render without crashing', function () {
      expect(wrapper).to.be.ok;
    });

    it('should have a question', function () {
      const question = wrapper.find('.question');
      expect(question.hostNodes()).to.have.lengthOf(1);
    });

    it('should have answers', function () {
      expect(wrapper.find('TaskInputField')).to.have.lengthOf(checkboxTypeTask.answers.length);
    });
  });

  describe('input onChange event handler', function() {
    let handleChangeSpy;
    let onChangeSpy;
    let setStateSpy;
    let wrapper;
    before(function() {
      handleChangeSpy = sinon.spy(MultipleTask.prototype, 'handleChange');
      onChangeSpy = sinon.spy();
      setStateSpy = sinon.spy(MultipleTask.prototype, 'setState');
      wrapper = mount(
        <MultipleTask
          task={checkboxTypeTask}
          translation={checkboxTypeTask}
          onChange={onChangeSpy}
        />,
        mockReduxStore
      );
    });

    afterEach(function() {
      handleChangeSpy.resetHistory();
      onChangeSpy.resetHistory();
      setStateSpy.resetHistory();
    });

    after(function() {
      handleChangeSpy.restore();
      setStateSpy.restore();
    });

    it('should call props.onChange when the onChange event fires', function () {
      wrapper.find('input').first().simulate('change', { target: { checked: true } });
      expect(onChangeSpy.calledOnce).to.be.true;
    });

    it('should call handleChange with the answer array index', function() {
      wrapper.setProps({ annotation });
      wrapper.find('input').first().simulate('change', { target: { checked: true } });
      expect(handleChangeSpy.calledWith(0)).to.be.true;
    });
  });

  describe('static methods', function () {
    it('should be incomplete', function () {
      expect(MultipleTask.isAnnotationComplete(checkboxTypeTask, annotation)).to.be.false
    });

    it('should be complete', function () {
      expect(MultipleTask.isAnnotationComplete(checkboxTypeTask, { value: [0, 1, 2] })).to.be.true;
    });

    it('should be complete when not required', function () {
      expect(MultipleTask.isAnnotationComplete(Object.assign({}, checkboxTypeTask, { required: undefined }), { value: [] })).to.be.true;
    });

    it('should have the correct question text', function () {
      expect(MultipleTask.getTaskText(checkboxTypeTask)).to.equal(checkboxTypeTask.question);
    });

    it('the default annotation should be an empty array', function () {
      expect(MultipleTask.getDefaultAnnotation().value).to.have.lengthOf(0);
    });
  });
});

describe('MultipleChoiceSummary', function () {
  let summary;

  beforeEach(function () {
    summary = mount(<MultipleTask.Summary task={checkboxTypeTask} annotation={annotation} translation={checkboxTypeTask} />);
  });

  it('should render without crashing', function () {
  });

  it('should have a question', function () {
    const question = summary.find('.question');
    expect(question).to.have.lengthOf(1);
  });

  it('the default expanded state should be false', function () {
    expect(summary.state().expanded).to.be.false;
  });

  it('should have the selected number of answers when collapsed', function () {
    const answers = summary.find('.answer');
    expect(answers).to.have.lengthOf(annotation.value.length);
  });

  it('should return "No answer" when an empty annotation is provided', function () {
    summary = mount(<MultipleTask.Summary task={checkboxTypeTask} annotation={{ value: [] }} />);
    const answer = summary.find('.answer');
    expect(answer.text()).to.equal('No answer');
  });

  it('button should read "More" when not expanded', function () {
    const button = summary.find('button');
    expect(button.text()).to.equal('More');
  });

  describe('when summary is expanded', function () {
    beforeEach(function () {
      summary.find('button').simulate('click');
    });

    it('should set expanded to true in state', function () {
      expect(summary.state().expanded).to.be.true;
    });

    it('should show all answers', function () {
      const answers = summary.find('.answer');
      expect(answers).to.have.lengthOf(checkboxTypeTask.answers.length);
    });

    it('should have correct number of checked answers', function () {
      const checks = summary.find('.fa-check-square-o');
      expect(checks).to.have.lengthOf(annotation.value.length);
    });

    it('should have the correct number of un-checked answers', function () {
      const unchecks = summary.find('.fa-square-o');
      expect(unchecks).to.have.lengthOf(checkboxTypeTask.answers.length - annotation.value.length);
    });

    it('button should read "Less"', function () {
      const button = summary.find('button');
      expect(button.text()).to.equal('Less');
    });

    it('clicking the button should set expanded to false in state', function () {
      summary.find('button').simulate('click');
      expect(summary.state().expanded).to.be.false;
    });
  });
});
