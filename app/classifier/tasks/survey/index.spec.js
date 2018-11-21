import { shallow, mount } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import SurveyTask from './';
import Choice from './choice';
import { workflow } from '../../../pages/dev-classifier/mock-data';

describe('Survey Task', function () {
  const selection = {
    choice: 'ar',
    answers: {
      ho: 'two',
      be: [
        'ea'
      ]
    },
    filters: {}
  };
  const annotation = {
    value: [selection]
  };
  const incompleteAnnotation = {
    _choiceInProgress: true,
    value: []
  };

  const task = workflow.tasks.survey;
  const onChangeSpy = sinon.stub().callsFake(newAnnotation => newAnnotation);
  let wrapper;

  beforeEach(function () {
    wrapper = mount(<SurveyTask translation={task} task={task} annotation={annotation} />);
  });

  afterEach(function () {
    onChangeSpy.resetHistory();
  });

  it('should render a survey task', function () {
    expect(wrapper.prop('task'), task).to.be.equal;
  });

  it('should render the Choice component when a choice is selected', function () {
    wrapper.setState({ selectedChoiceID: 'ar' });
    const choice = wrapper.find(Choice);
    expect(choice.props().choiceID, 'ar').to.be.equal;
  });

  describe('with an existing annotation', function () {
    const task = workflow.tasks.survey;
    let wrapper;

    beforeEach(function () {
      wrapper = mount(
        <SurveyTask
          annotation={annotation}
          onChange={onChangeSpy}
          translation={task}
          task={task}
        />
      );
    });

    afterEach(function () {
      onChangeSpy.resetHistory();
    });
    

    it('should render a valid annotation as a selected choice', function () {
      const selectedChoice = wrapper.find('[data-choiceid="ar"]');
      expect(selectedChoice.prop('className'), 'survey-task-chooser-choice-button survey-task-chooser-choice-button-chosen').to.be.equal;
    });

    it('should pass existing answers to the Choice component', function () {
      wrapper.setState({ selectedChoiceID: 'ar' });
      const choice = wrapper.find(Choice);
      expect(choice.props().annotationValue, annotation.value[0]).to.be.equal;
    });

    it('should reset saved choices when the annotation resets', function () {
      wrapper.setState({ selectedChoiceID: 'ar' });
      let choice = wrapper.find(Choice);
      expect(choice.props().annotationValue.answers.ho, 'two').to.be.equal;
      expect(choice.instance().state.answers.ho, 'two').to.be.equal;
      wrapper.setState({ selectedChoiceID: '' });
      wrapper.setProps({ annotation: { value: [] }});
      wrapper.update();
      wrapper.setState({ selectedChoiceID: 'ar' });
      choice = wrapper.find(Choice);
      expect(choice.props().annotationValue.answers.ho, undefined).to.be.equal;
      expect(choice.instance().state.answers.ho, undefined).to.be.equal;
    });
  });

  describe('functions', function() {
    let clock;
    let wrapper = shallow(
      <SurveyTask
        annotation={annotation}
        onChange={onChangeSpy}
        translation={task}
        task={task}
      />
    );

    before(function () {
      const date = new Date();
      clock = sinon.useFakeTimers(date.getTime());
    });

    describe('handleAnnotation', function () {
      afterEach(function () {
        onChangeSpy.resetHistory();
      });

      it('should call onChange with an annotation', function() {
        wrapper.instance().handleAnnotation(selection.choice, selection.answers);
        expect(onChangeSpy.callCount).to.equal(2);
        const returnValues = onChangeSpy.returnValues[0];
        expect(returnValues, annotation).to.be.equal;
      });

      it('should complete an incomplete annotation', function () {
        wrapper.setProps({ annotation: incompleteAnnotation });
        wrapper.instance().handleAnnotation(selection.choice, selection.answers);
        const newAnnotation = onChangeSpy.returnValues[0];
        expect(newAnnotation._choiceInProgress).to.be.false;
      })
    })

    it('should correctly remove an annotation on handleRemove', function() {
      const currentLength = wrapper.instance().props.annotation.value.length;
      wrapper.instance().handleRemove('ar');
      const newLength = wrapper.instance().props.annotation.value.length;
      expect(currentLength, newLength).to.not.equal;
      expect(newLength).to.equal(0);
    });

    it('handleChoice should set the selected choice', function() {
      wrapper.instance().handleChoice('aa');
      expect(wrapper.instance().state.selectedChoiceID, 'aa').to.be.equal;
    });

    describe('handleFilter', function () {
      it('should add the correct filter', function() {
        const expectedFilter = { aa: 'bb' };
        wrapper.instance().handleFilter('aa', 'bb');
        clock.tick();
        expect(wrapper.state().filters, expectedFilter).to.be.equal;
      });

      it('should remove the correct filter', function () {
        wrapper.instance().handleFilter('aa', undefined);
        clock.tick();
        expect(wrapper.state().filters, {}).to.be.equal;
      });
    });

    after(function () {
      clock.restore();
    });
  });

  describe('static methods', function () {
    it('isAnnotationComplete should return true if annotation is completed', function() {
      const isComplete = SurveyTask.isAnnotationComplete(task, annotation);
      expect(isComplete).to.be.a('boolean');
      expect(isComplete).to.be.true;
    });

    it('isAnnotationComplete should return false if annotation is incomplete', function() {
      const isComplete = SurveyTask.isAnnotationComplete(task, incompleteAnnotation);
      expect(isComplete).to.be.a('boolean');
      expect(isComplete).to.be.false;
    });

    it('default annotation should be an object', function() {
      const defaultAnnotation = SurveyTask.getDefaultAnnotation();
      expect(defaultAnnotation).to.be.an('object');
      expect(defaultAnnotation).to.have.property('value').to.be.an('array');
    });

    it('getTaskText should return a string', function() {
      const taskText = SurveyTask.getTaskText(task);
      expect(taskText).to.be.a('string');
    });

    it('default task should be an object', function() {
      const defaultTask = SurveyTask.getDefaultTask(task);
      expect(defaultTask).to.be.an('object');
      expect(defaultTask).to.have.property('type').to.be.a('string');
      expect(defaultTask).to.have.property('characteristicsOrder').to.be.an('array');
      expect(defaultTask).to.have.property('characteristics').to.be.an('object');
      expect(defaultTask).to.have.property('choicesOrder').to.be.an('array');
      expect(defaultTask).to.have.property('choices').to.be.an('object');
      expect(defaultTask).to.have.property('questionsOrder').to.be.an('array');
      expect(defaultTask).to.have.property('questions').to.be.an('object');
      expect(defaultTask).to.have.property('images').to.be.an('object');
    });
  });
});
