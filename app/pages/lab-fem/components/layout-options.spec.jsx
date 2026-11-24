/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': 0 */
/* global describe, it */

import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import LayoutOptions from './layout-options';
import mockPanoptesResource from '../../../../test/mock-panoptes-resource';

function render(configuration = {}) {
  const workflow = mockPanoptesResource('workflows', { configuration });
  const wrapper = shallow(<LayoutOptions workflow={workflow} />);
  return { workflow, wrapper };
}

describe('LayoutOptions: video_loop', function () {
  it('is unchecked when the workflow has no video_loop', function () {
    const { wrapper } = render();
    assert.equal(wrapper.find('input#video_loop').prop('checked'), false);
  });

  it('is checked when the workflow sets video_loop', function () {
    const { wrapper } = render({ video_loop: true });
    assert.equal(wrapper.find('input#video_loop').prop('checked'), true);
  });

  it('updates configuration.video_loop when toggled', function () {
    const { workflow, wrapper } = render();
    wrapper.find('input#video_loop').simulate('change', { target: { checked: true } });
    sinon.assert.calledWith(workflow.update, { 'configuration.video_loop': true });
  });
});
