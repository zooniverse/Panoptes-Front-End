/* eslint 
  prefer-arrow-callback: 0, 
  func-names: 0, 
  'react/jsx-boolean-value': ['error', 'always'], 
  'react/jsx-filename-extension': 0 
*/

/* global describe, it */

import MobileSectionContainer from './mobile-section-container';
import { shallow, mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import * as fixtures from './mobile-section-container.fixtures';
import isArray from 'lodash/isArray';
import merge from 'lodash/merge';

let component;
let wrapper;

describe('<MobileSectionContainer />', function () {

  describe('rendering', function () {

    it('should render without crashing', function () {
      shallow(<MobileSectionContainer task={fixtures.defaultTask} workflow={fixtures.defaultWorkflow} />);
    });

    it('should render the <MobileSection /> component if the task type is single or multiple', function () {
      wrapper = shallow(<MobileSectionContainer task={fixtures.defaultTask} workflow={fixtures.defaultWorkflow} />);
      component = wrapper.find('MobileSection');
      assert.strictEqual(component.length, 1);
    });

    it('should render nothing if the task type isn\'t single or multiple', function () {
      const task = fixtures.createTask({ type: 'drawing' });
      wrapper = shallow(<MobileSectionContainer task={task} workflow={fixtures.defaultWorkflow} />);
      assert.strictEqual(wrapper.type(), null);
    });

  });

  describe('validations', function () {

    it('should pass a validations prop to MobileSection', function () {
      wrapper = shallow(<MobileSectionContainer task={fixtures.defaultTask} workflow={fixtures.defaultWorkflow} />);
      component = wrapper.find('MobileSection').first();
      assert(component.props().validations);
    });

    function testValidationProp(name, props = {}, expectedResult = true) {
      let testProps = merge({}, {
        task: fixtures.defaultTask,
        workflow: fixtures.defaultWorkflow,
      }, props);

      let wrapper = mount(<MobileSectionContainer {...testProps} />);
      let component = wrapper.find('MobileSection').first();
      let validationToTest = component.props().validations[name];
      
      assert.strictEqual(validationToTest.value, expectedResult);
    }

    it('should check whether the task question text is too long', function () {
      const invalidProps = { 
        task: { 
          question: fixtures.longQuestion 
        },
      };

      testValidationProp('questionNotTooLong');
      testValidationProp('questionNotTooLong', invalidProps, false);
    });

    it('should check whether the task has two answers', function () {
      const invalidProps = { 
        task: { 
          answers: fixtures.threeAnswers 
        },
      };

      testValidationProp('taskHasTwoAnswers');
      testValidationProp('taskHasTwoAnswers', invalidProps, false);
    });

    it('should check whether the task uses feedback', function () {
      const invalidProps = { 
        task: { 
          feedback: { 
            enabled: true,
          },
        },
      };

      testValidationProp('taskFeedbackDisabled');
      testValidationProp('taskFeedbackDisabled', invalidProps, false);
    });

    it('should check whether the workflow uses the flipbook', function () {
      const invalidProps = { 
        workflow: { 
          configuration: { 
            multi_image_mode: 'flipbook',
          },
        },
      };

      testValidationProp('workflowFlipbookDisabled');
      testValidationProp('workflowFlipbookDisabled', invalidProps, false);
    });

    it('should check whether the workflow has a single task', function () {
      const invalidProps = { 
        workflow: { 
          tasks: {
            T1: {},
          },
        },
      };

      testValidationProp('workflowHasSingleTask');
      testValidationProp('workflowHasSingleTask', invalidProps, false);
    });

    it('should check whether the workflow has unlinked tasks with more than two answers', function () {
      const invalidProps = { 
        task: {
          unlinkedTask: 'T1'
        },
        workflow: { 
          tasks: {
            T1: {
              answers: [
                { label: 'Nothing here' },
                { label: 'Too many clouds' },
                { label: 'Too much water' }
              ],
              type: 'shortcut'
            }
          }
        }
      };

      testValidationProp('workflowNotTooManyShortcuts');
      testValidationProp('workflowNotTooManyShortcuts', invalidProps, false);
    });

  });

});
