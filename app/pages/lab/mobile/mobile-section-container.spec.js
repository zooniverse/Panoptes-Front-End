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

    function testValidationProp(name, invalidProps = false) {
      let validationToTest;
      wrapper = mount(<MobileSectionContainer task={fixtures.defaultTask} workflow={fixtures.defaultWorkflow} />);
      component = wrapper.find('MobileSection').first();
      validationToTest = component.props().validations[name];
      
      assert.strictEqual(validationToTest.value, true, `${name} has a value of true with correct data`);

      if (invalidProps) {
        wrapper.setProps(invalidProps);

        component = wrapper.find('MobileSection').first();
        validationToTest = component.props().validations[name];
        
        assert.strictEqual(validationToTest.value, false, `${name} has a value of false with incorrect data`);
      }
    }

    it('should check whether the task question text is too long', function () {
      const invalidProps = { 
        task: fixtures.createTask({ question: fixtures.longQuestion }),
      }
      testValidationProp('questionNotTooLong', invalidProps);
    });

    it('should check whether the task has two answers', function () {
      const invalidProps = { 
        task: fixtures.createTask({ answers: fixtures.threeAnswers }),
      }
      testValidationProp('taskHasTwoAnswers', invalidProps);
    });

    it('should check whether the task uses feedback', function () {
      const invalidProps = { 
        task: fixtures.createTask({ feedback: { enabled: true } }),
      }
      testValidationProp('taskFeedbackDisabled', invalidProps);
    });

    it('should check whether the workflow uses the flipbook', function () {
      const invalidProps = { 
        workflow: fixtures.createWorkflow({ 
          configuration: { 
            multi_image_mode: 'flipbook'
           } 
        }),
      }
      testValidationProp('workflowFlipbookDisabled', invalidProps);
    });

    // hasSingleTask
    // notTooManyShortcuts,

  });

});
