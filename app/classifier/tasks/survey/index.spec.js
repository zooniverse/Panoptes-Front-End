import { mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import SurveyTask from './';
import Choice from './choice';
import { workflow } from '../../../pages/dev-classifier/mock-data';

describe('Survey Task', function () {
  const annotation = { value: [] };
  const task = workflow.tasks.survey;
  let wrapper;

  beforeEach(function () {
    wrapper = mount(<SurveyTask translation={task} task={task} annotation={annotation} />);
  });

  it('should render a survey task', function () {
    assert.equal(wrapper.prop('task'), task);
  });

  it('should render the Choice component when a choice is selected', function () {
    wrapper.setState({ selectedChoiceID: 'ar' });
    const choice = wrapper.find(Choice);
    assert.equal(choice.props().choiceID, 'ar');
  });

  describe('with an existing annotation', function () {
    const annotation = {
      value: [{
        choice: 'ar',
        answers: {
          ho: 'two',
          be: [
            'ea'
          ]
        },
        filters: {}
      }]
    };
    const task = workflow.tasks.survey;
    let wrapper;

    beforeEach(function () {
      wrapper = mount(<SurveyTask translation={task} task={task} annotation={annotation} />);
    });

    it('should render a valid annotation as a selected choice', function () {
      const selectedChoice = wrapper.find('[data-choiceid="ar"]');
      assert.equal(selectedChoice.prop('className'), 'survey-task-chooser-choice-button survey-task-chooser-choice-button-chosen');
    });

    it('should pass existing answers to the Choice component', function () {
      wrapper.setState({ selectedChoiceID: 'ar' });
      const choice = wrapper.find(Choice);
      assert.equal(choice.props().annotationValue, annotation.value[0]);
    });

    it('should reset saved choices when the annotation resets', function () {
      wrapper.setState({ selectedChoiceID: 'ar' });
      let choice = wrapper.find(Choice);
      assert.equal(choice.props().annotationValue.answers.ho, 'two');
      assert.equal(choice.instance().state.answers.ho, 'two');
      wrapper.setState({ selectedChoiceID: '' });
      wrapper.setProps({ annotation: { value: [] }});
      wrapper.update();
      wrapper.setState({ selectedChoiceID: 'ar' });
      choice = wrapper.find(Choice);
      assert.equal(choice.props().annotationValue.answers.ho, undefined);
      assert.equal(choice.instance().state.answers.ho, undefined);
    });
  });
});
