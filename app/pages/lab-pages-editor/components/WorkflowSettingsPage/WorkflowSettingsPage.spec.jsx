/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': 0 */
/* global describe, it */

import { mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { WorkflowContext } from '../../context.js';
import WorkflowSettingsPage from './WorkflowSettingsPage';
import mockPanoptesResource from '../../../../../test/mock-panoptes-resource';

function render(configuration = {}) {
  const workflow = mockPanoptesResource('workflows', { id: '1', configuration, links: {} });
  const project = mockPanoptesResource('projects', { id: '1', links: {} });
  const update = sinon.stub();
  const wrapper = mount(
    <WorkflowContext.Provider value={{ workflow, project, update }}>
      <WorkflowSettingsPage />
    </WorkflowContext.Provider>
  );
  return { update, wrapper };
}

describe('WorkflowSettingsPage: video_loop', function () {
  it('is unchecked when the workflow has no video_loop', function () {
    const { wrapper } = render();
    assert.equal(wrapper.find('input#video_loop').prop('checked'), false);
  });

  it('is checked when the workflow sets video_loop', function () {
    const { wrapper } = render({ video_loop: true });
    assert.equal(wrapper.find('input#video_loop').prop('checked'), true);
  });

  it('updates configuration.video_loop when toggled', function () {
    const { update, wrapper } = render();
    const input = wrapper.find('input#video_loop');
    input.getDOMNode().checked = true;
    input.simulate('change');
    sinon.assert.calledWith(update, { 'configuration.video_loop': true });
  });
});
