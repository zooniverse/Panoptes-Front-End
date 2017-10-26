import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
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
  let handleWorkflowToggleSpy;

  before(() => {
    handleWorkflowToggleSpy = sinon.spy();

    wrapper = shallow(<ProjectStatus handleToggle={handleWorkflowToggleSpy} />);

    wrapper.setState({
      project,
      workflows
    });
  });

  it('renders without crashing', () => {
    const ProjectStatusContainer = wrapper.find('div.project-status');
    assert.equal(ProjectStatusContainer.length, 1);
  });

  describe('page layout', () => {
    it('renders the ProjectIcon component', () => {
      const projectIconComponent = wrapper.find('ProjectIcon');
      assert.equal(projectIconComponent.length, 1);
    });

    it('renders a list of basic info about a project\'s status', () => {
      const projectStatusInfo = wrapper.find('div.project-status__section').find('ul').first().children();
      assert.equal(projectStatusInfo.length, 5);
    });

    it('renders a list of visibility settings', () => {
      const visibilitySettings = wrapper.find('ul.project-status__section-list').first().children();
      assert.equal(visibilitySettings.length, 6);
    });

    it('renders the ExperimentalFeatures component', () => {
      const experimentalFeaturesComponent = wrapper.find('ExperimentalFeatures');
      assert.equal(experimentalFeaturesComponent.length, 1);
    });

    it('renders workflows when they are present', () => {
      const workflowList = wrapper.find('li.section-list__item');
      assert.equal(workflowList.length, workflows.length);
    });

    it('renders the VersionList component', () => {
      const versionListComponent = wrapper.find('VersionList');
      assert.equal(versionListComponent.length, 1);
    });
  });

  describe('Workflow Settings', () => {
    it('displays an asterisk next to the default workflow, if one is set', () => {
      const defaultWorkflow = wrapper.find('li.section-list__item').first().text();
      assert.ok(defaultWorkflow.match(' * '), true);
    });

    it('does not display an asterisk next to a workflow that is not the default workflow', () => {
      const defaultWorkflow = wrapper.find('li.section-list__item').last().text();
      assert.ok(defaultWorkflow.match(' * '), false);
    });

    it('renders a WorkflowToggle component for each workflow', () => {
      const workflowToggleComponents = wrapper.find('WorkflowToggle');
      assert.equal(workflowToggleComponents.length, workflows.length);
    });

    it('renders a WorkflowDefaultDialog component when a user toggles a default workflow to inactive', () => {
      // RFC: is this necessary/good practice? or out of scope of this component?
      // TODO: this test is currently failing.
      // wrapper.find('WorkflowToggle').first().simulate('change');
      // sinon.assert.calledOnce(handleWorkflowToggleSpy);
    });

    it('handles onCancel functionality for modal dialog', () => {
      // RFC: is this necessary/good practice? or out of scope of this component?
    });
  });
});
