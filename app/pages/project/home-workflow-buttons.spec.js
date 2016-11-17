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

const testProject = {
  redirect: 'www.testproject.com',
}

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

  describe('if user chooses workflow assignment', function() {
    beforeEach(function () {
      wrapper = render(
        <ProjectHomeWorkflowButtons activeWorkflows={testWorkflows} showWorkflowButtons={true} />
      );
    });

    it('should render workflow button options', function() {
      assert.equal(wrapper.find('.standard-button').length, 3);
    });
  });

  describe('if user cannot choose workflow assignment', function() {
    beforeEach(function () {
      wrapper = render(
        <ProjectHomeWorkflowButtons activeWorkflows={testWorkflows} showWorkflowButtons={false} />
      );
    });

    it('should render one button', function() {
      assert.equal(wrapper.find('.standard-button').length, 1);
    });

    it('should have text "Get started!"', function() {
      assert.equal(wrapper.find('.standard-button').text(), 'Get started!');
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
