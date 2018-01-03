import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import { ProjectPageController } from './';

const params = {
  owner: 'test',
  name: 'test'
};

const location = {
  query: {}
};

const context = {
  initialLoadComplete: true,
  router: {}
};

const RESOURCES = {
  pages: [],
  project_roles: [
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
  ]
};

function mockPanoptesResource(type, options) {
  const resource = apiClient.type(type).create(options);
  apiClient._typesCache = {};
  sinon.stub(resource, 'save', () => Promise.resolve(resource));
  sinon.stub(resource, 'get', resourceType => Promise.resolve(RESOURCES[resourceType]));
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
      avatar: { id: '1' },
      background: { id: '1' },
      owner: { id: '1' }
    }
  }
);

const background = mockPanoptesResource(
  'backgrounds',
  {
    id: project.links.background.id
  }
);

const owner = mockPanoptesResource(
  'users',
  {
    id: project.links.owner.id
  }
);

const projectAvatar = mockPanoptesResource(
  'avatars',
  {
    id: project.links.avatar.id
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

describe('ProjectPageController', () => {
  const actions = {
    translations: {
      load: () => null
    }
  };
  const translations = {
    locale: 'en'
  };
  const wrapper = shallow(
    <ProjectPageController
      actions={actions}
      params={params}
      project={project}
      location={location}
      translations={translations}
    />,
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
    wrapper.setState({
      loading: false,
      project,
      background,
      owner,
      pages: RESOURCES.pages,
      preferences: {},
      projectAvatar,
      projectRoles: RESOURCES.project_roles
    });
    wrapper.update();
  });

  after(() => {
    apiClient.request.restore();
  });

  it('should fetch a random active workflow by default', () => {
    controller.getSelectedWorkflow(project);
    const selectedWorkflowID = workflowSpy.getCall(0).args[0];
    sinon.assert.calledOnce(workflowSpy);
    assert.notEqual(project.links.active_workflows.indexOf(selectedWorkflowID), -1);
  });

  describe('with a logged-in user', () => {
    beforeEach(() => {
      controller.setupSplits = () => null;
      location.query.workflow = '6';
    });

    it('should load the specified workflow for the project owner', () => {
      wrapper.setProps({ user: owner });
      wrapper.setState({ preferences });
      controller.getSelectedWorkflow(project, preferences);
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '6', false);
    });

    it('should load the specified workflow for a collaborator', () => {
      const user = apiClient.type('users').create({ id: '2' });
      wrapper.setProps({ user });
      wrapper.setState({ preferences });
      controller.getSelectedWorkflow(project, preferences);
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '6', false);
    });

    it('should load the specified workflow for a tester', () => {
      const user = apiClient.type('users').create({ id: '3' });
      wrapper.setProps({ user });
      wrapper.setState({ preferences });
      controller.getSelectedWorkflow(project, preferences);
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
      wrapper.setState({ preferences });
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '4', true);
    });

    it('should try to load a stored project workflow', () => {
      preferences.update({ 'settings.workflow_id': '2' });
      wrapper.setState({ preferences });
      controller.getSelectedWorkflow(project, preferences);
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '2', true);
    });
  });

  describe('without a saved workflow', () => {
    beforeEach(() => {
      location.query = {};
      project.update({ 'configuration.default_workflow': '1' });
      preferences.update({ settings: {}, preferences: {}});
      const user = apiClient.type('users').create({ id: '4' });
      wrapper.setProps({ user });
    });

    it('should load the project default workflow', () => {
      wrapper.setState({ project, preferences });
      controller.getSelectedWorkflow(project, preferences);
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '1', true);
    });
  });
});
