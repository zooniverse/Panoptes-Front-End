/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { mount } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import SingleTask from './';
import { mockReduxStore, radioTypeAnnotation, radioTypeTask } from '../testHelpers';

const annotation = Object.assign({}, radioTypeAnnotation, {
  value: 1
});

describe('SingleChoiceTask', function () {
  describe('when it renders', function() {
    let wrapper;

    beforeEach(function () {
      wrapper = mount(<SingleTask task={radioTypeTask} annotation={annotation} translation={radioTypeTask} />, mockReduxStore);
    });

    it('should render without crashing', function () {
      expect(wrapper).to.be.ok;
    });

    it('should have a question', function () {
      const question = wrapper.find('.question');
      expect(question.hostNodes()).to.have.lengthOf(1);
    });

    it('should have answers', function () {
      expect(wrapper.find('TaskInputField')).to.have.lengthOf(radioTypeTask.answers.length);
    });
  });

  describe('input onChange event handler', function() {
    let handleChangeSpy;
    let onChangeSpy;
    let setStateSpy;
    let wrapper;
    before(function () {
      handleChangeSpy = sinon.spy(SingleTask.prototype, 'handleChange');
      onChangeSpy = sinon.spy();
      setStateSpy = sinon.spy(SingleTask.prototype, 'setState');
    });

    beforeEach(function() {
      wrapper = mount(
        <SingleTask
          task={radioTypeTask}
          translation={radioTypeTask}
          onChange={onChangeSpy}
        />,
        mockReduxStore
      );
    });

    afterEach(function () {
      handleChangeSpy.resetHistory();
      onChangeSpy.resetHistory();
      setStateSpy.resetHistory();
    });

    after(function () {
      handleChangeSpy.restore();
      setStateSpy.restore();
    });

    it('should call handleChange with the answer array index', function () {
      wrapper.find('input').first().simulate('change');
      expect(handleChangeSpy.calledWith(0)).to.be.true;
    });

    it('should not set focus state if target value is not checked', function () {
      wrapper.instance().handleChange(0, { target: {} });
      expect(setStateSpy.calledOnce).to.be.false;
    });

    it('should call props.onChange when the onChange event fires and the target is checked', function () {
      const firstInput = wrapper.find('input').first();
      firstInput.simulate('change', { target: { checked: true } });
      expect(onChangeSpy.calledOnce).to.be.true;
    });

    it('should set focus state to an empty object if target value is checked', function () {
      wrapper.find('input').first().simulate('change', { target: { checked: true } });
      expect(setStateSpy.calledOnce).to.be.true;
      expect(setStateSpy.calledWith({ focus: {} })).to.be.true;
    });
  });

  describe('input onFocus event handler', function () {
    let onFocusSpy;
    let setStateSpy;
    let wrapper;
    before(function () {
      onFocusSpy = sinon.spy(SingleTask.prototype, 'onFocus');
      setStateSpy = sinon.spy(SingleTask.prototype, 'setState');
    });

    beforeEach(function() {
      wrapper = mount(
        <SingleTask
          task={radioTypeTask}
          translation={radioTypeTask}
        />,
        mockReduxStore
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

    it('should call onFocus on input focus event', function () {
      wrapper.find('input').first().simulate('focus');
      expect(onFocusSpy.calledOnce).to.be.true;
    });

    it('should call onFocus with answer index property', function () {
      wrapper.find('input').first().simulate('focus');
      expect(onFocusSpy.calledWith(0)).to.be.true;
    });

    it('should not call setState in onFocus handler if annotation is the answer index', function () {
      wrapper.setProps({ annotation });
      wrapper.find('input').last().simulate('focus');
      expect(setStateSpy.calledOnce).to.be.false;
    });

    it('should call setState in onFocus handler if annotation does not include answer index', function () {
      wrapper.setProps({ annotation });
      wrapper.find('input').first().simulate('focus');
      expect(setStateSpy.calledOnce).to.be.true;
      expect(setStateSpy.calledWith({ focus: { 1: true } }));
    });
  });

  describe('input onBlur event handler', function () {
    let onBlurSpy;
    let setStateSpy;
    let wrapper;
    before(function () {
      onBlurSpy = sinon.spy(SingleTask.prototype, 'onBlur');
      setStateSpy = sinon.spy(SingleTask.prototype, 'setState');
      wrapper = mount(
        <SingleTask
          task={radioTypeTask}
          annotation={annotation}
          translation={radioTypeTask}
        />,
        mockReduxStore
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

    it('should call onBlur handler on the blur event', function () {
      wrapper.find('input').first().simulate('blur');
      expect(onBlurSpy.calledOnce).to.be.true;
    });

    it('should call setState for the onBlur handler event', function () {
      wrapper.find('input').first().simulate('blur');
      expect(setStateSpy.calledOnce).to.be.true;
      expect(setStateSpy.calledWith({ focus: {} })).to.be.true;
    });
  });

  describe('static methods', function () {
    it('should be complete', function () {
      expect(SingleTask.isAnnotationComplete(radioTypeTask, annotation)).to.be.true;
    });

    it('should be complete when value is 0 (i.e. falsy)', function () {
      expect(SingleTask.isAnnotationComplete(radioTypeTask, { value: 0 })).to.be.true;
    });

    it('should not be complete when value is null', function () {
      expect(SingleTask.isAnnotationComplete(radioTypeTask, { value: null })).to.be.false;
    });

    it('should be complete when task is not required', function () {
      expect(SingleTask.isAnnotationComplete(Object.assign({}, radioTypeTask, { required: false }), { value: null })).to.be.true;
    });

    it('should have the correct question text', function () {
      expect(SingleTask.getTaskText(radioTypeTask)).to.equal(radioTypeTask.question);
    });

    it('the default annotation should be null', function () {
      expect(SingleTask.getDefaultAnnotation().value).to.be.null;
    });
  });
});

describe('SingleChoiceSummary', function () {
  let summary;

  beforeEach(function () {
    summary = mount(<SingleTask.Summary task={radioTypeTask} annotation={annotation} translation={radioTypeTask} />);
  });

  it('should render without crashing', function () {
  });

  it('should have a question', function () {
    const question = summary.find('.question');
    expect(question).to.have.lengthOf(1)
  });

  it('the default expanded state should be false', function () {
    expect(summary.state().expanded).to.be.false;
  });

  it('should have one answer when collapsed', function () {
    const answers = summary.find('.answer');
    expect(answers).to.have.lengthOf(1)
  });

  it('should have the correct answer label when the value if falsy (i.e. 0)', function () {
    summary = mount(<SingleTask.Summary task={radioTypeTask} annotation={{ value: 0 }} translation={radioTypeTask} />);
    const answers = summary.find('.answer');
    expect(answers.text()).to.not.equal('No answer');
  });

  it('should return "No answer" when annotation is null', function () {
    summary = mount(<SingleTask.Summary task={radioTypeTask} annotation={{ value: null }} translation={radioTypeTask} />);
    const answers = summary.find('.answer');
    expect(answers.text()).to.equal('No answer');
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
      expect(answers).to.have.lengthOf(radioTypeTask.answers.length);
    });

    it('should have one answer selected', function () {
      const checks = summary.find('.fa-check-circle-o');
      expect(checks).to.have.lengthOf(1);
    });

    it('should have the correct number of non-selected answers', function () {
      const unchecks = summary.find('.fa-circle-o');
      expect(unchecks).to.have.lengthOf(radioTypeTask.answers.length - 1);
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
