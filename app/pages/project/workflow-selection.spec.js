import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import { WorkflowSelection } from './workflow-selection';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';

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

const project = mockPanoptesResource('projects',
  {
    id: 'a',
    display_name: 'A test project',
    experimental_tools: [],
    links: {
      active_workflows: ['1', '2', '3', '4', '5'],
      owner: { id: '1' },
      workflows: ['1', '2', '3', '4', '5']
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
      load: sinon.stub()
    }
  };
  const wrapper = mount(
    <WorkflowSelection
      actions={actions}
      project={project}
      preferences={preferences}
      projectRoles={projectRoles}
      locale='en'
      location={location}
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
    actions.translations.load.resetHistory();
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
    expect(workflowStub.calledOnce).to.be.true;
    expect(project.links.active_workflows).to.include(selectedWorkflowID.toString());
  });

  it('should respect the workflow query param if "allow workflow query" is set', function () {
    location.query.workflow = '6';
    project.experimental_tools = ['allow workflow query'];
    controller.getSelectedWorkflow({ project });
    expect(workflowStub.calledOnce).to.be.true;
    expect(workflowStub.calledWith('6', true)).to.be.true;
  });

  it('should sanitise the workflow query param if "allow workflow query" is set', function () {
    location.query.workflow = '6random78';
    project.experimental_tools = ['allow workflow query'];
    controller.getSelectedWorkflow({ project });
    expect(workflowStub.calledOnce).to.be.true;
    expect(workflowStub.calledWith('6', true)).to.be.true;
  });

  describe('with a logged-in user', function () {
    beforeEach(function () {
      controller.setupSplits = () => null;
      location.query.workflow = '6';
    });

    it('should load the specified workflow for the project owner', function () {
      const user = owner;
      controller.getSelectedWorkflow({ project, preferences, user });
      expect(workflowStub.calledOnce).to.be.true;
      expect(workflowStub.calledWith('6', false)).to.be.true;
    });

    it('should load the specified workflow for a collaborator', function () {
      const user = apiClient.type('users').create({ id: '2' });
      controller.getSelectedWorkflow({ project, preferences, user });
      expect(workflowStub.calledOnce).to.be.true;
      expect(workflowStub.calledWith('6', false)).to.be.true;
    });

    it('should load the specified workflow for a tester', function () {
      const user = apiClient.type('users').create({ id: '3' });
      controller.getSelectedWorkflow({ project, preferences, user });
      expect(workflowStub.calledOnce).to.be.true;
      expect(workflowStub.calledWith('6', false)).to.be.true;
    });

    it('should load an active workflow for a general user', function () {
      const user = apiClient.type('users').create({ id: '4' });
      controller.getSelectedWorkflow({ project, preferences, user });
      expect(workflowStub.calledOnce).to.be.true;
      const selectedWorkflowID = workflowStub.getCall(0).args[0];
      const activeFilter = workflowStub.getCall(0).args[1];
      expect(project.links.active_workflows).to.include(selectedWorkflowID);
      expect(activeFilter).to.be.true;
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
      expect(workflowStub.calledOnce).to.be.true;
      expect(workflowStub.calledWith('4', true)).to.be.true;
    });

    it('should parse the stored user workflow as an int', function () {
      preferences.update({ 'preferences.selected_workflow': '4random' });
      controller.getSelectedWorkflow({ project, preferences });
      expect(workflowStub.calledOnce).to.be.true;
      expect(workflowStub.calledWith('4', true)).to.be.true;
    });

    it('should clear an invalid workflow string from user preferences', function () {
      preferences.update({ 'preferences.selected_workflow': '4' });
      controller.clearInactiveWorkflow('4');
      expect(preferences.preferences.selected_workflow).to.be.undefined;
    });

    it('should clear an invalid workflow int from user preferences', function () {
      preferences.update({ 'preferences.selected_workflow': 4 });
      controller.clearInactiveWorkflow('4');
      expect(preferences.preferences.selected_workflow).to.be.undefined;
    });

    it('should try to load a stored project workflow', function () {
      preferences.update({ 'settings.workflow_id': '2' });
      controller.getSelectedWorkflow({ project, preferences });
      expect(workflowStub.calledOnce).to.be.true;
      expect(workflowStub.calledWith('2', true)).to.be.true;
    });

    it('parse the stored project workflow as an int', function () {
      preferences.update({ 'settings.workflow_id': '2random' });
      controller.getSelectedWorkflow({ project, preferences });
      expect(workflowStub.calledOnce).to.be.true;
      expect(workflowStub.calledWith('2', true)).to.be.true;
    });

    it('should clear an invalid workflow string from project settings', function () {
      preferences.update({ 'settings.workflow_id': '2' });
      controller.clearInactiveWorkflow('2');
      expect(preferences.settings.workflow_id).to.be.undefined;
    });

    it('should clear an invalid workflow int from project settings', function () {
      preferences.update({ 'settings.workflow_id': 2 });
      controller.clearInactiveWorkflow('2');
      expect(preferences.settings.workflow_id).to.be.undefined;
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
      expect(workflowStub.calledOnce).to.be.true;
      expect(workflowStub.calledWith('1', true)).to.be.true;
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
            owner: { id: '1' },
            workflows: ['10']
          }
        }
      );
      wrapper.setProps({ project: newProject });
      expect(workflowStub.calledOnce).to.be.true;
      expect(workflowStub.calledWith('10', true)).to.be.true;
    });
  });

  describe('when loading a project without linked active workflows', function() {
    it('should not attempt to call getWorkflow', function() {
      const projectWithoutActiveWorkflows = mockPanoptesResource('projects', {
        id: 'y',
        display_name: 'A test project',
        configuration: {},
        experimental_tools: [],
        links: {
          owner: { id: '1' },
          workflows: ['20']
        }
      });

      wrapper.setProps({ project: projectWithoutActiveWorkflows });

      sinon.assert.notCalled(workflowStub)
    });
  });

  describe('when loading a project without any linked workflows', function () {
    it('should not attempt to call getWorkflow', function () {
      const projectWithoutWorkflows = mockPanoptesResource('projects', {
        id: 'z',
        display_name: 'I have no workflows project',
        configuration: {},
        experimental_tools: [],
        links: {
          owner: { id: '1' }
        }
      });

      wrapper.setProps({ project: projectWithoutWorkflows });

      expect(workflowStub.notCalled).to.be.true;
    });
  });

  describe('on language change', function () {
    it('should load new translation strings', function () {
      const workflow = mockPanoptesResource('workflows', { id: '1', tasks: {} });
      wrapper.setProps({ locale: 'it', workflow });
      expect(actions.translations.load.calledWith('workflow', '1', 'it')).to.be.true;
    });
  });
});