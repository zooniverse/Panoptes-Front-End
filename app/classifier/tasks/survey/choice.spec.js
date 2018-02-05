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
    beforeEach(function () {
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
      const answer = wrapper.find('input[name="ho"][value="two"]');
      const fakeEvent = {
        target: {
          type: 'radio',
          name: 'ho',
          value: 'two',
          checked: true
        }
      }
      assert.equal(wrapper.state().answers.ho, 'two');
      answer.simulate('click', fakeEvent);
      assert.equal(wrapper.state().answers.ho, undefined);
    });
    it('should clear the chosen answer on space', function () {
      const answer = wrapper.find('input[name="ho"][value="two"]');
      const fakeEvent = {
        which: 32,
        target: {
          type: 'radio',
          name: 'ho',
          value: 'two',
          checked: true
        },
        preventDefault: () => null
      }
      assert.equal(wrapper.state().answers.ho, 'two');
      answer.simulate('keyDown', fakeEvent);
      assert.equal(wrapper.state().answers.ho, undefined);
    });
    it('should clear the chosen answer on backspace', function () {
      const answer = wrapper.find('input[name="ho"][value="two"]');
      const fakeEvent = {
        which: 8,
        target: {
          type: 'radio',
          name: 'ho',
          value: 'two',
          checked: true
        },
        preventDefault: () => null
      }
      assert.equal(wrapper.state().answers.ho, 'two');
      answer.simulate('keyDown', fakeEvent);
      assert.equal(wrapper.state().answers.ho, undefined);
    });
    it('should not clear the chosen answer on any other key press', function () {
      const answer = wrapper.find('input[name="ho"][value="two"]');
      const fakeEvent = {
        which: 9,
        target: {
          type: 'radio',
          name: 'ho',
          value: 'two',
          checked: true
        },
        preventDefault: () => null
      }
      assert.equal(wrapper.state().answers.ho, 'two');
      answer.simulate('keyDown', fakeEvent);
      assert.equal(wrapper.state().answers.ho, 'two');
    });
  })
});
