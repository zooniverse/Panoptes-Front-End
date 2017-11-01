import React from 'react';
import assert from 'assert';
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

  before(() => {
    wrapper = shallow(<ProjectStatus />);

    wrapper.setState({
      project,
      workflows
    });
  });

  it('renders without crashing', () => {
    assert.equal(wrapper, wrapper);
  });

  it('renders a loading indicator if project is not in state', () => {
    wrapper.setState({ project: null });
    loadingIndicator = wrapper.find('LoadingIndicator');
    assert.equal(loadingIndicator.length, 1);
  });

  it('does not render a loading indicator if project is in state', () => {
    wrapper.setState({ project });
    loadingIndicator = wrapper.find('LoadingIndicator');
    assert.equal(loadingIndicator.length, 0);
  });

  it('renders the ProjectIcon component', () => {
    const projectIconComponent = wrapper.find('ProjectIcon');
    assert.equal(projectIconComponent.length, 1);
  });

  it('renders the RedirectToggle component', () => {
    const redirectToggleComponent = wrapper.find('RedirectToggle');
    assert.equal(redirectToggleComponent.length, 1);
  });

  it('renders the ExperimentalFeatures component', () => {
    const experimentalFeaturesComponent = wrapper.find('ExperimentalFeatures');
    assert.equal(experimentalFeaturesComponent.length, 1);
  });

  it('renders the VersionList component', () => {
    const versionListComponent = wrapper.find('VersionList');
    assert.equal(versionListComponent.length, 1);
  });

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

  it('renders the WorkflowDefaultDialog component when dialogIsOpen state is true', () => {
    wrapper.setState({ dialogIsOpen: true });
    const workflowDefaultDialog = wrapper.find('WorkflowDefaultDialog');
    // TODO: Refactor ProjectStatus to only render one WorkflowDefaultDialog component
    assert.equal(workflowDefaultDialog.length, workflows.length);
  });
});
