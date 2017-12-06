import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';


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

const testProject = {
  redirect: 'www.testproject.com'
};

describe.only('ProjectHomeWorkflowButtons', function() {
  let wrapper;

  describe('if workflow assignment is true and props.showWorkflowButtons is true', function() {
    before(function() {
      wrapper = shallow(
        <ProjectHomeWorkflowButtons
          activeWorkflows={testWorkflows}
          preferences={testUserPreferences}
          showWorkflowButtons={true}
          workflowAssignment={true}
          splits={null}
          user={{ user: { id: 1 }}}
        />,
      );
    });

    it('should render active workflow button options that have a level', function() {
      assert.equal(wrapper.find('ProjectHomeWorkflowButton').length, 3);
    });

    it('should disable the button levels that user has not reached', function() {
      assert.equal(wrapper.find('ProjectHomeWorkflowButton').first().props().disabled, false);
      assert.equal(wrapper.find('ProjectHomeWorkflowButton').at(1).props().disabled, false);
      assert.equal(wrapper.find('ProjectHomeWorkflowButton').last().props().disabled, true);
    });
  });

  describe('if user chooses workflow is enabled for the project', function() {
    it('should render workflow button options', function() {
      wrapper = shallow(
        <ProjectHomeWorkflowButtons activeWorkflows={testWorkflows} showWorkflowButtons={true} />
      );
      assert.equal(wrapper.find('ProjectHomeWorkflowButton').length, 3);
    });
  });

  describe('if user chooses workflow is disabled for the project', function() {
    before(function() {
      wrapper = shallow(
        <ProjectHomeWorkflowButtons activeWorkflows={testWorkflows} showWorkflowButtons={false} />
      );
    });

    it('should render the learn more and get started buttons', function() {
      assert.equal(wrapper.find('.standard-button').length, 2);
    });

    it('should use Translate for the button texts"', function() {
      assert.equal(wrapper.find('Translate').length, 2);
    });

    it('should not render the workflow buttons', function() {
      assert.equal(wrapper.find('ProjectHomeWorkflowButton').length, 0);
    });
  });

  describe('if project has a redirect', function() {
    before(function() {
      wrapper = shallow(
        <ProjectHomeWorkflowButtons project={testProject} />
      );
    });

    it('should render a redirect link', function() {
      assert.equal(wrapper.find('a').length, 1);
    });

    it('should have href equal to project redirect', function() {
      assert.equal(wrapper.find('a').prop('href'), testProject.redirect);
    });
  });
});
