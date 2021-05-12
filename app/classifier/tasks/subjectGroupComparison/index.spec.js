/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { shallow } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import SubjectGroupComparisonTask from './';
import GenericTask from '../generic';
import { mockReduxStore, radioTypeAnnotation, radioTypeTask } from '../testHelpers';

const annotation = Object.assign({}, radioTypeAnnotation, {
  value: 1
});

describe('SubjectGroupComparisonTask', function () {
  describe('when it renders', function() {
    let wrapper;

    beforeEach(function () {
      wrapper = shallow(<SubjectGroupComparisonTask task={radioTypeTask} annotation={annotation} translation={radioTypeTask} />, mockReduxStore);
    });

    it('should render without crashing', function () {
      expect(wrapper).to.be.ok;
    });

    it('should have a question', function () {
      const question = wrapper.find(GenericTask).prop('question');
      expect(question).to.equal(radioTypeTask.question);
    });
  });

  describe('static methods', function () {
    it('should be complete', function () {
      expect(SubjectGroupComparisonTask.isAnnotationComplete(radioTypeTask, annotation)).to.be.true;
    });

    it('should be complete when value is 0 (i.e. falsy)', function () {
      expect(SubjectGroupComparisonTask.isAnnotationComplete(radioTypeTask, { value: 0 })).to.be.true;
    });

    it('should not be complete when value is null', function () {
      expect(SubjectGroupComparisonTask.isAnnotationComplete(radioTypeTask, { value: null })).to.be.false;
    });

    it('should be complete when task is not required', function () {
      expect(SubjectGroupComparisonTask.isAnnotationComplete(Object.assign({}, radioTypeTask, { required: false }), { value: null })).to.be.true;
    });

    it('should have the correct question text', function () {
      expect(SubjectGroupComparisonTask.getTaskText(radioTypeTask)).to.equal(radioTypeTask.question);
    });

    it('the default annotation should be null', function () {
      expect(SubjectGroupComparisonTask.getDefaultAnnotation().value).to.be.null;
    });
  });
});

describe('SubjectGroupComparison', function () {
  let summary;

  beforeEach(function () {
    summary = shallow(<SubjectGroupComparisonTask.Summary task={radioTypeTask} annotation={annotation} translation={radioTypeTask} />);
  });

  it('should render without crashing', function () {
  });

  it('should have a question', function () {
    const question = summary.find('.question');
    expect(question).to.have.lengthOf(1)
  });
});
