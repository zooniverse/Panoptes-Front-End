/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { shallow, mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import MobileSection from './mobile-section';

const defaultTask = {
  question: 'What is it',
  type: 'single',
  answers: [
    { label: 'Yes' },
    { label: 'No' }
  ]
};

const defaultWorkflow = {
  tasks: {
    T0: {
      answers: [
        { label: 'Yes' },
        { label: 'No' }
      ]
    }
  },
  configuration: {}
};

const defaultProject = {
  id: '123213',
  launch_approved: true,
};

describe('MobileSection', function () {
  describe('rendering', function () {
    let wrapper;

    before(function () {
      wrapper = mount(
        <MobileSection
          task={defaultTask}
          workflow={defaultWorkflow}
          project={defaultProject}
        />
      );
    });

    it('checkbox exists and is not disabled if mobile is available', function () {
      const checkbox = wrapper.find('input');
      assert.strictEqual(checkbox.props().disabled, false);
    });

    it('checkbox is not checked', function () {
      const checkbox = wrapper.find('input');
      assert.strictEqual(checkbox.props().checked, false);
    });

    it('should correctly display a mobile label', function () {
      const textarea = wrapper.find('label').first();
      assert.strictEqual(textarea.text(), ' Enable on mobile app');
    });
  });

  describe('renders when mobile app is enabled', function () {
    let wrapper;

    const mobileEnabledWorkflow = {
      tasks: {
        T0: {
          type: 'single',
          answers: [
            { label: 'Yes' },
            { label: 'No' }
          ]
        }
      },
      configuration: {
        swipe_enabled: true
      }
    };

    before(function () {
      wrapper = mount(<MobileSection
        task={defaultTask}
        workflow={mobileEnabledWorkflow}
        project={defaultProject}
      />);
    });

    it('checkbox is checked if mobile is enabled', function () {
      assert.equal(wrapper.find('input').props().disabled, false);
    });
  });

  describe('executes method when checked', function () {
    let wrapper;

    beforeEach(function () {
      wrapper = mount(<MobileSection
        task={defaultTask}
        workflow={defaultWorkflow}
        project={defaultProject}
      />);
    });

    it('should call toggleShortcut with an input toggle', function () {
      const toggleStub = sinon.stub(wrapper.instance(), 'toggleSwipeEnabled');
      wrapper.update();
      wrapper.find('input').simulate('change');
      sinon.assert.called(toggleStub);
    });
  });

  describe('only renders for questions (single task type)', function () {
    let wrapper;

    const singleTypeTask = {
      question: 'What is it',
      type: 'single',
      answers: [
        { label: 'Yes' },
        { label: 'No' }
      ]
    };

    before(function () {
      wrapper = shallow(<MobileSection
        task={singleTypeTask}
        workflow={defaultWorkflow}
        project={defaultProject}
      />);
    });

    it('does not disable checkbox', function () {
      assert.equal(wrapper.find('input').props().disabled, false);
    });
  });

  describe('only renders for questions (multi task type)', function () {
    let wrapper;

    const multipleTypeTask = {
      question: 'What is it',
      type: 'multiple',
      answers: [
        { label: 'Yes' },
        { label: 'No' }
      ]
    };

    before(function () {
      wrapper = shallow(<MobileSection
        task={multipleTypeTask}
        workflow={defaultWorkflow}
        project={defaultProject}
      />);
    });

    it('does not disable checkbox', function () {
      assert.equal(wrapper.find('input').props().disabled, false);
    });
  });

  describe('does not render for other task types', function () {
    let wrapper;

    const otherTypeTask = {
      question: 'What is it',
      type: 'blurgh',
      answers: [
        { label: 'Yes' },
        { label: 'No' }
      ]
    };

    before(function () {
      wrapper = shallow(<MobileSection
        task={otherTypeTask}
        workflow={defaultWorkflow}
        project={defaultProject}
      />);
    });

    it('should not render for other task type', function () {
      assert.equal(wrapper.html(), null);
    });
  });

  describe('it has more than two answers', function () {
    let wrapper;

    const multiAnswerWorkflow = {
      tasks: {
        T0: {
          type: 'single',
          answers: [
            { label: 'Yes' },
            { label: 'No' },
            { label: 'Maybe' }
          ]
        }
      },
      configuration: {}
    };

    before(function () {
      wrapper = shallow(<MobileSection
        task={defaultTask}
        workflow={multiAnswerWorkflow}
        project={defaultProject}
      />);
    });

    it('checkbox is disabled', function () {
      assert.equal(wrapper.find('input').props().disabled, false);
    });
  });

  describe('with two shortcut answers', function () {
    let wrapper;
    const shortcutTask = {
      question: 'What is it',
      type: 'single',
      unlinkedTask: 'T1',
      answers: [
        { label: 'Yes' },
        { label: 'No' }
      ]
    };
    const workflowWithShortCuts = {
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
      configuration: {}
    };

    before(function () {
      wrapper = shallow(<MobileSection
        task={shortcutTask}
        workflow={workflowWithShortCuts}
        project={defaultProject}
      />);
    });

    it('does not disable checkbox', function () {
      assert.equal(wrapper.find('input').props().disabled, false);
    });
  });

  describe('more than two shortcuts', function () {
    let wrapper;
    const shortcutTask = {
      question: 'What is it',
      type: 'single',
      unlinkedTask: 'T1',
      answers: [
        { label: 'Yes' },
        { label: 'No' }
      ]
    };
    const tooManyShortcutsWorkflow = {
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
            { label: 'Too many clouds' },
            { label: 'Too much water' }
          ],
          type: 'shortcut'
        }
      },
      configuration: {}
    };

    before(function () {
      wrapper = shallow(<MobileSection
        task={shortcutTask}
        workflow={tooManyShortcutsWorkflow}
        project={defaultProject}
      />);
    });

    it('disables checkbox', function () {
      assert.equal(wrapper.find('input').props().disabled, true);
    });
  });

  describe('question is too long', function () {
    let wrapper;
    const questionTooLongTask = {
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      type: 'single',
      answers: [
        { label: 'Yes' },
        { label: 'No' }
      ]
    };

    before(function () {
      wrapper = shallow(<MobileSection
        task={questionTooLongTask}
        workflow={defaultWorkflow}
        project={defaultProject}
      />);
    });

    it('disables checkbox', function () {
      assert.equal(wrapper.find('input').props().disabled, true);
    });
  });

  describe('workflow uses flipbook', function () {
    let wrapper;
    const flipbookWorkflow = {
      tasks: {
        T0: {
          type: 'single',
          answers: [
            { label: 'Yes' },
            { label: 'No' }
          ]
        }
      },
      configuration: {
        multi_image_mode: 'flipbook'
      }
    };

    before(function () {
      wrapper = shallow(<MobileSection
        task={defaultTask}
        workflow={flipbookWorkflow}
        project={defaultProject}
      />);
    });

    it('disables checkbox', function () {
      assert.equal(wrapper.find('input').props().disabled, true);
    });
  });

  describe('workflow uses feedback', function () {
    let wrapper;
    const feedbackWorkflow = {
      tasks: {
        T0: {
          type: 'single',
          answers: [
            { label: 'Yes' },
            { label: 'No' }
          ]
        },
        feedback: {
          enabled: true
        }
      },
      configuration: {}
    };

    before(function () {
      wrapper = shallow(<MobileSection
        task={defaultTask}
        workflow={feedbackWorkflow}
        project={defaultProject}
      />);
    });

    it('disables checkbox', function () {
      assert.equal(wrapper.find('input').props().disabled, true);
    });
  });

  describe('workflow has no question or answers', function () {
    let wrapper;
    const emptyWorkflow = {
      tasks: {
        T0: {
          answers: []
        }
      },
      configuration: {}
    };

    const emptyTask = {
      question: '',
      type: 'single',
      answers: []
    };

    before(function () {
      wrapper = shallow(<MobileSection
        task={emptyTask}
        workflow={emptyWorkflow}
        project={defaultProject}
      />);
    });

    it('disables checkbox', function () {
      assert.equal(wrapper.find('input').props().disabled, true);
    });
  });
});
