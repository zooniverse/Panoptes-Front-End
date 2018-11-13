import { shallow, mount } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import SurveyTask from './';
import Choice from './choice';
import Chooser from './chooser';
import { workflow } from '../../../pages/dev-classifier/mock-data';

describe('Survey Task', function () {
  const annotation = { value: [] };
  const task = workflow.tasks.survey;
  const onChangeSpy = sinon.spy();
  let wrapper;

  beforeEach(function () {
    wrapper = mount(<SurveyTask translation={task} task={task} annotation={annotation} />);
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
      wrapper = mount(
        <SurveyTask
          annotation={annotation}
          onChange={onChangeSpy}
          translation={task}
          task={task}
        />
      );
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

    it('should call handleAnnotation', function() {
      wrapper.setState({ selectedChoiceID: 'ar' });
      let choice = wrapper.find(Choice);
      choice.props().onConfirm();
      expect(onChangeSpy.calledOnce).to.be.true;
    });

    it('should call handleRemove', function() {
      let chooser = wrapper.find(Chooser);
      console.log(chooser.props().onRemove());
      // expect(onChangeSpy.calledOnce).to.be.true;
    });

    it('should call handleChoice', function() {
      wrapper.instance().handleChoice();
      // expect(onChangeSpy.calledOnce).to.be.true;
    });

    // describe('handleFilter', function () {
    //   it('should add the correct filter', function() {
    //     console.log("HERE");
    //     wrapper.instance().handleFilter('aa', 'bb');
    //     console.log(wrapper.state());
    //   });
    //
    //   it('should remove filters', function() {
    //     wrapper.instance().handleFilter('aa', undefined);
    //     console.log(wrapper.state());
    //   })
    // });
  });

  describe('functions', function() {
    let wrapper = shallow(
      <SurveyTask
        annotation={annotation}
        onChange={onChangeSpy}
        translation={task}
        task={task}
      />
    );

    describe('handleFilter', function () {
      it('should add the correct filter', function() {
        //const clearTimeoutSpy = sinon.spy(clock, 'setTimeout');
        // const setStateSpy = sinon.spy(SurveyTask.prototype, 'setState');
        wrapper.instance().handleFilter('aa', 'bb');
        const clock = sinon.useFakeTimers();
        clock.tick(2000);
        wrapper.update();
        // expect(setStateSpy.calledOnce).to.equal(true);
        console.log(wrapper.state());
      });
      //
      // it('should remove filters', function() {
      //   wrapper.instance().handleFilter('aa', undefined);
      //   console.log(wrapper.state());
      // })
    });
  });

  describe('static methods', function () {
    it('should correctly return isAnnotationComplete', function() {
      const isComplete = SurveyTask.isAnnotationComplete(task, annotation);
      expect(isComplete).to.be.a('boolean');
      expect(isComplete).to.be.true;
    });

    it('should correctly return a default annotation', function() {
      const defaultAnnotation = SurveyTask.getDefaultAnnotation();
      expect(defaultAnnotation).to.be.an('object');
      expect(defaultAnnotation.value.length, 0).to.be.equal;
    });

    it('should return the correct value from getTaskText', function() {
      const taskText = SurveyTask.getTaskText(task);
      expect(taskText).to.be.a('string');
    });

    it('should correctly return a default task', function() {
      const defaultTask = SurveyTask.getDefaultTask(task);
      expect(defaultTask).to.be.an('object');
    });
  });
});
