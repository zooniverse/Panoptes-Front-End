/* eslint-disable func-names, prefer-arrow-callback */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import Select from 'react-select'; // required to properly simulate change, see allowCreate related testing
import DropdownTask from './';
import { workflow } from '../../../pages/dev-classifier/mock-data';

const singleSelect = {
  instruction: 'Is there something here?',
  selects: [{
    id: 'numbers123',
    title: 'Numbers',
    options: {
      '*': [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
        { label: 'Three', value: 3 }
      ]
    }
  }]
};

const multiSelects = workflow.tasks.dropdown;

// multiSelects:
//   1 - Country (required:true)
//   2 - State (condition:Country, required:true, allowCreate:false)
//   3 - County (condition:State, allowCreate:true)
//   4 - City (condition:County, allowCreate:false)
//   5 - Best State Team (condition:State, allowCreate:true)

describe('DropdownTask:static methods', function () {
  it('should have the correct question text', function () {
    assert.equal(DropdownTask.getTaskText(singleSelect), singleSelect.instruction);
  });

  it('the default annotation should be an empty array', function () {
    assert.equal(DropdownTask.getDefaultAnnotation().value.length, 0);
  });

  it('should not be complete if required and unanswered', function () {
    singleSelect.selects[0].required = true;
    const annotation = { value: [] };
    assert.equal(DropdownTask.isAnnotationComplete(singleSelect, annotation), false);
  });

  it('should not be complete if required answer cleared', function () {
    singleSelect.selects[0].required = true;
    const annotation = { value: [{ value: null, option: false }] };
    assert.equal(DropdownTask.isAnnotationComplete(singleSelect, annotation), false);
  });

  it('should not be complete if any required answer missing (Country answered, State missing)', function () {
    const annotation = { value: [{ value: 'HI', option: true }] };
    assert.equal(DropdownTask.isAnnotationComplete(multiSelects, annotation), false);
  });

  it('should be complete if required and answered with provided option', function () {
    singleSelect.selects[0].required = true;
    const annotation = { value: [{ option: true, value: 3 }] };
    assert.equal(DropdownTask.isAnnotationComplete(singleSelect, annotation), true);
  });

  it('should be complete if required and answered with custom option', function () {
    singleSelect.selects[0].required = true;
    singleSelect.selects[0].allowCreate = true;
    const annotation = { value: [{ option: false, value: 'Four' }] };
    assert.equal(DropdownTask.isAnnotationComplete(singleSelect, annotation), true);
  });

  it('should be complete if not required', function () {
    singleSelect.selects[0].required = false;
    const annotation = { value: [] };
    assert.equal(DropdownTask.isAnnotationComplete(singleSelect, annotation), true);
  });
});

describe('DropdownTask', function () {
  describe('with multiple selects', function () {
    describe('annotation not provided', function () {
      const annotation = { value: [] };

      let wrapper;

      beforeEach(function () {
        wrapper = mount(<DropdownTask task={multiSelects} annotation={annotation} />)
      });

      it('should render without crashing', function () {
      });

      it('should have a question', function () {
        const question = wrapper.find('.question');
        assert.equal(question.length, 1);
      });

      it('should render all selects', function () {
        const renderedSelects = wrapper.find(Select);
        assert.equal(renderedSelects.length, multiSelects.selects.length);
      });

      it('should disable selects with unanswered conditions and allowCreate false', function () {
        assert.equal(wrapper.find('.is-disabled').length, 2);
      });

      it('should enable selects with allowCreate true', function () {
        assert.equal(0, 1);
      });
    });
  });
});
