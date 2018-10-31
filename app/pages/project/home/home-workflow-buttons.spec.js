import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';
import ProjectHomeWorkflowButton from './home-workflow-button';


const testWorkflows = [
  { id: '2342',
    configuration: { level: '1' },
    display_name: 'Beginner Workflow'
  },
  { id: '1234',
    configuration: { level: '2' },
    display_name: 'Intermediate Workflow'
  },
  { id: '4321',
    configuration: { level: '3' },
    display_name: 'Advanced Workflow'
  }
];

const testUserPreferences = {
  settings: { workflow_id: '1234' }
};

describe('ProjectHomeWorkflowButtons', function() {
  let wrapper;

  describe('if workflow assignment is true and props.showWorkflowButtons is true', function() {
    before(function() {
      wrapper = shallow(
        <ProjectHomeWorkflowButtons
          activeWorkflows={testWorkflows}
          preferences={testUserPreferences}
          showWorkflowButtons={true}
          workflowAssignment={true}
          splits={{}}
          user={{ user: { id: 1 }}}
        />,
      );
    });

    it('should render active workflow button options that have a level', function() {
      assert.equal(wrapper.find(ProjectHomeWorkflowButton).length, 3);
    });

    it('should disable the button levels that user has not reached', function() {
      assert.equal(wrapper.find(ProjectHomeWorkflowButton).first().props().disabled, false);
      assert.equal(wrapper.find(ProjectHomeWorkflowButton).at(1).props().disabled, false);
      assert.equal(wrapper.find(ProjectHomeWorkflowButton).last().props().disabled, true);
    });
  });

  describe('if user chooses workflow is enabled for the project', function() {
    it('should render workflow button options', function() {
      wrapper = shallow(
        <ProjectHomeWorkflowButtons activeWorkflows={testWorkflows} showWorkflowButtons={true} />
      );
      assert.equal(wrapper.find(ProjectHomeWorkflowButton).length, 3);
    });
  });

  describe('if user chooses workflow is disabled for the project', function() {
    before(function() {
      wrapper = shallow(
        <ProjectHomeWorkflowButtons activeWorkflows={testWorkflows} showWorkflowButtons={false} />
      );
    });

    it('should not render the workflow buttons', function() {
      assert.equal(wrapper.find(ProjectHomeWorkflowButton).length, 0);
    });
  });
});
