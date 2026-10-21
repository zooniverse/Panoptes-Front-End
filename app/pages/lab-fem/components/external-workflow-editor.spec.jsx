/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': 0 */
/* global describe, it */

import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import { MarkdownEditor } from 'markdownz';
import ExternalWorkflowEditor from './external-workflow-editor';
import mockPanoptesResource from '../../../../test/mock-panoptes-resource';

function mountWith(configuration = {}) {
  const workflow = mockPanoptesResource('workflows', { configuration });
  const wrapper = shallow(<ExternalWorkflowEditor workflow={workflow} />);
  return { workflow, wrapper };
}

describe('ExternalWorkflowEditor', function () {
  it('renders a url input bound to configuration.external_workflow_url', function () {
    const { wrapper } = mountWith({ external_workflow_url: 'https://example.org/cfe' });
    const input = wrapper.find('input[name="configuration.external_workflow_url"]');
    assert.equal(input.length, 1);
    assert.equal(input.prop('type'), 'url');
    assert.equal(input.prop('value'), 'https://example.org/cfe');
  });

  it('renders a MarkdownEditor bound to configuration.external_workflow_description', function () {
    const { wrapper } = mountWith({ external_workflow_description: 'Hello **there**' });
    const editor = wrapper.find(MarkdownEditor);
    assert.equal(editor.length, 1);
    assert.equal(editor.prop('name'), 'configuration.external_workflow_description');
    assert.equal(editor.prop('value'), 'Hello **there**');
  });

  it('renders empty fields when the external workflow keys are not configured', function () {
    const { wrapper } = mountWith();
    assert.equal(wrapper.find('input[name="configuration.external_workflow_url"]').prop('value'), '');
    assert.equal(wrapper.find(MarkdownEditor).prop('value'), '');
  });

  it('changing the url input updates the workflow at the dotted path', function () {
    const { workflow, wrapper } = mountWith();
    wrapper.find('input[name="configuration.external_workflow_url"]').simulate('change', {
      target: { name: 'configuration.external_workflow_url', type: 'url', value: 'https://example.org/cfe' }
    });
    assert.deepEqual(workflow.update.lastCall.args[0], { 'configuration.external_workflow_url': 'https://example.org/cfe' });
  });

  it('warns when the url does not start with https://', function () {
    const { wrapper } = mountWith({ external_workflow_url: 'http://example.org/cfe' });
    assert.equal(wrapper.find('.workflow-external-workflow-error').length, 1);
  });

  it('does not warn for an https url, an empty url, or a whitespace-only url', function () {
    assert.equal(mountWith({ external_workflow_url: 'https://example.org/cfe' }).wrapper.find('.workflow-external-workflow-error').length, 0);
    assert.equal(mountWith({ external_workflow_url: '' }).wrapper.find('.workflow-external-workflow-error').length, 0);
    assert.equal(mountWith({ external_workflow_url: '   ' }).wrapper.find('.workflow-external-workflow-error').length, 0);
  });
});
