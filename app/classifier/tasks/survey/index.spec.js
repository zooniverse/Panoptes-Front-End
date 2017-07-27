import { mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import SurveyTask from './';
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

  it(`should render a valid annotation as a selected choice`, function(){
    let annotation = { 
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
    wrapper.setProps({ annotation });
    wrapper.update();
    const selectedChoice = wrapper.find('[data-choiceID="ar"]');
    assert.equal(selectedChoice.prop('className'), 'survey-task-chooser-choice-button survey-task-chooser-choice-button-chosen');
  });
})