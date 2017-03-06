import React from 'react';
import assert from 'assert';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';
import { render, mount } from 'enzyme';


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
  },
  { id: '6757',
    configuration: { },
    display_name: 'Active, no level workflow'
  }
];

const testUserPreferences = {
  settings: { workflow_id: '1234' }
};

const testProject = {
  redirect: 'www.testproject.com'
};

describe('ProjectHomeWorkflowButtons', function() {
  let wrapper;

  describe('if workflow assignment is true', function() {
    beforeEach(function () {
      wrapper = mount(
        <ProjectHomeWorkflowButtons activeWorkflows={testWorkflows} preferences={testUserPreferences} showWorkflowButtons={true} workflowAssignment={true} splits={null} />,
        { context: { user: { id: 1 } } }
      );
      wrapper.setState({ showWorkflows: true });
    });

    it('should render active workflow button options that have a level', function() {
      assert.equal(wrapper.find('.standard-button').length, 5);
    });

    it('should render spans for levels that user has not reached', function() {
      assert.equal(wrapper.find('.standard-button').last().matchesElement(
        <span>Advanced Workflow</span>
      ), true);
    });
  });

  describe('if user chooses workflow assignment', function() {
    beforeEach(function () {
      wrapper = mount(
        <ProjectHomeWorkflowButtons activeWorkflows={testWorkflows} showWorkflowButtons={true} />
      );
      wrapper.setState({ showWorkflows: true });
    });

    it('should render workflow button options', function() {
      assert.equal(wrapper.find('.standard-button').length, 6);
    });
  });

  describe('if user cannot choose workflow assignment', function() {
    beforeEach(function () {
      wrapper = render(
        <ProjectHomeWorkflowButtons activeWorkflows={testWorkflows} showWorkflowButtons={false} />
      );
    });

    it('should render the learn more and get started buttons', function() {
      assert.equal(wrapper.find('.standard-button').length, 2);
    });

    it('should have text "Get started!"', function() {
      assert.equal(wrapper.find('.get-started').text(), 'Get started');
    })
  });

  describe('if project has a redirect', function() {
    beforeEach(function () {
      wrapper = render(
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
