/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { mount } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
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
  describe('when it renders', function() {
    let wrapper;

    beforeEach(function () {
      wrapper = mount(<MultipleTask task={task} annotation={annotation} translation={task} />);
    });

    it('should render without crashing', function () {
      expect(wrapper).to.be.ok;
    });

    it('should have a question', function () {
      const question = wrapper.find('.question');
      expect(question.hostNodes()).to.have.lengthOf(1);
    });

    it('should have answers', function () {
      const answers = wrapper.find('.answer');
      expect(answers).to.have.lengthOf(task.answers.length);
    });

    it('should have the supplied annotation checked', function () {
      expect(wrapper.find('input[type="checkbox"]').find({ checked: true })).to.have.lengthOf(2);
    });

    it('other answers should not be checked', function () {
      expect(wrapper.find('input[type="checkbox"]').find({ checked: false })).to.have.lengthOf(1);
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
          task={task}
          translation={task}
          onChange={onChangeSpy}
        />
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

    it('should set focus state to an empty object if target value is checked', function () {
      wrapper.setProps({ annotation });
      wrapper.find('input').first().simulate('change', { target: { checked: true } });
      expect(setStateSpy.calledOnce).to.be.true;
      expect(setStateSpy.calledWith({ focus: {} })).to.be.true;
    });

    it('should call handleChange with the answer array index', function() {
      wrapper.setProps({ annotation });
      wrapper.find('input').first().simulate('change', { target: { checked: true } });
      expect(handleChangeSpy.calledWith(0)).to.be.true;
    });

    it('should not set focus state if target value is not checked', function() {
      // wrapper.setProps({ annotation: { value: [] }});
      wrapper.find('input').first().simulate('change', { target: { checked: false } });
      expect(setStateSpy.calledOnce).to.be.false;
    });
  });

  describe('input onFocus event handler', function() {
    let onFocusSpy;
    let setStateSpy;
    let wrapper;
    before(function() {
      onFocusSpy = sinon.spy(MultipleTask.prototype, 'onFocus');
      setStateSpy = sinon.spy(MultipleTask.prototype, 'setState');
      wrapper = mount(
        <MultipleTask
          task={task}
          translation={task}
        />
      );
    });

    afterEach(function () {
      onFocusSpy.resetHistory();
      setStateSpy.resetHistory();
    });

    after(function () {
      onFocusSpy.restore();
      setStateSpy.restore();
    });

    it('should call onFocus on input focus event', function() {
      wrapper.find('input').first().simulate('focus');
      expect(onFocusSpy.calledOnce).to.be.true;
    });

    it('should call onFocus with answer index property', function() {
      wrapper.find('input').first().simulate('focus');
      expect(onFocusSpy.calledWith(0)).to.be.true;
    });

    it('should not call setState in onFocus handler if annotation includes answer index', function() {
      wrapper.setProps({ annotation });
      wrapper.find('input').first().simulate('focus');
      expect(setStateSpy.calledOnce).to.be.false;
    });

    it('should call setState in onFocus handler if annotation does not include answer index', function() {
      wrapper.setProps({ annotation });
      wrapper.find('input').last().simulate('focus');
      expect(setStateSpy.calledOnce).to.be.true;
      expect(setStateSpy.calledWith({ focus: { 2: true }}));
    });
  });

  describe('input onBlur event handler', function() {
    let onBlurSpy;
    let setStateSpy;
    let wrapper;
    before(function () {
      onBlurSpy = sinon.spy(MultipleTask.prototype, 'onBlur');
      setStateSpy = sinon.spy(MultipleTask.prototype, 'setState');
      wrapper = mount(
        <MultipleTask
          task={task}
          annotation={annotation}
          translation={task}
        />
      );
    });

    afterEach(function () {
      onBlurSpy.resetHistory();
      setStateSpy.resetHistory();
    });

    after(function () {
      onBlurSpy.restore();
      setStateSpy.restore();
    });

    it('should call onBlur handler on the blur event', function() {
      wrapper.find('input').first().simulate('blur');
      expect(onBlurSpy.calledOnce).to.be.true;
    });

    it('should call setState for the onBlur handler event', function() {
      wrapper.find('input').first().simulate('blur');
      expect(setStateSpy.calledOnce).to.be.true;
      expect(setStateSpy.calledWith({ focus: {}})).to.be.true;
    });
  });

  describe('static methods', function () {
    it('should be incomplete', function () {
      expect(MultipleTask.isAnnotationComplete(task, annotation)).to.be.false
    });

    it('should be complete', function () {
      expect(MultipleTask.isAnnotationComplete(task, { value: [0, 1, 2] })).to.be.true;
    });

    it('should be complete when not required', function () {
      expect(MultipleTask.isAnnotationComplete(Object.assign({}, task, { required: undefined }), { value: [] })).to.be.true;
    });

    it('should have the correct question text', function () {
      expect(MultipleTask.getTaskText(task)).to.equal(task.question);
    });

    it('the default annotation should be an empty array', function () {
      expect(MultipleTask.getDefaultAnnotation().value).to.have.lengthOf(0);
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
    summary = mount(<MultipleTask.Summary task={task} annotation={{ value: [] }} />);
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
      expect(answers).to.have.lengthOf(task.answers.length);
    });

    it('should have correct number of checked answers', function () {
      const checks = summary.find('.fa-check-square-o');
      expect(checks).to.have.lengthOf(annotation.value.length);
    });

    it('should have the correct number of un-checked answers', function () {
      const unchecks = summary.find('.fa-square-o');
      expect(unchecks).to.have.lengthOf(task.answers.length - annotation.value.length);
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
