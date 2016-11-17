import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';
import { shallow, render, mount } from 'enzyme';


const testWorkflows = [
  { id: '2342',
    configuration: { level: 1 },
    display_name: 'Beginner Workflow',
  },
  { id: '1234',
    configuration: { level: 2 },
    display_name: 'Intermediate Workflow',
  },
  { id: '4321',
    configuration: { level: 3 },
    display_name: 'Advanced Workflow',
  },
];

const testUserPreferences = {
  settings: { workflow_id: '1234' },
};

describe('ProjectHomeWorkflowButtons', function() {
  let wrapper;

  describe('if workflow assignment is true', function() {
    beforeEach(function () {
      wrapper = mount(
        <ProjectHomeWorkflowButtons activeWorkflows={testWorkflows} preferences={testUserPreferences} showWorkflowButtons={true} workflowAssignment={true} />,
        { context: { user: { id: 1 } } }
      );
    });

    it('should render workflow button options', function() {
      assert.equal(wrapper.find('.standard-button').length, 3);
    });

    it('should disable buttons for levels that user has not reached', function() {
      assert.equal(wrapper.find('.standard-button').last().props().disabled, true);
    });
  });
});
