/* eslint-disable func-names, prefer-arrow-callback */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import Select from 'react-select'; // required to properly simulate change, see allowCreate related testing
import DropdownTask from './';

const task = {
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

describe('DropdownTask:static methods', function () {
  it('should have the correct question text', function () {
    assert.equal(DropdownTask.getTaskText(task), task.instruction);
  });

  it('the default annotation should be an empty array', function () {
    assert.equal(DropdownTask.getDefaultAnnotation().value.length, 0);
  });

  it('should not be complete if required and unanswered', function () {
    task.selects[0].required = true;
    const annotation = { value: [] };
    assert.equal(DropdownTask.isAnnotationComplete(task, annotation), false);
  });

  it('should not be complete if required and answer cleared', function () {
    task.selects[0].required = true;
    const annotation = { value: [{ value: null, option: false }] };
    assert.equal(DropdownTask.isAnnotationComplete(task, annotation), false);
  });

  it('should be complete if required and answered with option provided', function () {
    task.selects[0].required = true;
    const annotation = { value: [{ option: true, value: 3 }] };
    assert.equal(DropdownTask.isAnnotationComplete(task, annotation), true);
  });

  it('should be complete if not required', function () {
    task.selects[0].required = false;
    const annotation = { value: [] };
    assert.equal(DropdownTask.isAnnotationComplete(task, annotation), true);
  });
});

describe('DropdownTask:annotation not provided', function () {
  const annotation = { value: [] };

  const wrapper = mount(<DropdownTask task={task} annotation={annotation} onChange={function (a) { return a; }} />);

  it('should render without crashing', function () {
  });

  it('should have a question', function () {
    const question = wrapper.find('.question');
    assert.equal(question.length, 1);
  });

  it('should have an annotation reflecting nothing selected', function () {
    const { option, value } = annotation.value[0];
    assert.equal(value, null);
    assert.equal(option, false);
  });

  it('should update the annotation on change', function () {
    wrapper.instance().onChangeSelect(0, task.selects[0].options['*'][0]);
    const { option, value } = annotation.value[0];
    assert.equal(value, 1);
    assert.equal(option, true);
  });
});

describe('DropdownTask:annotation provided', function () {
  describe('and included as an option', function () {
    const annotation = {
      value: [{ option: true, value: 3 }]
    };

    const wrapper = mount(<DropdownTask task={task} annotation={annotation} onChange={function (a) { return a; }} />);

    it('should have the supplied annotation selected', function () {
      assert.equal(wrapper.find('[role="option"][aria-selected="true"]').text(), 'Three');
    });

    it('should update the annotation on change', function () {
      wrapper.instance().onChangeSelect(0, task.selects[0].options['*'][0]);
      const { option, value } = annotation.value[0];
      assert.equal(value, 1);
      assert.equal(option, true);
    });
  });

  describe('and not included as an option', function () {
    const annotation = {
      value: [{ option: false, value: 'Four' }]
    };

    const wrapper = mount(<DropdownTask task={task} annotation={annotation} onChange={function (a) { return a; }} />);

    it('should have the supplied annotation selected', function () {
      assert.equal(wrapper.find('[role="option"][aria-selected="true"]').text(), 'Four');
    });

    it('should update the annotation on change', function () {
      wrapper.instance().onChangeSelect(0, task.selects[0].options['*'][0]);
      const { option, value } = annotation.value[0];
      assert.equal(value, 1);
      assert.equal(option, true);
    });
  });
});

describe('DropdownTask:allowCreate true', function () {
  const annotation = { value: [] };

  it('should save custom answer to annotation, with option false', function () {
    task.selects[0].allowCreate = true;
    const wrapper = mount(<DropdownTask task={task} annotation={annotation} onChange={function (a) { return a; }} />);
    const select = wrapper.find(Select);
    const selectInput = select.find('input');
    selectInput.simulate('change', { target: { value: 'Four' }});
    selectInput.simulate('keyDown', { keyCode: 13, which: 13, key: 'Enter' });
    const { option, value } = annotation.value[0];
    assert.equal(value, 'Four');
    assert.equal(option, false);
  });
});

describe('DropdownTask:allowCreate false', function () {
  const annotation = { value: [] };

  it('should NOT save custom answer to annotation', function () {
    task.selects[0].allowCreate = false;
    const wrapper = mount(<DropdownTask task={task} annotation={annotation} onChange={function (a) { return a; }} />);
    const select = wrapper.find(Select);
    const selectInput = select.find('input');
    selectInput.simulate('change', { target: { value: 'Four' }});
    selectInput.simulate('keyDown', { keyCode: 13, which: 13, key: 'Enter' });
    const { option, value } = annotation.value[0];
    assert.equal(value, null);
    assert.equal(option, false);
  });
});
