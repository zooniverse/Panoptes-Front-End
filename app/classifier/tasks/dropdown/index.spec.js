import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import DropdownTask from './';

const task = {
  instruction: 'Is there something here?',
  selects: [{
    id: 'numbers',
    title: 'Numbers',
    options: {
      '*': [
        {label: 'One', value: 1},
        {label: 'Two', value: 2},
        {label: 'Three', value: 3}
      ]
    },
    required: true
  }]
};

const annotation = {
  value: [{option: true, value: 3}]
};

describe('DropdownTask', function () {
  let wrapper;

  beforeEach(function () {
    wrapper = mount(<DropdownTask task={task} annotation={annotation} onChange={function(a) {return a;} } />);
  });

  it('should render without crashing', function () {
  });

  it('should have a question', function () {
    const question = wrapper.find('.question');
    assert.equal(question.length, 1);
  });

  it('should have the supplied annotation selected', function(){
    assert.equal(wrapper.find('[role="option"][aria-selected="true"]').text(), 'Three');
  });
  
  it('should update the annotation on change', function(){
    wrapper.instance().onChangeSelect(0, task.selects[0].options['*'][0]);
    const {option, value} = annotation.value[0];
    assert.equal(value, 1);
    assert.equal(option, true);
  });

  describe('static methods', function(){
    it('should be complete', function(){
      assert.equal(DropdownTask.isAnnotationComplete(task, annotation), true);
    });

    it('should have the correct question text', function(){
      assert.equal(DropdownTask.getTaskText(task), task.instruction);
    });

    it('the default annotation should be an empty array', function(){
      assert.equal(DropdownTask.getDefaultAnnotation().value.length, 0);
    });
  });

});
