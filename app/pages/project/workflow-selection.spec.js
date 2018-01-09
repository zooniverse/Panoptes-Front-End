import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
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
  initialLoadComplete: true,
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
  sinon.stub(resource, 'save', () => Promise.resolve(resource));
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

describe('WorkflowSelection', () => {
  const actions = {
    translations: {
      load: () => null
    }
  };
  const translations = {
    locale: 'en'
  };
  const wrapper = shallow(
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
  const workflowSpy = sinon.spy(controller, 'getWorkflow');

  before(() => {
    sinon.stub(apiClient, 'request', (method, url, payload) => {
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

  beforeEach(() => {
    workflowSpy.reset();
    wrapper.update();
  });

  afterEach(() => {
    project.experimental_tools = [];
    location.query = {};
  });

  after(() => {
    apiClient.request.restore();
  });

  it('should fetch a random active workflow by default', () => {
    controller.getSelectedWorkflow({ project });
    const selectedWorkflowID = workflowSpy.getCall(0).args[0];
    sinon.assert.calledOnce(workflowSpy);
    assert.notEqual(project.links.active_workflows.indexOf(selectedWorkflowID), -1);
  });

  it('should respect the workflow query param if "allow workflow query" is set', () => {
    location.query.workflow = '6';
    project.experimental_tools = ['allow workflow query'];
    controller.getSelectedWorkflow({ project });
    sinon.assert.calledOnce(workflowSpy);
    sinon.assert.calledWith(workflowSpy, '6', true);
  });

  describe('with a logged-in user', () => {
    beforeEach(() => {
      controller.setupSplits = () => null;
      location.query.workflow = '6';
    });

    it('should load the specified workflow for the project owner', () => {
      const user = owner;
      controller.getSelectedWorkflow({ project, preferences, user });
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '6', false);
    });

    it('should load the specified workflow for a collaborator', () => {
      const user = apiClient.type('users').create({ id: '2' });
      controller.getSelectedWorkflow({ project, preferences, user });
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '6', false);
    });

    it('should load the specified workflow for a tester', () => {
      const user = apiClient.type('users').create({ id: '3' });
      controller.getSelectedWorkflow({ project, preferences, user });
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '6', false);
    });
  });

  describe('with a workflow saved in preferences', () => {
    beforeEach(() => {
      location.query = {};
      preferences.update({ preferences: {}});
      const user = mockPanoptesResource('users', { id: '4' });
      wrapper.setProps({ user });
    });

    it('should try to load the stored workflow', () => {
      preferences.update({ 'preferences.selected_workflow': '4' });
      controller.getSelectedWorkflow({ project, preferences });
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '4', true);
    });

    it('should try to load a stored project workflow', () => {
      preferences.update({ 'settings.workflow_id': '2' });
      controller.getSelectedWorkflow({ project, preferences });
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '2', true);
    });
  });

  describe('without a saved workflow', () => {
    beforeEach(() => {
      location.query = {};
      project.update({ 'configuration.default_workflow': '1' });
      preferences.update({ settings: {}, preferences: {}});
    });

    it('should load the project default workflow', () => {
      const user = apiClient.type('users').create({ id: '4' });
      controller.getSelectedWorkflow({ project, preferences, user });
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '1', true);
    });
  });
});
