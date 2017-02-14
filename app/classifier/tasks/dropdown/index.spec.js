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
        wrapper = mount(<DropdownTask task={multiSelects} annotation={annotation} onChange={function (a) { return a; }} />)
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
        annotation.value.forEach((annotation) => {
          const { option, value } = annotation
          assert.equal(value, null);
          assert.equal(option, false);
        });
      });

      it('should disable selects with unanswered conditions and allowCreate false', function () {
        assert.equal(wrapper.find('.is-disabled').length, 2);
      });

      it('should enable and save custom answer for selects with allowCreate true', function () {
        const countySelect = wrapper.find('#countyID').find(Select);
        const countySelectInput = countySelect.find('input');

        countySelectInput.simulate('change', { target: { value: 'test County' }});
        countySelectInput.simulate('keyDown', { keyCode: 13, which: 13, key: 'Enter' });

        const countyOption = annotation.value[2].option;
        const countyValue = annotation.value[2].value;
        assert.equal(countyValue, 'test County');
        assert.equal(countyOption, false);

        const teamSelect = wrapper.find('#teamID').find(Select);
        const teamSelectInput = teamSelect.find('input');

        teamSelectInput.simulate('change', { target: { value: 'test Team' }});
        teamSelectInput.simulate('keyDown', { keyCode: 13, which: 13, key: 'Enter' });

        const teamOption = annotation.value[4].option;
        const teamValue = annotation.value[4].value;
        assert.equal(teamValue, 'test Team');
        assert.equal(teamOption, false);
      });

      it('should update the annotation on change', function () {
        wrapper.instance().onChangeSelect(0, multiSelects.selects[0].options['*'][0]);
        const { option, value } = annotation.value[0];
        assert.equal(value, 'USA-value');
        assert.equal(option, true);
      });

      it('should not save custom answer if allowCreate false', function () {});
    });
    describe('first annotation provided', function () {
      const annotation = { value: [
        { value: "USA-value", option: true },
        { value: null, option: false },
        { value: null, option: false },
        { value: null, option: false },
        { value: null, option: false },
      ]};

      let wrapper;

      beforeEach(function () {
        wrapper = mount(<DropdownTask task={multiSelects} annotation={annotation} onChange={function (a) { return a; }} />)
      });

      it('should make selects conditional on first annotation and allowCreate false now enabled', function () {
        assert.equal(wrapper.find('.is-disabled').length, 1);
      });

      it('should show the proper options in selects conditional', function () {});
    });
    describe('all annotations provided', function () {
      it('should have the supplied annotations selected, not including custom answers', function () {
        // assert.equal(wrapper.find('[role="option"][aria-selected="true"]').text(), 'Three');
      });
      it('should have the supplied annotations selected, including custom answers', function () {});
      it('should clear related selects when conditional select cleared', function () {});
      it('should update the annotations provided on change', function () {});
    });
  });
});
