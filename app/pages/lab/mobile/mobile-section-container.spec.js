/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: 0,
  no-shadow: 0,
  prefer-arrow-callback: 0,
  prefer-const: 0,
  'react/jsx-boolean-value': ['error', 'always'],
  'react/jsx-filename-extension': 0
*/

/* global describe, it, beforeEach, afterEach */

import { shallow, mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import isPlainObject from 'lodash/isPlainObject';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';

import MobileSectionContainer from './mobile-section-container';
import * as fixtures from './mobile-section-container.fixtures';
import { convertBooleanToValidation } from './mobile-validations';

let component;
let wrapper;

function setup() {
  wrapper = shallow(<MobileSectionContainer
    task={fixtures.task()}
    workflow={fixtures.workflow()}
    project={fixtures.project()}
  />);
  component = wrapper.find('MobileSection').first();
}

function tearDown() {
  component = null;
  wrapper = null;
}

describe('<MobileSectionContainer />', function () {
  describe('rendering', function () {
    beforeEach(setup);
    afterEach(tearDown);

    it('should render without crashing', function () {
      shallow(<MobileSectionContainer task={fixtures.task()} workflow={fixtures.workflow()} project={fixtures.project()} />);
    });

    it('should render the <MobileSection /> component if the task type is single', function () {
      assert.strictEqual(component.length, 1);
    });

    it('should render the <MobileSection /> component if the task type is multiple', function () {
      const task = fixtures.task({ type: 'multiple' });
      wrapper = shallow(<MobileSectionContainer task={task} workflow={fixtures.workflow()} project={fixtures.project()} />);
      const mobileSection = wrapper.find('MobileSection').first();
      assert.strictEqual(mobileSection.length, 1);
    });

    it('should render nothing if the task type isn\'t single or multiple or drawing', function () {
      const task = fixtures.task({ type: 'survey' });
      wrapper = shallow(<MobileSectionContainer task={task} workflow={fixtures.workflow()} project={fixtures.project()} />);
      assert.strictEqual(wrapper.type(), null);
    });
  });

  describe('validations prop', function () {
    afterEach(tearDown);

    const { validationFixtures } = fixtures;

    it('should be passed to MobileSection', function () {
      wrapper = shallow(<MobileSectionContainer task={fixtures.task()} workflow={fixtures.workflow()} project={fixtures.project()} />);
      component = wrapper.find('MobileSection').first();
      const { validations } = component.props();
      assert.strictEqual(isPlainObject(validations), true);
    });

    function testValidationProp(name, props = {}, expectedResult = true, asWarning = false) {
      const task = fixtures.task(props.task);
      const workflow = fixtures.workflow(props.workflow);
      const project = fixtures.project({
        mobile_friendly: expectedResult
      }, props.project);

      let wrapper = mount(<MobileSectionContainer
        project={project}
        task={task}
        workflow={workflow}
      />);
      let component = wrapper.find('MobileSection').first();
      let validationToTest = component.props().validations[name];

      assert.strictEqual(validationToTest, convertBooleanToValidation(expectedResult, asWarning));
    }

    it('should check whether the task question text is too long', function () {
      testValidationProp('taskQuestionNotTooLong');
      testValidationProp('taskQuestionNotTooLong', validationFixtures.taskQuestionTooLong, false);
    });

    it('should check whether the task uses feedback', function () {
      testValidationProp('taskFeedbackDisabled');
      testValidationProp('taskFeedbackDisabled', validationFixtures.taskFeedbackEnabled, false);
    });

    it('should check whether the workflow has a single task', function () {
      testValidationProp('workflowHasSingleTask');
      testValidationProp('workflowHasSingleTask', validationFixtures.workflowHasMultipleTasks, false);
    });

    it('should check whether the workflow has unlinked tasks with more than two answers', function () {
      testValidationProp('workflowNotTooManyShortcuts');
      testValidationProp('workflowNotTooManyShortcuts', validationFixtures.workflowTooManyShortcuts, false);
    });

    it('should check whether workflow has correct drawing task type', function () {
      testValidationProp('drawingToolTypeIsValid', validationFixtures.workflowHasValidDrawingTask, true);
      testValidationProp('drawingToolTypeIsValid', validationFixtures.workflowHasInvalidDrawingTask, false);
    });

    it('should check whether workflow has only one tool', function () {
      testValidationProp('drawingTaskHasOneTool', validationFixtures.drawingTaskHasOneTool, true);
      testValidationProp('drawingTaskHasOneTool', validationFixtures.drawingTaskHasTwoTools, false);
    });

    it('should check whether workflow has no subtasks', function () {
      testValidationProp('drawingTaskHasNoSubtasks', validationFixtures.drawingTaskHasNoSubtasks, true);
      testValidationProp('drawingTaskHasNoSubtasks', validationFixtures.drawingTaskHasSubtasks, false);
    });

    it('should check whether workflow question has one image', function () {
      testValidationProp('workflowQuestionHasOneOrLessImages', validationFixtures.questionHasOneImage, true, true);
      testValidationProp('workflowQuestionHasOneOrLessImages', validationFixtures.questionHasTwoImages, false, true);
    });
  });

  describe('enabled prop', function () {
    beforeEach(setup);
    afterEach(tearDown);

    it('should be passed to MobileSection', function () {
      assert.ok(isBoolean(component.props().enabled));
    });

    it('should equal true if all the validations are met', function () {
      assert.strictEqual(component.props().enabled, true);
    });

    it('should equal false if any of the validations aren\'t met', function () {
      [
        fixtures.validationFixtures.taskQuestionTooLong,
        fixtures.validationFixtures.taskFeedbackEnabled,
        fixtures.validationFixtures.workflowHasMultipleTasks,
        fixtures.validationFixtures.workflowTooManyShortcuts
      ].map(function (invalidProp) {
        const task = fixtures.task(invalidProp.task);
        const workflow = fixtures.workflow(invalidProp.workflow);
        const project = fixtures.project({
          mobile_friendly: false
        });

        let wrapper = mount(<MobileSectionContainer
          project={project}
          task={task}
          workflow={workflow}
        />);
        let component = wrapper.find('MobileSection').first();
        assert.strictEqual(component.props().enabled, false);
      });
    });
  });

  describe('checked prop', function () {
    beforeEach(setup);
    afterEach(tearDown);

    it('should be passed to MobileSection', function () {
      assert.ok(isBoolean(component.props().checked));
    });

    it('should equal true if the workflow has swipe enabled and mobile_friendly true', function () {
      const { checked } = component.props();
      assert.strictEqual(checked, true);
    });

    it('should equal false if the workflow has mobile_friendly false', function () {
      const workflow = fixtures.workflow({ mobile_friendly: false });
      wrapper = shallow(<MobileSectionContainer task={fixtures.task()} workflow={workflow} project={fixtures.project()} />);
      component = wrapper.find('MobileSection').first();
      const { checked } = component.props();
      assert.strictEqual(checked, false);
    });

    it('should equal false if the workflow has changed is and no longer valid', function () {
      let { checked } = component.props();
      assert.strictEqual(checked, true);

      const badTask = fixtures.task(fixtures.validationFixtures.taskQuestionTooLong.task);
      wrapper.setProps({ task: badTask });
      component = wrapper.find('MobileSection').first();
      checked = component.props().checked;
      assert.strictEqual(checked, false);
    });
  });

  describe('toggleChecked prop', function () {
    beforeEach(setup);
    afterEach(tearDown);

    it('should be passed to MobileSection', function () {
      assert.ok(isFunction(component.props().toggleChecked));
    });

    it('should toggle the checked prop when called', function (done) {
      let wrapper = mount(<MobileSectionContainer
        project={fixtures.project()}
        task={fixtures.task()}
        workflow={fixtures.workflow()}
      />);
      let component = wrapper.find('MobileSection').first();

      assert.strictEqual(component.props().enabled, true);

      component.props().toggleChecked()
        .then(function () {
          wrapper.instance().forceUpdate();
          wrapper.update();
          component = wrapper.find('MobileSection').first();
          assert.strictEqual(component.props().checked, false);
          done();
        });
    });
  });

  describe('resource updating', function () {
    it('should update the original workflow props when toggling enabled', function (done) {
      let wrapper = mount(<MobileSectionContainer
        project={fixtures.project()}
        task={fixtures.task()}
        workflow={fixtures.workflow()}
      />);
      let component = wrapper.find('MobileSection').first();

      component.props().toggleChecked()
        .then(function () {
          wrapper.update();
          const workflow = wrapper.props().workflow;
          assert.strictEqual(workflow.mobile_friendly, false);
        })
        .then(function () {
          return component.props().toggleChecked();
        })
        .then(function () {
          wrapper.update();
          const workflow = wrapper.props().workflow;
          assert.strictEqual(workflow.mobile_friendly, true);
          done();
        });
    });

    it('should update the project resource if there\'s a mobile friendly workflow', function (done) {
      const workflow = fixtures.workflow();
      const project = fixtures.project({
        get() { return [workflow]; }
      });
      let wrapper = mount(<MobileSectionContainer
        project={project}
        task={fixtures.task()}
        workflow={workflow}
      />);
      let component = wrapper.find('MobileSection').first();
      component.props().toggleChecked()
        .then(function () {
          wrapper.update();
          assert.strictEqual(wrapper.props().project.mobile_friendly, false);
        })
        .then(function () {
          return component.props().toggleChecked();
        })
        .then(function () {
          wrapper.update();
          assert.strictEqual(wrapper.props().project.mobile_friendly, true);
          done();
        });
    });
  });
});
