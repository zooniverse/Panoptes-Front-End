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
  let wrapper;
  let loadingIndicator;
  let onChangeWorkflowLevelSpy;
  let handleDialogCancelSpy;
  let handleDialogSuccessSpy;
  let handleToggleSpy;
  let event;


  before(() => {
    onChangeWorkflowLevelSpy = sinon.stub(ProjectStatus.prototype, 'onChangeWorkflowLevel');
    handleDialogCancelSpy = sinon.stub(ProjectStatus.prototype, 'handleDialogCancel');
    handleDialogSuccessSpy = sinon.stub(ProjectStatus.prototype, 'handleDialogSuccess');
    handleToggleSpy = sinon.stub(ProjectStatus.prototype, 'handleToggle');

    wrapper = shallow(<ProjectStatus />);

    wrapper.setState({
      project,
      workflows
    });
  });

  it('renders without crashing', () => {
    assert.equal(wrapper, wrapper);
  });

  describe('custom components', () => {
    it('LoadingIndicator renders if project is not in state', () => {
      wrapper.setState({ project: null });
      loadingIndicator = wrapper.find('LoadingIndicator');
      assert.equal(loadingIndicator.length, 1);
    });

    it('LoadingIndicator does not render if project is in state', () => {
      wrapper.setState({ project });
      loadingIndicator = wrapper.find('LoadingIndicator');
      assert.equal(loadingIndicator.length, 0);
    });

    it('ProjectIcon renders', () => {
      const projectIconComponent = wrapper.find('ProjectIcon');
      assert.equal(projectIconComponent.length, 1);
    });

    it('RedirectToggle renders', () => {
      const redirectToggleComponent = wrapper.find('RedirectToggle');
      assert.equal(redirectToggleComponent.length, 1);
    });

    it('ExperimentalFeatures renders', () => {
      const experimentalFeaturesComponent = wrapper.find('ExperimentalFeatures');
      assert.equal(experimentalFeaturesComponent.length, 1);
    });

    it('VersionList renders', () => {
      const versionListComponent = wrapper.find('VersionList');
      assert.equal(versionListComponent.length, 1);
    });
  });

  describe('workflow settings', () => {
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

    it('calls #handleToggle when a user clicks the active toggle on a workflow', () => {
      const notDefaultWorkflow = wrapper.find('WorkflowToggle').last();
      notDefaultWorkflow.simulate('click', event);
      sinon.assert.calledOnce(handleToggleSpy);
    });

    it('calls #onChangeWorkflowLevel when a user changes a workflow\'s configuration level', () => {
      wrapper.find('select').first().simulate('change');
      sinon.assert.calledOnce(onChangeWorkflowLevelSpy);
    });

    it('renders the WorkflowDefaultDialog component when dialogIsOpen state is true', () => {
      wrapper.setState({ dialogIsOpen: true });
      const workflowDefaultDialog = wrapper.find('WorkflowDefaultDialog');
      assert.equal(workflowDefaultDialog.length, 1);
    });

    it('calls #handleDialogCancel when a user cancels the WorkflowDefaultDialog modal', () => {
      const workflowDefaultDialog = wrapper.find('WorkflowDefaultDialog');
      workflowDefaultDialog.simulate('cancel');
      sinon.assert.calledOnce(handleDialogCancelSpy);
    });

    it('calls #handleDialogSuccess when a user clicks ok on the WorkflowDefaultDialog modal', () => {
      const workflowDefaultDialog = wrapper.find('WorkflowDefaultDialog');
      workflowDefaultDialog.simulate('success');
      sinon.assert.calledOnce(handleDialogSuccessSpy);
    });
  });
});
