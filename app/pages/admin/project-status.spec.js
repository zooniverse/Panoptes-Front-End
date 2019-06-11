import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import ProjectStatus from './project-status';

const project = {
  name: 'Test Project',
  configuration: {
    default_workflow: '1'
  }
};

const workflows = [
  {
    active: true,
    configuration: {},
    retirement: {
      criteria: 'classification_count',
      options: { count: 15 }
    },
    display_name: 'Test Workflow 1',
    id: '1'
  },
  {
    active: true,
    configuration: {},
    retirement: { criteria: 'never_retire' },
    display_name: 'Test Workflow 2',
    id: '2'
  },
  {
    active: false,
    configuration: {},
    retirement: { criteria: 'never_retire' },
    display_name: 'Test Workflow 3',
    id: '3'
  }
];

describe('ProjectStatus', function () {
  let handleDialogCancelStub;
  let handleDialogSuccessStub;
  let loadingIndicator;
  let onChangeWorkflowLevelStub;
  let onChangeWorkflowRetirementStub;
  let wrapper;

  before(function () {
    sinon.stub(ProjectStatus.prototype, 'getProject').callsFake(() => Promise.resolve(project));
    sinon.stub(ProjectStatus.prototype, 'getWorkflows').callsFake(() => Promise.resolve(workflows));
    onChangeWorkflowLevelStub = sinon.stub(ProjectStatus.prototype, 'onChangeWorkflowLevel');
    onChangeWorkflowRetirementStub = sinon.stub(ProjectStatus.prototype, 'onChangeWorkflowRetirement');
    handleDialogCancelStub = sinon.stub(ProjectStatus.prototype, 'handleDialogCancel');
    handleDialogSuccessStub = sinon.stub(ProjectStatus.prototype, 'handleDialogSuccess');

    wrapper = shallow(<ProjectStatus />);
  });

  after(function () {
    onChangeWorkflowLevelStub.restore();
    onChangeWorkflowRetirementStub.restore();
    handleDialogCancelStub.restore();
    handleDialogSuccessStub.restore();
    ProjectStatus.prototype.getProject.restore();
    ProjectStatus.prototype.getWorkflows.restore();
  });

  it('renders without crashing', function () {
    assert.equal(wrapper, wrapper);
  });

  describe('when no project is in component state', function () {
    it('renders Loading Indicator component', function () {
      loadingIndicator = wrapper.find('LoadingIndicator');
      assert.equal(loadingIndicator.length, 1);
    });
  });

  describe('when project is in component state', function () {
    before(function () {
      wrapper.setState({ project });
    });

    it('does not render the LoadingIndicator component', function () {
      loadingIndicator = wrapper.find('LoadingIndicator');
      assert.equal(loadingIndicator.length, 0);
    });

    it('renders a ProjectIcon component', function () {
      wrapper.setState({ project });
      const projectIconComponent = wrapper.find('ProjectIcon');
      assert.equal(projectIconComponent.length, 1);
    });

    it('renders a RedirectToggle component', function () {
      const redirectToggleComponent = wrapper.find('RedirectToggle');
      assert.equal(redirectToggleComponent.length, 1);
    });

    it('renders a ExperimentalFeatures component', function () {
      const experimentalFeaturesComponent = wrapper.find('ExperimentalFeatures');
      assert.equal(experimentalFeaturesComponent.length, 1);
    });

    it('renders a FeaturedProjectToggle component', function () {
      const featuredProjectToggle = wrapper.find('FeaturedProjectToggle');
      assert.equal(featuredProjectToggle.length, 1);
    });

    it('renders a VersionList component', function () {
      const versionListComponent = wrapper.find('VersionList');
      assert.equal(versionListComponent.length, 1);
    });

    it('renders a no workflows found message when no workflow is in component state', function () {
      const noWorkflowsMessage = wrapper.find('.project-status__section').at(2).children().find('div');
      assert.equal(noWorkflowsMessage.text(), 'No workflows found');
    });
  });

  describe('when workflow is in component state', function () {
    before(function () {
      wrapper.setState({ workflows });
    });

    it('displays an asterisk next to the default workflow, if one is set', function () {
      const defaultWorkflow = wrapper.find('li.section-list__item').first().text();
      assert.ok(defaultWorkflow.match(' * '), true);
    });

    it('does not display an asterisk next to a workflow that is not the default workflow', function () {
      const notDefaultWorkflow = wrapper.find('li.section-list__item').last().text();
      assert.ok(notDefaultWorkflow.match(' * '), false);
    });

    it('renders a WorkflowToggle component for each workflow', function () {
      const workflowToggleComponents = wrapper.find('WorkflowToggle');
      assert.equal(workflowToggleComponents.length, workflows.length);
    });

    it('calls #onChangeWorkflowLevel when a user changes a workflow\'s configuration level', function () {
      wrapper.find('select#promotionLevels').first().simulate('change');
      sinon.assert.calledOnce(onChangeWorkflowLevelStub);
    });

    it('calls #onChangeWorkflowRetirement when a user changes a workflow\'s retirement configuration', function () {
      wrapper.find('select#retirementConfig').first().simulate('change');
      sinon.assert.calledOnce(onChangeWorkflowRetirementStub);
    });

    it('renders the WorkflowDefaultDialog component when dialogIsOpen state is true', function () {
      wrapper.setState({ dialogIsOpen: true });
      const workflowDefaultDialog = wrapper.find('WorkflowDefaultDialog');
      assert.equal(workflowDefaultDialog.length, 1);
    });

    it('calls #handleDialogCancel when a user cancels the WorkflowDefaultDialog modal', function () {
      const workflowDefaultDialog = wrapper.find('WorkflowDefaultDialog');
      workflowDefaultDialog.simulate('cancel');
      sinon.assert.calledOnce(handleDialogCancelStub);
    });

    it('calls #handleDialogSuccess when a user clicks ok on the WorkflowDefaultDialog modal', function () {
      const workflowDefaultDialog = wrapper.find('WorkflowDefaultDialog');
      workflowDefaultDialog.simulate('success');
      sinon.assert.calledOnce(handleDialogSuccessStub);
    });
  });
});
