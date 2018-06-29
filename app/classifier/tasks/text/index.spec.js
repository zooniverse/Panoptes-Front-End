/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import TextTask from './';
import TextSummary from './summary';
import { textTypeAnnotation, textTypeTask } from '../testHelpers';

const annotation = Object.assign({}, textTypeAnnotation, { value: 'testing the text task' });

describe.only('TextTask', function () {
  describe('when it renders', function () {
    let wrapper;

    beforeEach(function () {
      wrapper = mount(<TextTask
        task={textTypeTask}
        annotation={annotation}
        translation={textTypeTask}
      />);
    });

    it('should render without crashing', function () {
      expect(wrapper).to.be.ok;
    });

    it('should have an instruction', function () {
      const instruction = wrapper.find('.question');
      expect(instruction.hostNodes()).to.have.lengthOf(1);
    });

    it('should have an answer', function () {
      const answer = wrapper.find('textarea').text();
      expect(answer).to.equal(annotation.value);
    });

    it.skip('should have appropriate input height with multiline answer', function () {});
  });

  describe('input onChange event handler', function () {
    let handleChangeSpy;
    let onChangeSpy;
    let setStateSpy;
    let wrapper;

    before(function () {
      handleChangeSpy = sinon.spy(TextTask.prototype, 'handleChange');
      onChangeSpy = sinon.spy();
      setStateSpy = sinon.spy(TextTask.prototype, 'setState');
    });

    beforeEach(function () {
      wrapper = mount(
        <TextTask
          onChange={onChangeSpy}
          task={textTypeTask}
          translation={textTypeTask}
        />);
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

    it('should insert tags when tag clicked', function () {
      wrapper.find('.text-tag').first().simulate('click');
      expect(wrapper.state('value')).to.equal('[deletion][/deletion]');
    });

    // it('should wrap text with tags when text highlighted and tag clicked', function () {});

    it('should call handleChange when the onChange event fires', function () {
      wrapper.find('textarea').first().simulate('change', { target: { value: 'text change' }});
      expect(handleChangeSpy.calledOnce).to.be.true;
    });

    it.skip('should increase textarea size when appropriate', function () {});

    it.skip('should decrease textarea size when appropriate', function () {});
  });

  describe('static methods', function () {
    it('should be incomplete', function () {
      expect(TextTask.isAnnotationComplete(textTypeTask, textTypeAnnotation)).to.be.false;
    });

    it('should be complete', function () {
      expect(TextTask.isAnnotationComplete(textTypeTask, annotation)).to.be.true;
    });

    it('should be complete when not required', function () {
      expect(TextTask.isAnnotationComplete(Object.assign({}, textTypeTask, { required: false }), textTypeAnnotation)).to.be.true;
    });

    it('should have the correct instruction text', function () {
      expect(TextTask.getTaskText(textTypeTask)).to.equal(textTypeTask.instruction);
    });

    it('should have a default annotation of an empty string', function () {
      expect(TextTask.getDefaultAnnotation().value).to.equal('');
    });
  });
});

describe('TextSummary', function () {
  let summary;

  beforeEach(function () {
    summary = mount(<TextSummary task={textTypeTask} annotation={annotation} translation={textTypeTask} />);
  });

  it('should render without crashing', function () {
    expect(summary).to.be.ok;
  });

  it('should have an instruction', function () {
    const instruction = summary.find('.question');
    expect(instruction).to.have.lengthOf(1);
  });

  it('should show annotation', function () {
    const answer = summary.find('code');
    expect(answer).to.have.lengthOf(1);
    expect(answer.text()).to.equal(annotation.value);
  });
});
