/* eslint-disable func-names, prefer-arrow-callback */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import Select from 'react-select'; // required to properly simulate change
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

  it('should have a default annotation of an empty array', function () {
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

  it('should not be complete if one of two required answers missing (Country answered, State missing)', function () {
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
      let annotation;
      let wrapper;

      beforeEach(function () {
        annotation = { value: [] };

        wrapper = mount(<DropdownTask task={multiSelects} annotation={annotation} onChange={function (a) { return a; }} />);
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

      it('should have an annotation reflecting nothing selected', function () {
        annotation.value.forEach((annotationValue) => {
          const { option, value } = annotationValue;
          assert.equal(value, null);
          assert.equal(option, false);
        });
      });

      it('should update the annotation on change', function () {
        wrapper.instance().onChangeSelect(0, multiSelects.selects[0].options['*'][0]);
        const { option, value } = annotation.value[0];
        assert.equal(value, 'USA-value');
        assert.equal(option, true);
      });

      it('should not save custom answer if allowCreate false', function () {
        const countrySelect = wrapper.find('#countryID').find(Select);
        const countrySelectInput = countrySelect.find('input');

        countrySelectInput.simulate('change', { target: { value: 'test Country' }});
        countrySelectInput.simulate('keyDown', { keyCode: 13, which: 13, key: 'Enter' });

        const countryOption = annotation.value[0].option;
        const countryValue = annotation.value[0].value;

        assert.equal(countryValue, null);
        assert.equal(countryOption, false);
      });
    });
    describe('first annotation provided (Country)', function () {
      let annotation;
      let wrapper;

      beforeEach(function () {
        annotation = { value: [
          { value: 'USA-value', option: true },
          { value: null, option: false },
          { value: null, option: false },
          { value: null, option: false },
          { value: null, option: false }
        ] };

        wrapper = mount(<DropdownTask task={multiSelects} annotation={annotation} onChange={function (a) { return a; }} />);
      });

      it('should make selects conditional on first annotation and allowCreate false now enabled (State now enabled, City still disabled)', function () {
        assert.equal(wrapper.find('.is-disabled').length, 1);
      });

      it('should show the proper options in selects conditional (State)', function () {
        const stateSelect = wrapper.find('#stateID').find(Select);
        assert.deepEqual(stateSelect.props().options, multiSelects.selects[1].options['USA-value']);
      });
    });
    describe('all annotations provided, no custom answers', function () {
      let annotation;
      let wrapper;

      beforeEach(function () {
        annotation = { value: [
          { value: 'Mypos-value', option: true },
          { value: 'Rohan-value', option: true },
          { value: 'GothamCounty-value', option: true },
          { value: 'Gotham-value', option: true },
          { value: 'Isotopes-value', option: true }
        ] };

        wrapper = mount(<DropdownTask task={multiSelects} annotation={annotation} onChange={function (a) { return a; }} />);
      });

      it('should have the supplied annotations selected', function () {
        assert.equal(wrapper.find('#countryID').find('[role="option"][aria-selected="true"]').text(), 'Mypos');
        assert.equal(wrapper.find('#stateID').find('[role="option"][aria-selected="true"]').text(), 'Rohan');
        assert.equal(wrapper.find('#countyID').find('[role="option"][aria-selected="true"]').text(), 'Gotham County');
        assert.equal(wrapper.find('#cityID').find('[role="option"][aria-selected="true"]').text(), 'Gotham');
      });
      it('should clear related selects (County, City, Team) when conditional select (State) changed', function () {
        wrapper.instance().onChangeSelect(1, multiSelects.selects[1].options['Mypos-value'][2]);
        const expectedAnnotation = { value: [
          { value: 'Mypos-value', option: true },
          { value: 'Shire-value', option: true },
          { value: null, option: false },
          { value: null, option: false },
          { value: null, option: false }
        ] };
        assert.deepEqual(annotation, expectedAnnotation);
      });
    });
    describe('all annotations provided, including custom answers', function () {
      let annotation;
      let wrapper;

      beforeEach(function () {
        annotation = { value: [
          { value: 'Canada-value', option: true },
          { value: 'QC', option: true },
          { value: 'Laval', option: false },
          { value: null, option: false },
          { value: 'Rocket', option: false }
        ] };

        wrapper = mount(<DropdownTask task={multiSelects} annotation={annotation} onChange={function (a) { return a; }} />);
      });

      it('should have the supplied annotations selected', function () {
        assert.equal(wrapper.find('#countryID').find('[role="option"][aria-selected="true"]').text(), 'Canada');
        assert.equal(wrapper.find('#stateID').find('[role="option"][aria-selected="true"]').text(), 'Quebec');
        assert.equal(wrapper.find('#countyID').find('[role="option"][aria-selected="true"]').text(), 'Laval');
      });
      it('should clear related selects (County, City, Team) when conditional select (State) changed', function () {
        wrapper.instance().onChangeSelect(1, multiSelects.selects[1].options['Canada-value'][1]);
        const expectedAnnotation = { value: [
          { value: 'Canada-value', option: true },
          { value: 'ON', option: true },
          { value: null, option: false },
          { value: null, option: false },
          { value: null, option: false }
        ] };
        assert.deepEqual(annotation, expectedAnnotation);
      });
    });
  });
});
