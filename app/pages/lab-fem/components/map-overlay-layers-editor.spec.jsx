/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': 0 */
/* global describe, it */

import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import MapOverlayLayersEditor from './map-overlay-layers-editor';
import mockPanoptesResource from '../../../../test/mock-panoptes-resource';

function mountWithLayers(overlay_layers) {
  const workflow = mockPanoptesResource('workflows', {
    configuration: { subject_viewer_config: { overlay_layers } }
  });
  const wrapper = shallow(<MapOverlayLayersEditor workflow={workflow} />);
  return { workflow, wrapper };
}

describe('MapOverlayLayersEditor: overlay_layers editor', function () {
  it('renders an "Add overlay layer" button', function () {
    const { wrapper } = mountWithLayers([]);
    assert.equal(wrapper.find('.workflow-overlay-layer-add-button').length, 1);
  });

  it('clicking "Add overlay layer" appends a default wfs entry to workflow configuration', function () {
    const { workflow, wrapper } = mountWithLayers([]);
    wrapper.find('.workflow-overlay-layer-add-button').simulate('click');
    const call = workflow.update.getCalls().find(c =>
      c.args[0]['configuration.subject_viewer_config.overlay_layers']
    );
    assert.ok(call, 'expected workflow.update to be called for overlay_layers');
    const next = call.args[0]['configuration.subject_viewer_config.overlay_layers'];
    assert.equal(next.length, 1);
    assert.equal(next[0].type, 'wfs');
  });

  it('renders one row per entry with type-select, label, and url inputs', function () {
    const { wrapper } = mountWithLayers([
      { type: 'wfs', label: 'Hydrography', url: 'https://example.org/wfs', typeName: 'nhd:NHDFlowline' },
      { type: 'geojson', label: 'Project area', url: 'https://example.org/area.geojson' }
    ]);
    assert.equal(wrapper.find('.workflow-overlay-layer-row').length, 2);
    assert.equal(wrapper.find('select[name="configuration.subject_viewer_config.overlay_layers.0.type"]').length, 1);
    assert.equal(wrapper.find('input[name="configuration.subject_viewer_config.overlay_layers.0.label"]').length, 1);
    assert.equal(wrapper.find('input[name="configuration.subject_viewer_config.overlay_layers.1.url"]').length, 1);
  });

  it('clicking the remove button on a row drops that entry from the workflow configuration', function () {
    const { workflow, wrapper } = mountWithLayers([
      { type: 'wfs', label: 'Hydrography', url: 'https://example.org/wfs', typeName: 'nhd:NHDFlowline' },
      { type: 'geojson', label: 'Project area', url: 'https://example.org/area.geojson' }
    ]);
    wrapper.find('.workflow-overlay-layer-remove-button').at(0).simulate('click');
    const call = workflow.update.getCalls().find(c =>
      c.args[0]['configuration.subject_viewer_config.overlay_layers']
    );
    assert.ok(call, 'expected workflow.update to be called for overlay_layers');
    const next = call.args[0]['configuration.subject_viewer_config.overlay_layers'];
    assert.equal(next.length, 1);
    assert.equal(next[0].type, 'geojson');
  });

  it('shows the typeName field only for wfs entries', function () {
    const { wrapper } = mountWithLayers([
      { type: 'wfs', label: '', url: 'https://example.org/wfs', typeName: 'nhd:NHDFlowline' },
      { type: 'geojson', label: '', url: 'https://example.org/area.geojson' }
    ]);
    assert.equal(wrapper.find('input[name="configuration.subject_viewer_config.overlay_layers.0.typeName"]').length, 1);
    assert.equal(wrapper.find('input[name="configuration.subject_viewer_config.overlay_layers.1.typeName"]').length, 0);
  });

  it('flags a missing url', function () {
    const { wrapper } = mountWithLayers([
      { type: 'geojson', label: 'No url yet', url: '' }
    ]);
    const errors = wrapper.find('.workflow-overlay-layer-error[data-field="url"]');
    assert.equal(errors.length, 1);
  });

  it('flags a wfs entry missing its typeName', function () {
    const { wrapper } = mountWithLayers([
      { type: 'wfs', label: '', url: 'https://example.org/wfs', typeName: '' }
    ]);
    const errors = wrapper.find('.workflow-overlay-layer-error[data-field="typeName"]');
    assert.equal(errors.length, 1);
  });

  it('renders an attribution input per row', function () {
    const { wrapper } = mountWithLayers([
      { type: 'geojson', label: '', url: 'https://example.org/area.geojson' }
    ]);
    assert.equal(wrapper.find('input[name="configuration.subject_viewer_config.overlay_layers.0.attributions"]').length, 1);
  });
});
