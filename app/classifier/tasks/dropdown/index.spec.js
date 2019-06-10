/* eslint-disable func-names, prefer-arrow-callback */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import Select from 'react-select'; // required to properly simulate change
import DropdownTask from '.';
import { workflow } from '../../../pages/dev-classifier/mock-data';
import { mockReduxStore } from '../testHelpers';

function getMockTasks() {
  const singleSelect = {
    instruction: 'Is there something here?',
    selects: [{
      id: 'numbers123',
      title: 'Numbers',
      options: {
        '*': [
          { label: '0', value: 0 },
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 },
          { label: 'Three', value: 3 }
        ]
      }
    }]
  };

  const singleSelectTranslation = {
    instruction: 'Is there something here?',
    selects: [{
      id: 'numbers123',
      title: 'Numbers',
      options: {
        '*': [
          { label: '0', value: 0 },
          { label: 'Ein', value: 1 },
          { label: 'Zwei', value: 2 },
          { label: 'Drei', value: 3 }
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

  return { singleSelect, singleSelectTranslation, multiSelects }
}

describe('DropdownTask:static methods', function () {
  const { singleSelect, multiSelects } = getMockTasks();

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

  it('should be complete if required and answered with provided option with value of zero', function () {
    singleSelect.selects[0].required = true;
    const annotation = { value: [{ option: true, value: 0 }] };
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
  describe('with single select', function () {
    let wrapper;
    
    before(function () {
      const annotation = { value: [{ value: 0, option: true }] };
      const { singleSelect, singleSelectTranslation } = getMockTasks();

      wrapper = shallow(
        <DropdownTask
          task={singleSelect}
          translation={singleSelectTranslation}
          annotation={annotation}
          onChange={function (a) { return a; }}
        />, mockReduxStore
      );
    })

    it('should show that 0 is selected', function () {
      assert.deepEqual(wrapper.find(Select).prop('value'), { label: '0', value: 0 });
    });

    it('should show translated labels', function () {
      const annotation = { value: [{ value: 1, option: true }] };
      wrapper.setProps({ annotation });
      assert.deepEqual(wrapper.find(Select).prop('value'), { label: 'Ein', value: 1 });
    });
  });

  describe('with multiple selects', function () {
    describe('and annotation not provided,', function () {
      let annotation;
      let wrapper;
      let onChangeSpy;
      const { multiSelects } = getMockTasks();

      beforeEach(function () {
        annotation = { value: [] };
        onChangeSpy = sinon.spy();

        wrapper = mount(<DropdownTask task={multiSelects} translation={multiSelects} annotation={annotation} onChange={onChangeSpy} />, mockReduxStore);
      });

      it('should render without crashing', function () {
      });

      it('should have a question', function () {
        const question = wrapper.find('.question');
        assert.equal(question.hostNodes().length, 1);
      });

      it('should render all selects', function () {
        const renderedSelects = wrapper.find(Select);
        assert.equal(renderedSelects.length, multiSelects.selects.length);
      });

      it('should on mount have an annotation with values equal in length to the number of selects', function () {
        const newAnnotation = onChangeSpy.firstCall.args[0];
        assert.equal(newAnnotation.value.length, multiSelects.selects.length);
      });

      it('should on mount have an annotation reflecting nothing selected', function () {
        const newAnnotation = onChangeSpy.firstCall.args[0];
        newAnnotation.value.forEach((annotationValue) => {
          const { option, value } = annotationValue;
          assert.equal(value, null);
          assert.equal(option, false);
        });
      });

      it('should disable selects with unanswered conditions and allowCreate false (State, City)', function () {
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

      it('should not save custom answer if allowCreate false', function () {
        const countrySelect = wrapper.find('#countryID').find(Select);
        const countrySelectInput = countrySelect.find('input');
        onChangeSpy.resetHistory();

        countrySelectInput.simulate('change', { target: { value: 'test Country' }});
        countrySelectInput.simulate('keyDown', { keyCode: 13, which: 13, key: 'Enter' });

        assert.equal(onChangeSpy.called, false);
      });
    });

    describe('and first annotation provided (Country),', function () {
      let annotation;
      let wrapper;
      const { multiSelects } = getMockTasks();

      beforeEach(function () {
        annotation = { value: [
          { value: 'USA-value', option: true },
          { value: null, option: false },
          { value: null, option: false },
          { value: null, option: false },
          { value: null, option: false }
        ] };

        wrapper = mount(<DropdownTask task={multiSelects} translation={multiSelects} annotation={annotation} onChange={function (a) { return a; }} />, mockReduxStore);
      });

      it('should make selects conditional on first annotation and allowCreate false now enabled (State now enabled, City still disabled)', function () {
        assert.equal(wrapper.find('.is-disabled').length, 1);
      });

      it('should show the proper options in selects conditional (State)', function () {
        const stateSelect = wrapper.find('#stateID').find(Select);
        assert.deepEqual(stateSelect.props().options, multiSelects.selects[1].options['USA-value']);
      });

      it('should not save custom answer (for State) if allowCreate false', function () {
        const stateSelect = wrapper.find('#stateID').find(Select);
        const stateSelectInput = stateSelect.find('input');

        stateSelectInput.simulate('change', { target: { value: 'test State' }});
        stateSelectInput.simulate('keyDown', { keyCode: 13, which: 13, key: 'Enter' });

        const stateOption = annotation.value[1].option;
        const stateValue = annotation.value[1].value;
        assert.equal(stateValue, null);
        assert.equal(stateOption, false);
      });
    });

    describe('and all annotations provided, no custom answers,', function () {
      let annotation;
      let wrapper;
      const { multiSelects } = getMockTasks();

      beforeEach(function () {
        annotation = { value: [
          { value: 'Mypos-value', option: true },
          { value: 'Rohan-value', option: true },
          { value: 'GothamCounty-value', option: true },
          { value: 'Gotham-value', option: true },
          { value: 'Isotopes-value', option: true }
        ] };

        wrapper = mount(<DropdownTask task={multiSelects} translation={multiSelects} annotation={annotation} onChange={function (a) { return a; }} />, mockReduxStore);
      });

      it('should have the supplied annotations selected', function () {
        assert.equal(wrapper.find('#countryID').find('[role="option"][aria-selected="true"]').text(), 'Mypos');
        assert.equal(wrapper.find('#stateID').find('[role="option"][aria-selected="true"]').text(), 'Rohan');
        assert.equal(wrapper.find('#countyID').find('[role="option"][aria-selected="true"]').text(), 'Gotham County');
        assert.equal(wrapper.find('#cityID').find('[role="option"][aria-selected="true"]').text(), 'Gotham');
        assert.equal(wrapper.find('#teamID').find('[role="option"][aria-selected="true"]').text(), 'Springfield Isotopes');
      });
      it('should clear related selects (County, City, Team) when conditional select (State) changed', function () {
        wrapper.instance().onChangeSelect(1, multiSelects.selects[1].options['Mypos-value'][2]);
        const expectedAnnotationValue = [
          { value: 'Mypos-value', option: true },
          { value: 'Shire-value', option: true },
          { value: null, option: false },
          { value: null, option: false },
          { value: null, option: false }
        ];
        assert.deepEqual(annotation.value[0], expectedAnnotationValue[0]);
        assert.deepEqual(annotation.value[1], expectedAnnotationValue[1]);
        assert.deepEqual(annotation.value[2], expectedAnnotationValue[2]);
        assert.deepEqual(annotation.value[3], expectedAnnotationValue[3]);
        assert.deepEqual(annotation.value[4], expectedAnnotationValue[4]);
      });
    });

    describe('and all annotations provided, including custom answers,', function () {
      let annotation;
      let wrapper;
      const { multiSelects } = getMockTasks();

      beforeEach(function () {
        annotation = { value: [
          { value: 'Canada-value', option: true },
          { value: 'QC', option: true },
          { value: 'Laval', option: false },
          { value: null, option: false },
          { value: 'Rocket', option: false }
        ] };

        wrapper = mount(<DropdownTask task={multiSelects} translation={multiSelects} annotation={annotation} onChange={function (a) { return a; }} />, mockReduxStore);
      });

      it('should have the supplied annotations selected', function () {
        assert.equal(wrapper.find('#countryID').find('[role="option"][aria-selected="true"]').text(), 'Canada');
        assert.equal(wrapper.find('#stateID').find('[role="option"][aria-selected="true"]').text(), 'Quebec');
        assert.equal(wrapper.find('#countyID').find('[role="option"][aria-selected="true"]').text(), 'Laval');
        assert.equal(wrapper.find('#teamID').find('[role="option"][aria-selected="true"]').text(), 'Rocket');
      });
      it('should clear related selects (County, City, Team) when conditional select (State) changed', function () {
        wrapper.instance().onChangeSelect(1, multiSelects.selects[1].options['Canada-value'][1]);
        const expectedAnnotationValue = [
          { value: 'Canada-value', option: true },
          { value: 'ON', option: true },
          { value: null, option: false },
          { value: null, option: false },
          { value: null, option: false }
        ];
        assert.deepEqual(annotation.value[0], expectedAnnotationValue[0]);
        assert.deepEqual(annotation.value[1], expectedAnnotationValue[1]);
        assert.deepEqual(annotation.value[2], expectedAnnotationValue[2]);
        assert.deepEqual(annotation.value[3], expectedAnnotationValue[3]);
        assert.deepEqual(annotation.value[4], expectedAnnotationValue[4]);
      });
    });

    describe('and component updated', function () {
      let onChangeSpy
      let wrapper
      const { singleSelect, multiSelects } = getMockTasks();

      before(function () {
        const annotation1 = { value: [] };
        const annotation2 = { value: [] };
        onChangeSpy = sinon.spy();

        wrapper = mount(<DropdownTask task={multiSelects} translation={multiSelects} annotation={annotation1} onChange={onChangeSpy} />, mockReduxStore);
        wrapper.setProps({ task: singleSelect, annotation: annotation2 });
      })

      it('should render all selects', function () {
        const renderedSelects = wrapper.find(Select);
        assert.equal(renderedSelects.length, singleSelect.selects.length);
      });

      it('should have an annotation with values equal in length to the number of selects', function () {
        // first call on mount should set first task's default values, second call on update should be to set second task's default values
        const newAnnotation = onChangeSpy.secondCall.args[0];
        assert.equal(newAnnotation.value.length, singleSelect.selects.length);
      });

      it('should have an annotation reflecting nothing selected', function () {
        // first call on mount should set first task's default values, second call on update should be to set second task's default values
        const newAnnotation = onChangeSpy.secondCall.args[0];
        newAnnotation.value.forEach((annotationValue) => {
          const { option, value } = annotationValue;
          assert.equal(value, null);
          assert.equal(option, false);
        });
      });
    });
  });
});
