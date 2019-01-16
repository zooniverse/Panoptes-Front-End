import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { WorkflowSelection } from './workflow-selection';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';

function StubPage() {
  return <p>Hello</p>;
}

const location = {
  query: {}
};

const context = {
  router: {
    push: sinon.stub()
  }
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
    slug: 'test/test-project',
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
  let wrapper;
  let controller;
  let workflowStub;
  const actions = {
    classifier: {
      loadWorkflow: sinon.spy(),
      reset: sinon.spy(),
      setWorkflow: sinon.spy()
    },
    translations: {
      load: sinon.stub().callsFake(() => Promise.resolve([]))
    }
  };

  before(function () {
    workflowStub = sinon.stub(WorkflowSelection.prototype, 'getWorkflow').callsFake(() => {});
    wrapper = mount(
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
    controller = wrapper.instance();
  });

  describe('selecting a workflow ID', function () {

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
      workflowStub.restore();
    });

    it('should fetch a random active workflow by default', function () {
      controller.getSelectedWorkflow({ project });
      const selectedWorkflowID = workflowStub.getCall(0).args[0];
      expect(workflowStub).to.have.been.calledOnce;
      expect(project.links.active_workflows).to.include(selectedWorkflowID.toString());
    });

    it('should respect the workflow query param if "allow workflow query" is set', function () {
      location.query.workflow = '6';
      project.experimental_tools = ['allow workflow query'];
      controller.getSelectedWorkflow({ project });
      expect(workflowStub).to.have.been.calledOnce;
      expect(workflowStub).to.have.been.calledWith('6', true);
    });

    it('should sanitise the workflow query param if "allow workflow query" is set', function () {
      location.query.workflow = '6random78';
      project.experimental_tools = ['allow workflow query'];
      controller.getSelectedWorkflow({ project });
      expect(workflowStub).to.have.been.calledOnce;
      expect(workflowStub).to.have.been.calledWith('6', true);
    });

    describe('without a logged-in user', function () {
      before(function () {
        project.update({ 'configuration.default_workflow': '1' });
      });

      afterEach(function () {
        preferences.update({
          settings: {},
          preferences: {}
        });
      });

      after(function () {
        project.update({ 'configuration.default_workflow': undefined });
      });

      it('should ignore project-assigned workflows', function () {
        preferences.update({ 'settings.workflow_id': '4' });
        controller.getSelectedWorkflow({ project, preferences });
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('1', true);
      });

      it('should ignore user-selected workflows', function () {
        preferences.update({ 'preferences.selected_workflow': '5' });
        controller.getSelectedWorkflow({ project, preferences });
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('1', true);
      });
    });

    describe('with a logged-in user', function () {
      beforeEach(function () {
        controller.setupSplits = () => null;
        location.query.workflow = '6';
      });

      it('should load the specified workflow for the project owner', function () {
        const user = owner;
        controller.getSelectedWorkflow({ project, preferences, user });
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('6', false);
      });

      it('should load the specified workflow for a collaborator', function () {
        const user = mockPanoptesResource('users', { id: '2' });
        controller.getSelectedWorkflow({ project, preferences, user });
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('6', false);
      });

      it('should load the specified workflow for a tester', function () {
        const user = mockPanoptesResource('users', { id: '3' });
        controller.getSelectedWorkflow({ project, preferences, user });
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('6', false);
      });

      it('should load an active workflow for a general user', function () {
        const user = mockPanoptesResource('users', { id: '4' });
        controller.getSelectedWorkflow({ project, preferences, user });
        expect(workflowStub).to.have.been.calledOnce;
        const selectedWorkflowID = workflowStub.getCall(0).args[0];
        const activeFilter = workflowStub.getCall(0).args[1];
        expect(project.links.active_workflows).to.include(selectedWorkflowID);
        expect(activeFilter).to.be.true;
      });
    });

    describe('with a workflow saved in preferences', function () {
      const user = mockPanoptesResource('users', { id: '4' });

      beforeEach(function () {
        location.query = {};
        preferences.update({ preferences: {}});
        wrapper.setProps({ user });
      });

      afterEach(function () {
        actions.classifier.reset.resetHistory();
      });

      it('should try to load the stored workflow', function () {
        preferences.update({ 'preferences.selected_workflow': '4' });
        controller.getSelectedWorkflow({ project, preferences, user });
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('4', true);
      });

      it('should parse the stored user workflow as an int', function () {
        preferences.update({ 'preferences.selected_workflow': '4random' });
        controller.getSelectedWorkflow({ project, preferences, user });
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('4', true);
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
        controller.getSelectedWorkflow({ project, preferences, user });
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('2', true);
      });

      it('parse the stored project workflow as an int', function () {
        preferences.update({ 'settings.workflow_id': '2random' });
        controller.getSelectedWorkflow({ project, preferences, user });
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('2', true);
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
        const user = mockPanoptesResource('users', { id: '4' });
        controller.getSelectedWorkflow({ project, preferences, user });
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('1', true);
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
        expect(workflowStub).to.have.been.calledOnce;
        expect(workflowStub).to.have.been.calledWith('10', true);
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

        expect(workflowStub).to.have.not.been.called;
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
  });

  describe('loading a workflow', function () {
    let awaitWorkflow;
    before(function () {
      project.update({ configuration: {} });
      preferences.update({ settings: {}, preferences: {}});
      sinon.stub(controller, 'getSelectedWorkflow').callsFake(() => {});
      sinon.stub(controller, 'clearInactiveWorkflow').callsFake(() => Promise.resolve({}));
      wrapper.setProps({ project, preferences });
    });

    afterEach(function () {
      controller.getSelectedWorkflow.resetHistory();
      controller.clearInactiveWorkflow.resetHistory();
    });

    after(function () {
      controller.getSelectedWorkflow.restore();
      controller.clearInactiveWorkflow.restore();
    });

    describe('with a valid workflow ID', function () {
      beforeEach(function () {
        awaitWorkflow = controller.getWorkflow('1')
      });

      afterEach(function () {
        actions.classifier.loadWorkflow.resetHistory();
      });

      it('should load the workflow', function () {
        expect(actions.classifier.loadWorkflow).to.have.been.calledOnce;
        expect(actions.classifier.loadWorkflow).to.have.been.calledWith('1', 'en', preferences);
      });
    });

    describe('with an invalid workflow ID', function () {

      beforeEach(function () {
        awaitWorkflow = controller.getWorkflow('10');
      });

      it('should not load a workflow', function () {
        expect(actions.classifier.loadWorkflow).to.have.not.been.called;
      });

      it('should clear user preferences', function (done) {
        awaitWorkflow
        .then(function () {
          expect(controller.clearInactiveWorkflow).to.have.been.calledOnce;
          expect(controller.clearInactiveWorkflow).to.have.been.calledWith('10');
        })
        .then(done, done);
      });

      it('should try to load another workflow', function (done) {
        awaitWorkflow
        .then(function () {
          expect(controller.getSelectedWorkflow).to.have.been.calledOnce;
        })
        .then(done, done);
      });

      describe('when a workflow query param is present', function () {
        before(function () {
          const location = {
            query: {
              workflow: '5'
            }
          };
          wrapper.setProps({ location });
        });

        after(function () {
          wrapper.setProps({ location : {} });
        });

        it('should redirect to the classify page', function (done) {
          awaitWorkflow
          .then(function () {
            expect(context.router.push).to.have.been.calledWith(`/projects/${project.slug}/classify`);
          })
          .then(done, done);
        });
      });

      describe('when the project default workflow is invalid', function () {
        before(function () {
          project.update({ 'configuration.default_workflow': '10' });
          sinon.stub(project, 'uncacheLink');
        });

        after(function () {
          project.update({ configuration: {} });
          project.uncacheLink.restore();
        });

        it('should not clear user preferences', function (done) {
          awaitWorkflow
          .then(function () {
            expect(controller.clearInactiveWorkflow).to.have.not.been.called;
          })
          .then(done, done);
        });

        it('should not try to load another workflow', function (done) {
          awaitWorkflow
          .then(function () {
            expect(controller.getSelectedWorkflow).to.have.not.been.called;
          })
          .then(done, done);
        });

        it('should uncache project workflow links', function (done) {
          awaitWorkflow
          .then(function () {
            expect(project.uncacheLink).to.have.been.calledWith('workflows');
          })
          .then(done, done);
        });
      })
    });
  });

  describe('on language change', function () {
    before(function () {
      sinon.stub(controller, 'getWorkflow').callsFake(() => {});
    })

    after(function () {
      controller.getWorkflow.restore();
    });

    it('should load new translation strings', function () {
      const workflow = mockPanoptesResource('workflows', { id: '1', tasks: {}, links: { project: 'a' } });
      wrapper.setProps({ locale: 'it', workflow });
      expect(actions.translations.load).to.have.been.calledWith('workflow', '1', 'it');
    });
  });

  describe('on preferences change', function () {
    before(function () {
      const preferences = mockPanoptesResource('preferences', { id: 2, preferences: {} });
      sinon.stub(controller, 'getWorkflow').callsFake(() => {});
      wrapper.setProps({ preferences });
    })

    after(function () {
      controller.getWorkflow.restore();
      wrapper.setProps({ preferences: undefined });
      actions.classifier.reset.resetHistory();
    });

    it('should reset the classifier', function () {
      expect(actions.classifier.reset).to.have.been.calledOnce;
    });
  });
});