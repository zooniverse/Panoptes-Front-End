/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { shallow, mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import MobileSection from './mobile-section';

const DEFAULT_TASK = {
  question: 'What is it',
  type: 'single',
  answers: [
    { label: 'Yes' },
    { label: 'No' },
  ],
};

const DEFAULT_WORKFLOW = {
  tasks: {
    T0: {
      answers: [
        { label: 'Yes' },
        { label: 'No' },
      ],
    },
  },
  configuration: {}
};

const DEFAULT_PROJECT = {
  id: '123213',
  launch_approved: true,
};

function createElements(task = DEFAULT_TASK, workflow = DEFAULT_WORKFLOW, project = DEFAULT_PROJECT) {
  const newWrapper = mount(<MobileSection task={task} workflow={workflow} project={project} />);
  const newCheckbox = newWrapper.find('input');
  return {
    wrapper: newWrapper, 
    checkbox: newCheckbox,
  };
}

function modifyFixture(original, diff) {
  return Object.assign({}, original, diff);
}

describe('<MobileSection />:', function () {

  let wrapper = null;
  let checkbox = null;

  describe('rendering: ', function () {

    it('should render for valid (single and multiple) task types', function () {
      ({ wrapper } = createElements());
      assert.ok(wrapper.children().length > 0);
      
      const multipleTask = modifyFixture(DEFAULT_TASK, { type: 'multiple' });
      ({ wrapper } = createElements(multipleTask));
      assert.ok(wrapper.children().length > 0);
    });

    it('should not render for invalid task types', function () {
      const drawingTask = modifyFixture(DEFAULT_TASK, { type: 'drawing' });
      ({ wrapper } = createElements(drawingTask));
      assert.strictEqual(wrapper.children().length, 0);
    })

  });

  describe('checkbox:', function () {

    it('should exist', function () {
      ({ checkbox } = createElements());
      assert.strictEqual(checkbox.length, 1);
    });

    it('should have a label', function () {
      ({ wrapper } = createElements());
      const textContent = wrapper.find('label').first();
      assert.strictEqual(textContent.text(), ' Enable on mobile app');
    });

    describe('behaviour for valid projects:', function () {

      it('should be unchecked by default', function () {
        ({ checkbox } = createElements());
        assert.strictEqual(checkbox.props().checked, false);
      });
      
      it('should call toggleShortcut when checked', function () {
        ({ wrapper, checkbox } = createElements());
        const toggleStub = sinon.stub(wrapper.instance(), 'toggleSwipeEnabled');
        wrapper.update();
        checkbox.simulate('change');
        sinon.assert.called(toggleStub);
      });

      it('should be enabled for single tasks', function () {
        ({ checkbox } = createElements());
        assert.strictEqual(checkbox.props().disabled, false);
      });

      it('should be enabled for multiple tasks', function () {
        const multipleTask = modifyFixture(DEFAULT_TASK, {
          type: 'multiple',
          answers: [
            { label: 'Yes' },
            { label: 'No' },
          ],
        });
        ({ checkbox } = createElements(multipleTask));
        assert.strictEqual(checkbox.props().disabled, false);
      });
      
      it('should be enabled for tasks with two shortcut answers', function () {
        const shortcutTask = modifyFixture(DEFAULT_TASK, { unlinkedTask: 'T1' });
        const shortcutWorkflow = modifyFixture(DEFAULT_WORKFLOW, {
          tasks: {
            T0: {
              type: 'single',
              answers: [
                { label: 'Yes' },
                { label: 'No' }
              ]
            },
            T1: {
              type: 'single',
              answers: [
                { label: 'Nothing here' },
                { label: 'Too many clouds' }
              ],
              type: 'shortcut'
            }
          },
        });

        ({ checkbox } = createElements(shortcutTask, shortcutWorkflow));
        assert.strictEqual(checkbox.props().disabled, false);
      });

    });

    describe('behaviour for invalid projects:', function () {

      it('should be disabled for tasks with more than two answers', function () {
        const threeAnswerTask = modifyFixture(DEFAULT_TASK, {
          answers: [
            { label: 'Yes' },
            { label: 'No' },
            { label: 'Maybe' },
          ],
        });

        ({ checkbox } = createElements(threeAnswerTask));
        assert.strictEqual(checkbox.props().disabled, true);
      });

      it('should be disabled for tasks with more than two shortcut answers', function () {
        const shortcutTask = modifyFixture(DEFAULT_TASK, { unlinkedTask: 'T1' });
        const tooManyShortcutsWorkflow = modifyFixture(DEFAULT_WORKFLOW, {
          tasks: {
            T0: {
              type: 'single',
              answers: [
                { label: 'Yes' },
                { label: 'No' },
              ],
            },
            T1: {
              type: 'single',
              answers: [
                { label: 'Nothing here' },
                { label: 'Too many clouds' },
                { label: 'Too much water' },
              ],
              type: 'shortcut',
            },
          },
        });

        ({ checkbox } = createElements(shortcutTask, tooManyShortcutsWorkflow));
        assert.strictEqual(checkbox.props().disabled, true);
      });

      it('should be disabled for tasks where the question text is too long', function () {
        const questionTextTooLongTask = modifyFixture(DEFAULT_TASK, {
          question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        });
        ({ checkbox } = createElements(questionTextTooLongTask));
        assert.strictEqual(checkbox.props().disabled, true);
      });

      it('should be disabled for workflows using the flipbook', function () {
        const flipbookWorkflow = modifyFixture(DEFAULT_WORKFLOW, {
          configuration: {
            multi_image_mode: 'flipbook',
          },
        });

        ({ checkbox } = createElements(DEFAULT_TASK, flipbookWorkflow));
        assert.strictEqual(checkbox.props().disabled, true);
      });

      it('should be disabled for workflows using feedback', function () {
        const feedbackTask = modifyFixture(DEFAULT_TASK, {
          feedback: {
            enabled: true,
          },
        });
        ({ checkbox } = createElements(feedbackTask));
        assert.strictEqual(checkbox.props().disabled, true);
      });

      it('should be disabled for workflows with no questions or answers', function () {
        const emptyTask = modifyFixture(DEFAULT_TASK, {
          question: '',
          answers: [],
        });

        const emptyWorkflow = modifyFixture(DEFAULT_WORKFLOW, {
          tasks: {
            T0: {
              answers: [],
            },
          },
        });

        ({ checkbox } = createElements(emptyTask, emptyWorkflow));
        assert.strictEqual(checkbox.props().disabled, true);
      });

    });

  });

});
