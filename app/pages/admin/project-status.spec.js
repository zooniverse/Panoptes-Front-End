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
    display_name: 'Test Workflow 1',
    id: '1'
  },
  {
    active: true,
    configuration: {},
    display_name: 'Test Workflow 2',
    id: '2'
  },
  {
    active: false,
    configuration: {},
    display_name: 'Test Workflow 3',
    id: '3'
  }
];

describe('ProjectStatus', () => {
  let handleDialogCancelStub;
  let handleDialogSuccessStub;
  let loadingIndicator;
  let onChangeWorkflowLevelStub;
  let wrapper;

  before(() => {
    onChangeWorkflowLevelStub = sinon.stub(ProjectStatus.prototype, 'onChangeWorkflowLevel');
    handleDialogCancelStub = sinon.stub(ProjectStatus.prototype, 'handleDialogCancel');
    handleDialogSuccessStub = sinon.stub(ProjectStatus.prototype, 'handleDialogSuccess');

    wrapper = shallow(<ProjectStatus />);
  });

  after(() => {
    onChangeWorkflowLevelStub.restore();
    handleDialogCancelStub.restore();
    handleDialogSuccessStub.restore();
  });

  it('renders without crashing', () => {
    assert.equal(wrapper, wrapper);
  });

  describe('when no project is in component state', () => {
    it('renders Loading Indicator component', () => {
      loadingIndicator = wrapper.find('LoadingIndicator');
      assert.equal(loadingIndicator.length, 1);
    });
  });

  describe('when project is in component state', () => {
    before(() => {
      wrapper.setState({ project });
    });

    it('does not render the LoadingIndicator component', () => {
      loadingIndicator = wrapper.find('LoadingIndicator');
      assert.equal(loadingIndicator.length, 0);
    });

    it('renders a ProjectIcon component', () => {
      wrapper.setState({ project });
      const projectIconComponent = wrapper.find('ProjectIcon');
      assert.equal(projectIconComponent.length, 1);
    });

    it('renders a RedirectToggle component', () => {
      const redirectToggleComponent = wrapper.find('RedirectToggle');
      assert.equal(redirectToggleComponent.length, 1);
    });

    it('renders a ExperimentalFeatures component', () => {
      const experimentalFeaturesComponent = wrapper.find('ExperimentalFeatures');
      assert.equal(experimentalFeaturesComponent.length, 1);
    });

    it('renders a VersionList component', () => {
      const versionListComponent = wrapper.find('VersionList');
      assert.equal(versionListComponent.length, 1);
    });

    it('renders a no workflows found message when no workflow is in component state', () => {
      const noWorkflowsMessage = wrapper.find('.project-status__section').at(2).children().find('div');
      assert.equal(noWorkflowsMessage.text(), 'No workflows found');
    });
  });

  describe('when workflow is in component state', () => {
    before(() => {
      wrapper.setState({ workflows });
    });

    it('displays an asterisk next to the default workflow, if one is set', () => {
      const defaultWorkflow = wrapper.find('li.section-list__item').first().text();
      assert.ok(defaultWorkflow.match(' * '), true);
    });

    it('does not display an asterisk next to a workflow that is not the default workflow', () => {
      const notDefaultWorkflow = wrapper.find('li.section-list__item').last().text();
      assert.ok(notDefaultWorkflow.match(' * '), false);
    });

    it('renders a WorkflowToggle component for each workflow', () => {
      const workflowToggleComponents = wrapper.find('WorkflowToggle');
      assert.equal(workflowToggleComponents.length, workflows.length);
    });

    it('calls #onChangeWorkflowLevel when a user changes a workflow\'s configuration level', () => {
      wrapper.find('select').first().simulate('change');
      sinon.assert.calledOnce(onChangeWorkflowLevelStub);
    });

    it('renders the WorkflowDefaultDialog component when dialogIsOpen state is true', () => {
      wrapper.setState({ dialogIsOpen: true });
      const workflowDefaultDialog = wrapper.find('WorkflowDefaultDialog');
      assert.equal(workflowDefaultDialog.length, 1);
    });

    it('calls #handleDialogCancel when a user cancels the WorkflowDefaultDialog modal', () => {
      const workflowDefaultDialog = wrapper.find('WorkflowDefaultDialog');
      workflowDefaultDialog.simulate('cancel');
      sinon.assert.calledOnce(handleDialogCancelStub);
    });

    it('calls #handleDialogSuccess when a user clicks ok on the WorkflowDefaultDialog modal', () => {
      const workflowDefaultDialog = wrapper.find('WorkflowDefaultDialog');
      workflowDefaultDialog.simulate('success');
      sinon.assert.calledOnce(handleDialogSuccessStub);
    });
  });
});
