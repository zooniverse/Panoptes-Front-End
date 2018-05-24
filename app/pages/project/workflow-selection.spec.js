import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import WorkflowSelection from './workflow-selection';

function StubPage() {
  return <p>Hello</p>;
}

const location = {
  query: {}
};

const context = {
  router: {}
};

const projectRoles = [
  {
    roles: ['owner'],
    links: {
      owner: {
        id: '1'
      }
    }
  },
  {
    roles: ['collaborator'],
    links: {
      owner: {
        id: '2'
      }
    }
  },
  {
    roles: ['tester'],
    links: {
      owner: {
        id: '3'
      }
    }
  }
];

function mockPanoptesResource(type, options) {
  const resource = apiClient.type(type).create(options);
  apiClient._typesCache = {};
  sinon.stub(resource, 'save').callsFake(() => Promise.resolve(resource));
  sinon.stub(resource, 'get');
  sinon.stub(resource, 'delete');
  return resource;
}

const project = mockPanoptesResource('projects',
  {
    id: 'a',
    display_name: 'A test project',
    experimental_tools: [],
    links: {
      active_workflows: ['1', '2', '3', '4', '5'],
      owner: { id: '1' }
    }
  }
);

const owner = mockPanoptesResource(
  'users',
  {
    id: project.links.owner.id
  }
);

const preferences = mockPanoptesResource(
  'project_preferences',
  {
    preferences: {},
    links: {
      project: project.id
    }
  }
);

describe('WorkflowSelection', function () {
  const actions = {
    translations: {
      load: () => null
    }
  };
  const translations = {
    locale: 'en'
  };
  const wrapper = mount(
    <WorkflowSelection
      actions={actions}
      project={project}
      preferences={preferences}
      projectRoles={projectRoles}
      location={location}
      translations={translations}
    >
      <StubPage />
    </WorkflowSelection>,
    { context }
  );
  const controller = wrapper.instance();
  const workflowStub = sinon.stub(controller, 'getWorkflow').callsFake(() => {});

  before(function () {
    sinon.stub(apiClient, 'request').callsFake((method, url, payload) => {
      let response = [];
      if (url === '/workflows') {
        const workflow = mockPanoptesResource(
          'workflows',
          {
            id: payload.id,
            tasks: []
          }
        );
        response = [workflow];
      }
      return Promise.resolve(response);
    });
  });

  beforeEach(function () {
    workflowStub.resetHistory();
    wrapper.update();
  });

  afterEach(function () {
    project.experimental_tools = [];
    location.query = {};
  });

  after(function () {
    apiClient.request.restore();
  });

  it('should fetch a random active workflow by default', function () {
    controller.getSelectedWorkflow({ project });
    const selectedWorkflowID = workflowStub.getCall(0).args[0];
    sinon.assert.calledOnce(workflowStub);
    assert.notEqual(project.links.active_workflows.indexOf(selectedWorkflowID.toString()), -1);
  });

  it('should respect the workflow query param if "allow workflow query" is set', function () {
    location.query.workflow = '6';
    project.experimental_tools = ['allow workflow query'];
    controller.getSelectedWorkflow({ project });
    sinon.assert.calledOnce(workflowStub);
    sinon.assert.calledWith(workflowStub, '6', true);
  });

  it('should sanitise the workflow query param if "allow workflow query" is set', function () {
    location.query.workflow = '6random78';
    project.experimental_tools = ['allow workflow query'];
    controller.getSelectedWorkflow({ project });
    sinon.assert.calledOnce(workflowStub);
    sinon.assert.calledWith(workflowStub, '6', true);
  });

  describe('with a logged-in user', function () {
    beforeEach(function () {
      controller.setupSplits = () => null;
      location.query.workflow = '6';
    });

    it('should load the specified workflow for the project owner', function () {
      const user = owner;
      controller.getSelectedWorkflow({ project, preferences, user });
      sinon.assert.calledOnce(workflowStub);
      sinon.assert.calledWith(workflowStub, '6', false);
    });

    it('should load the specified workflow for a collaborator', function () {
      const user = apiClient.type('users').create({ id: '2' });
      controller.getSelectedWorkflow({ project, preferences, user });
      sinon.assert.calledOnce(workflowStub);
      sinon.assert.calledWith(workflowStub, '6', false);
    });

    it('should load the specified workflow for a tester', function () {
      const user = apiClient.type('users').create({ id: '3' });
      controller.getSelectedWorkflow({ project, preferences, user });
      sinon.assert.calledOnce(workflowStub);
      sinon.assert.calledWith(workflowStub, '6', false);
    });

    it('should load an active workflow for a general user', function () {
      const user = apiClient.type('users').create({ id: '4' });
      controller.getSelectedWorkflow({ project, preferences, user });
      sinon.assert.calledOnce(workflowStub);
      const selectedWorkflowID = workflowStub.getCall(0).args[0];
      const activeFilter = workflowStub.getCall(0).args[1];
      assert.notEqual(project.links.active_workflows.indexOf(selectedWorkflowID), -1);
      assert.equal(activeFilter, true);
    });
  });

  describe('with a workflow saved in preferences', function () {
    beforeEach(function () {
      location.query = {};
      preferences.update({ preferences: {}});
      const user = mockPanoptesResource('users', { id: '4' });
      wrapper.setProps({ user });
    });

    it('should try to load the stored workflow', function () {
      preferences.update({ 'preferences.selected_workflow': '4' });
      controller.getSelectedWorkflow({ project, preferences });
      sinon.assert.calledOnce(workflowStub);
      sinon.assert.calledWith(workflowStub, '4', true);
    });

    it('should parse the stored user workflow as an int', function () {
      preferences.update({ 'preferences.selected_workflow': '4random' });
      controller.getSelectedWorkflow({ project, preferences });
      sinon.assert.calledOnce(workflowStub);
      sinon.assert.calledWith(workflowStub, '4', true);
    });

    it('should clear an invalid workflow string from user preferences', function () {
      preferences.update({ 'preferences.selected_workflow': '4' });
      controller.clearInactiveWorkflow('4');
      assert.equal(preferences.preferences.selected_workflow, undefined);
    });

    it('should clear an invalid workflow int from user preferences', function () {
      preferences.update({ 'preferences.selected_workflow': 4 });
      controller.clearInactiveWorkflow('4');
      assert.equal(preferences.preferences.selected_workflow, undefined);
    });

    it('should try to load a stored project workflow', function () {
      preferences.update({ 'settings.workflow_id': '2' });
      controller.getSelectedWorkflow({ project, preferences });
      sinon.assert.calledOnce(workflowStub);
      sinon.assert.calledWith(workflowStub, '2', true);
    });

    it('parse the stored project workflow as an int', function () {
      preferences.update({ 'settings.workflow_id': '2random' });
      controller.getSelectedWorkflow({ project, preferences });
      sinon.assert.calledOnce(workflowStub);
      sinon.assert.calledWith(workflowStub, '2', true);
    });

    it('should clear an invalid workflow string from project settings', function () {
      preferences.update({ 'settings.workflow_id': '2' });
      controller.clearInactiveWorkflow('2');
      assert.equal(preferences.settings.workflow_id, undefined);
    });

    it('should clear an invalid workflow int from project settings', function () {
      preferences.update({ 'settings.workflow_id': 2 });
      controller.clearInactiveWorkflow('2');
      assert.equal(preferences.settings.workflow_id, undefined);
    });
  });

  describe('without a saved workflow', function () {
    beforeEach(function () {
      location.query = {};
      project.update({ 'configuration.default_workflow': '1' });
      preferences.update({ settings: {}, preferences: {}});
    });

    it('should load the project default workflow', function () {
      const user = apiClient.type('users').create({ id: '4' });
      controller.getSelectedWorkflow({ project, preferences, user });
      sinon.assert.calledOnce(workflowStub);
      sinon.assert.calledWith(workflowStub, '1', true);
    });
  });

  describe('on project change', function () {
    it('should load a workflow for the new project', function () {
      const newProject = mockPanoptesResource('projects',
        {
          id: 'b',
          display_name: 'Another test project',
          experimental_tools: [],
          configuration: {
            default_workflow: '10'
          },
          links: {
            active_workflows: ['10'],
            owner: { id: '1' }
          }
        }
      );
      wrapper.setProps({ project: newProject });
      sinon.assert.calledOnce(workflowStub);
      sinon.assert.calledWith(workflowStub, '10', true);
    });
  });
});