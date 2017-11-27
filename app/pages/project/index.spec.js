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
  query: {
    workflow: '6'
  }
};

const context = {
  initialLoadComplete: true,
  router: {}
};

const resources = {
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

const project = apiClient.type('projects').create({
  id: '1',
  display_name: 'A test project',
  experimental_tools: [],
  get(type) {
    return Promise.resolve(resources[type]);
  },
  links: {
    active_workflows: [1, 2, 3, 4, 5],
    avatar: { id: '1' },
    background: { id: '1' },
    owner: { id: '1' }
  }
});

const background = apiClient.type('backgrounds').create({
  id: project.links.background.id
});

const owner = apiClient.type('users').create({
  id: project.links.owner.id
});

const projectAvatar = apiClient.type('avatars').create({
  id: project.links.avatar.id
});

const preferences = {
  preferences: {
    selected_workflow_id: '6'
  }
};

describe('ProjectPageController', () => {
  const wrapper = shallow(<ProjectPageController params={params} project={project} location={location} />, { context });
  const controller = wrapper.instance();
  const workflowSpy = sinon.spy(controller, 'getWorkflow');

  beforeEach(() => {
    workflowSpy.reset();
    wrapper.setState({
      loading: false,
      project,
      background,
      owner,
      pages: resources.pages,
      preferences: {},
      projectAvatar,
      projectRoles: resources.project_roles
    });
    wrapper.update();
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
    });

    it('should load the specified workflow for the project owner', () => {
      wrapper.setProps({ user: owner }).update();
      controller.getSelectedWorkflow(project, preferences);
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '6', false);
    });

    it('should load the specified workflow for a collaborator', () => {
      const user = apiClient.type('users').create({ id: '2' });
      wrapper.setProps({ user }).update();
      controller.getSelectedWorkflow(project, preferences);
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '6', false);
    });

    it('should load the specified workflow for a tester', () => {
      const user = apiClient.type('users').create({ id: '3' });
      wrapper.setProps({ user }).update();
      controller.getSelectedWorkflow(project, preferences);
      sinon.assert.calledOnce(workflowSpy);
      sinon.assert.calledWith(workflowSpy, '6', false);
    });
  });
});
