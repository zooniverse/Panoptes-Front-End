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

const annotationValue = {
  answers: Object.assign({}, annotation.value[0].answers)
};

describe('Choice', function () {
  let wrapper;

  describe('with single answer questions', function () {
    before(function () {
      wrapper = shallow(<Choice
        translation={task}
        task={task}
        annotation={annotation}
        annotationValue={annotationValue}
        choiceID='ar'
      />);
    });
    it('should render radio buttons for answers', function () {
      const question = task.questions.ho;
      const answers = wrapper.find('input[name="ho"][type="radio"]');
      assert.equal(Object.keys(question.answers).length, answers.length);
    });
    it('should render the chosen answer as checked', function () {
      const answer = wrapper.find('input[name="ho"][value="two"]');
      assert.equal(answer.props().checked, true);
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
