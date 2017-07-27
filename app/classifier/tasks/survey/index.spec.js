import { mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import SurveyTask from './';
import Choice from './choice';
import { workflow } from '../../../pages/dev-classifier/mock-data';

describe('Survey Task', function(){
  let annotation = { value: [] };
  const task = workflow.tasks.survey
  let wrapper;

  beforeEach(function(){
    wrapper = mount(<SurveyTask task={task} annotation={annotation} />);
  });

  it(`should render a survey task`, function(){
    assert.equal(wrapper.prop('task'), task);
  });

  annotation = { 
    value: [{
      "choice": "ar",
      "answers": {
        "ho": "two",
        "be": [
          "ea"
        ]
      },
      "filters": {}
    }]
  };

  it(`should render a valid annotation as a selected choice`, function(){
    wrapper.setProps({ annotation });
    wrapper.update();
    const selectedChoice = wrapper.find('[data-choiceID="ar"]');
    assert.equal(selectedChoice.prop('className'), 'survey-task-chooser-choice-button survey-task-chooser-choice-button-chosen');
  });

  it('should render the Choice component when a choice is selected', function(){
    wrapper.setState({ selectedChoiceID: 'ar' });
    const choice = wrapper.find(Choice);
    assert.equal(choice.props().choiceID, 'ar');
  });

  it('should pass existing answers to the Choice component', function(){
    wrapper.setState({ selectedChoiceID: 'ar' });
    const choice = wrapper.find(Choice);
    assert.equal(choice.props().annotationValue, annotation.value[0]);
  });
  
  it('should reset saved choices when the annotation resets', function(){
    annotation = { value: [] };
    wrapper.setState({ selectedChoiceID: 'ar' });
    wrapper.setProps({ annotation });
    wrapper.update();
    const choice = wrapper.find(Choice);
    assert.equal(choice.props().annotationValue.answers.ho, undefined);
  });
})