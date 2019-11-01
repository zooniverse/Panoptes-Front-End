import { shallow } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';
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
  let answer;

  beforeEach(function () {
    wrapper = shallow(<Choice
      translation={task}
      task={task}
      annotation={annotation}
      annotationValue={annotationValue}
      choiceID='ar'
    />);
    answer = wrapper.find('input[name="ho"][value="two"]');
  });

  describe('with confused with options', function () {
    it('should render the confusions with appropriate labels', function () {
      const confusions = wrapper.find(TriggeredModalForm);
      assert.equal(confusions.length, task.choices['ar'].confusionsOrder.length);
      confusions.forEach(function (confusion, i) {
        const triggerComponent = confusion.prop('trigger')
        assert.equal(triggerComponent.props.children, task.choices[task.choices['ar'].confusionsOrder[i]].label);
      });
    });
  })

  describe('with single answer questions', function () {
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
    it('should not prevent the default keyDown event for checkboxes', function () {
      const checkbox = wrapper.find('input[name="be"][value="mo"]');
      const fakeEvent = {
        which: 32,
        target: {
          type: 'checkbox',
          name: 'be',
          value: 'mo',
          checked: true
        },
        preventDefault: sinon.spy()
      };
      checkbox.simulate('keyDown', fakeEvent);
      assert.equal(fakeEvent.preventDefault.notCalled, true);
    });
  })
});
