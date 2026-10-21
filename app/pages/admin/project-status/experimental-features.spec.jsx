/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': 0 */
/* global describe, it */

import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import ExperimentalFeatures from './experimental-features';
import mockPanoptesResource from '../../../../test/mock-panoptes-resource';

describe('ExperimentalFeatures', function () {
  it('renders an external_workflow checkbox', function () {
    const project = mockPanoptesResource('projects', { experimental_tools: [] });
    const wrapper = shallow(<ExperimentalFeatures project={project} />);
    assert.equal(wrapper.find('input[name="external workflow"]').length, 1);
  });

  it('toggling external_workflow adds it to experimental_tools', function () {
    const project = mockPanoptesResource('projects', { experimental_tools: [] });
    const wrapper = shallow(<ExperimentalFeatures project={project} />);
    wrapper.find('input[name="external workflow"]').simulate('change');
    assert.deepEqual(project.update.lastCall.args[0], { experimental_tools: ['external workflow'] });
  });
});
