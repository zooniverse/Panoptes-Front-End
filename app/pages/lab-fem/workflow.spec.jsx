/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': 0 */
/* global describe, it */

import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import { EditWorkflowPage } from './workflow';
import ExternalWorkflowEditor from './components/external-workflow-editor';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';

function mountPage({ experimental_tools = [], configuration = {}, tasks = {} } = {}) {
  const project = mockPanoptesResource('projects', {
    slug: 'zooniverse/my-project',
    live: false,
    experimental_tools
  });
  const workflow = mockPanoptesResource('workflows', {
    display_name: 'CFE Workflow',
    active: true,
    first_task: '',
    tasks,
    steps: [],
    configuration: { subject_viewer: 'jsonData', ...configuration }
  });
  const wrapper = shallow(
    <EditWorkflowPage project={project} workflow={workflow} location={{ query: {} }} />,
    { context: { router: { createHref: () => '/classify', push() {} } } }
  );
  return { project, workflow, wrapper };
}

describe('lab-fem EditWorkflowPage: external workflow', function () {
  it('renders the ExternalWorkflowEditor when the project has the external workflow tool', function () {
    const { wrapper } = mountPage({ experimental_tools: ['external workflow'] });
    assert.equal(wrapper.find(ExternalWorkflowEditor).length, 1);
  });

  it('does not render the ExternalWorkflowEditor without the external workflow tool', function () {
    const { wrapper } = mountPage();
    assert.equal(wrapper.find(ExternalWorkflowEditor).length, 0);
  });

  it('disables "Test this workflow" when there are no tasks and no external url', function () {
    const { wrapper } = mountPage({ experimental_tools: ['external workflow'] });
    assert.equal(wrapper.find('a.standard-button').length, 0);
    assert.equal(wrapper.find('span.standard-button').length, 1);
  });

  it('enables "Test this workflow" for a task-less workflow with an external url', function () {
    const { wrapper } = mountPage({
      experimental_tools: ['external workflow'],
      configuration: { external_workflow_url: 'https://example.org/cfe' }
    });
    assert.equal(wrapper.find('a.standard-button').length, 1);
    assert.equal(wrapper.find('span.standard-button').length, 0);
  });

  it('keeps "Test this workflow" disabled for a task-less workflow with an external url but no tool flag', function () {
    const { wrapper } = mountPage({
      configuration: { external_workflow_url: 'https://example.org/cfe' }
    });
    assert.equal(wrapper.find('a.standard-button').length, 0);
  });

  it('treats a whitespace-only external url as unset', function () {
    const { wrapper } = mountPage({
      experimental_tools: ['external workflow'],
      configuration: { external_workflow_url: '   ' }
    });
    assert.equal(wrapper.find('a.standard-button').length, 0);
  });
});
