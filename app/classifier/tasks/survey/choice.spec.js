import { shallow } from 'enzyme';
import assert from 'assert';
import React from 'react';
import Choice from './choice';
import { workflow } from '../../../pages/dev-classifier/mock-data';

const task = workflow.tasks.survey;
const annotation = {
  task: 'survey',
  value: [{
    choice: 'ar',
    answers: {
      ho: 'two',
      be: [
        'mo',
        'ea'
      ]
    },
    filters: {}
  }]
};

describe('Choice', function () {
  
  describe('with single answer questions', function () {
    before(function () {
      let wrapper = shallow(<Choice translation={task} task={task} annotation={annotation} choiceID='ar' />)
    });
    it('should render radio buttons for answers', function () {
      
    });
    it('should render the chosen answer as checked', function () {
      
    });
    it('should clear the chosen answer on click', function () {
      
    });
    it('should clear the chosen answer on space', function () {
      
    });
    it('should clear the chosen answer on backspace', function () {
      
    });
    it('should not clear the chosen answer on any other key press', function () {
      
    });
  })
});
