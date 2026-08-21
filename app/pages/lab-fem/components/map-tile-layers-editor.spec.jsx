/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': 0 */
/* global describe, it */

import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import MapTileLayersEditor from './map-tile-layers-editor';
import mockPanoptesResource from '../../../../test/mock-panoptes-resource';

function mountWithLayers(tile_layers) {
  const workflow = mockPanoptesResource('workflows', {
    configuration: { subject_viewer_config: { tile_layers } }
  });
  const wrapper = shallow(<MapTileLayersEditor workflow={workflow} />);
  return { workflow, wrapper };
}

describe('MapTileLayersEditor: tile_layers editor', function () {
  it('renders an "Add tile layer" button', function () {
    const { wrapper } = mountWithLayers([]);
    assert.equal(wrapper.find('.workflow-tile-layer-add-button').length, 1);
  });

  it('clicking "Add tile layer" appends a default tile-layer entry to workflow configuration', function () {
    const { workflow, wrapper } = mountWithLayers([]);
    wrapper.find('.workflow-tile-layer-add-button').simulate('click');
    sinon.assert.calledWith(
      workflow.update,
      sinon.match({ 'configuration.subject_viewer_config.tile_layers': sinon.match.array })
    );
    const call = workflow.update.getCalls().find(c =>
      c.args[0]['configuration.subject_viewer_config.tile_layers']
    );
    assert.ok(call, 'expected workflow.update to be called for tile_layers');
    const next = call.args[0]['configuration.subject_viewer_config.tile_layers'];
    assert.equal(next.length, 1);
    assert.equal(next[0].type, 'osm');
  });

  it('renders one row per existing tile-layer entry with label, type-select, and url inputs', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OpenStreetMap', type: 'osm' },
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms' }
    ]);
    assert.equal(wrapper.find('.workflow-tile-layer-row').length, 2);
    assert.equal(wrapper.find('input[name="configuration.subject_viewer_config.tile_layers.0.label"]').length, 1);
    assert.equal(wrapper.find('select[name="configuration.subject_viewer_config.tile_layers.0.type"]').length, 1);
    assert.equal(wrapper.find('input[name="configuration.subject_viewer_config.tile_layers.1.url"]').length, 1);
  });

  it('clicking the remove button on a row drops that entry from the workflow configuration', function () {
    const { workflow, wrapper } = mountWithLayers([
      { label: 'OpenStreetMap', type: 'osm' },
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms' }
    ]);
    wrapper.find('.workflow-tile-layer-remove-button').at(0).simulate('click');
    const call = workflow.update.getCalls().find(c =>
      c.args[0]['configuration.subject_viewer_config.tile_layers']
    );
    assert.ok(call, 'expected workflow.update to be called for tile_layers');
    const next = call.args[0]['configuration.subject_viewer_config.tile_layers'];
    assert.equal(next.length, 1);
    assert.equal(next[0].type, 'wms');
  });
});

describe('MapTileLayersEditor: tile_layers validation', function () {
  it('renders a LAYERS input on WMS rows bound to the params.LAYERS path', function () {
    const { wrapper } = mountWithLayers([
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms' }
    ]);
    assert.equal(
      wrapper.find('input[name="configuration.subject_viewer_config.tile_layers.0.params.LAYERS"]').length,
      1
    );
  });

  it('does not render a LAYERS input on OSM or XYZ rows', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OSM', type: 'osm' },
      { label: 'OpenTopoMap', type: 'xyz', url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png' }
    ]);
    assert.equal(wrapper.find('input[name$=".params.LAYERS"]').length, 0);
  });

  it('shows a validation error on a WMS row missing params.LAYERS', function () {
    const { wrapper } = mountWithLayers([
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms' }
    ]);
    assert.equal(wrapper.find('.workflow-tile-layer-error[data-field="layers"]').length, 1);
  });

  it('does not show the LAYERS validation error when params.LAYERS is set', function () {
    const { wrapper } = mountWithLayers([
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms', params: { LAYERS: 'fsa2023' } }
    ]);
    assert.equal(wrapper.find('.workflow-tile-layer-error[data-field="layers"]').length, 0);
  });

  it('shows a validation error on an XYZ row with a URL missing {x}/{y}/{z} placeholders', function () {
    const { wrapper } = mountWithLayers([
      { label: 'Bad XYZ', type: 'xyz', url: 'https://example.org/tiles' }
    ]);
    assert.equal(wrapper.find('.workflow-tile-layer-error[data-field="url"]').length, 1);
  });

  it('does not show the URL validation error when an XYZ URL has {x}/{y}/{z} placeholders', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OpenTopoMap', type: 'xyz', url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png' }
    ]);
    assert.equal(wrapper.find('.workflow-tile-layer-error[data-field="url"]').length, 0);
  });

  it('does not show validation errors on OSM rows even when url and params are absent', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OpenStreetMap', type: 'osm' }
    ]);
    assert.equal(wrapper.find('.workflow-tile-layer-error').length, 0);
  });

  it('renders each field as a block-level row inside the tile-layer entry (one field per visual row)', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OpenStreetMap', type: 'osm' },
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms', params: { LAYERS: 'fsa2023' } },
      { label: 'OpenTopoMap', type: 'xyz', url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png' }
    ]);
    const rows = wrapper.find('.workflow-tile-layer-row');
    assert.equal(rows.length, 3);

    // With 2+ layers every row also gets a basemap default radio.
    // OSM row: default + label + type
    assert.equal(rows.at(0).find('.workflow-tile-layer-field').length, 3);
    assert.equal(rows.at(0).find('.workflow-tile-layer-field[data-field="default"]').length, 1);
    assert.equal(rows.at(0).find('.workflow-tile-layer-field[data-field="label"]').length, 1);
    assert.equal(rows.at(0).find('.workflow-tile-layer-field[data-field="type"]').length, 1);

    // WMS row: default + label + type + url + layers + format + params
    assert.equal(rows.at(1).find('.workflow-tile-layer-field').length, 7);
    assert.equal(rows.at(1).find('.workflow-tile-layer-field[data-field="layers"]').length, 1);
    assert.equal(rows.at(1).find('.workflow-tile-layer-field[data-field="format"]').length, 1);
    assert.equal(rows.at(1).find('.workflow-tile-layer-field[data-field="params"]').length, 1);

    // XYZ row: default + label + type + url + params
    assert.equal(rows.at(2).find('.workflow-tile-layer-field').length, 5);
    assert.equal(rows.at(2).find('.workflow-tile-layer-field[data-field="url"]').length, 1);
    assert.equal(rows.at(2).find('.workflow-tile-layer-field[data-field="layers"]').length, 0);
  });

  it('offers every FEM-supported layer type (osm, wms, xyz, cog) in the type select', function () {
    const { wrapper } = mountWithLayers([
      { label: 'Base', type: 'osm' }
    ]);
    const options = wrapper
      .find('select[name="configuration.subject_viewer_config.tile_layers.0.type"] option')
      .map((o) => o.prop('value'));
    assert.deepEqual(options, ['osm', 'wms', 'xyz', 'cog']);
  });

  it('renders a COG layer with a url field but no LAYERS or FORMAT fields', function () {
    const { wrapper } = mountWithLayers([
      { label: 'Elevation COG', type: 'cog', url: 'https://example.org/dem.tif' }
    ]);
    const row = wrapper.find('.workflow-tile-layer-row').at(0);
    assert.equal(row.find('.workflow-tile-layer-field[data-field="url"]').length, 1);
    assert.equal(row.find('.workflow-tile-layer-field[data-field="layers"]').length, 0);
    assert.equal(row.find('.workflow-tile-layer-field[data-field="format"]').length, 0);
    assert.equal(row.find('.workflow-tile-layer-error').length, 0);
  });
});

describe('MapTileLayersEditor: tile_layers basemap selector', function () {
  it('renders one basemap radio input per tile-layer row', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OSM', type: 'osm' },
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms', params: { LAYERS: 'fsa2023' } },
      { label: 'OpenTopoMap', type: 'xyz', url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png' }
    ]);
    assert.equal(wrapper.find('input[type="radio"][name="workflow-tile-layer-default"]').length, 3);
  });

  it('checks the radio of the layer marked default: true', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OSM', type: 'osm' },
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms', params: { LAYERS: 'fsa2023' }, default: true }
    ]);
    const radios = wrapper.find('input[type="radio"][name="workflow-tile-layer-default"]');
    assert.equal(radios.at(0).prop('checked'), false);
    assert.equal(radios.at(1).prop('checked'), true);
  });

  it('selecting a row\'s radio sets default: true on that row and clears default on others', function () {
    const { workflow, wrapper } = mountWithLayers([
      { label: 'OSM', type: 'osm', default: true },
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms', params: { LAYERS: 'fsa2023' } }
    ]);
    wrapper.find('input[type="radio"][name="workflow-tile-layer-default"]').at(1).simulate('change');
    const call = workflow.update.getCalls().find(c =>
      c.args[0]['configuration.subject_viewer_config.tile_layers']
    );
    assert.ok(call, 'expected workflow.update to be called for tile_layers');
    const next = call.args[0]['configuration.subject_viewer_config.tile_layers'];
    assert.equal(next.length, 2);
    assert.equal(next[0].default, false);
    assert.equal(next[1].default, true);
  });

  it('does not render the basemap selector when there is only one tile layer', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OSM', type: 'osm' }
    ]);
    assert.equal(wrapper.find('input[type="radio"][name="workflow-tile-layer-default"]').length, 0);
  });
});

describe('MapTileLayersEditor: Configurable Params', function () {
  let workflow;

  function mount(tile_layers) {
    const mounted = mountWithLayers(tile_layers);
    workflow = mounted.workflow;
    return mounted.wrapper;
  }

  function lastTileLayers() {
    const call = workflow.update.getCalls().reverse().find(c =>
      c.args[0]['configuration.subject_viewer_config.tile_layers']
    );
    assert.ok(call, 'expected workflow.update to be called for tile_layers');
    return call.args[0]['configuration.subject_viewer_config.tile_layers'];
  }

  it('renders a Configurable Params row per non-reserved param', function () {
    const wrapper = mount([
      { type: 'cog', url: 'https://example.org/cog.tif', params: { bands: [1, 2, 3] } }
    ]);
    assert.equal(wrapper.find('.workflow-tile-layer-param-row').length, 1);
    assert.equal(wrapper.find('input[aria-label="Param key"]').prop('value'), 'bands');
    assert.equal(wrapper.find('input[aria-label="Param value"]').prop('value'), '[1,2,3]');
  });

  it('does not list reserved LAYERS/FORMAT as generic param rows', function () {
    const wrapper = mount([
      { type: 'wms', url: 'https://example.org/wms', params: { LAYERS: 'lc', FORMAT: 'image/png' } }
    ]);
    assert.equal(wrapper.find('.workflow-tile-layer-param-row').length, 0);
  });

  it('"+ Add Param" appends a new param key', function () {
    const wrapper = mount([
      { type: 'cog', url: 'https://example.org/cog.tif', params: {} }
    ]);
    wrapper.find('.workflow-tile-layer-param-add-button').simulate('click');
    assert.deepEqual(Object.keys(lastTileLayers()[0].params), ['param1']);
  });

  it('parses a value as JSON (array)', function () {
    const wrapper = mount([
      { type: 'cog', url: 'https://example.org/cog.tif', params: { bands: [1] } }
    ]);
    wrapper.find('input[aria-label="Param value"]').simulate('change', { target: { value: '[1, 2, 3]' } });
    assert.deepEqual(lastTileLayers()[0].params.bands, [1, 2, 3]);
  });

  it('parses a numeric value as a number', function () {
    const wrapper = mount([
      { type: 'cog', url: 'https://example.org/cog.tif', params: { nodata: 255 } }
    ]);
    wrapper.find('input[aria-label="Param value"]').simulate('change', { target: { value: '0' } });
    assert.strictEqual(lastTileLayers()[0].params.nodata, 0);
  });

  it('keeps a non-JSON value as a string', function () {
    const wrapper = mount([
      { type: 'xyz', url: 'https://example.org/{z}/{x}/{y}.png', params: { projection: 'x' } }
    ]);
    wrapper.find('input[aria-label="Param value"]').simulate('change', { target: { value: 'EPSG:26915' } });
    assert.strictEqual(lastTileLayers()[0].params.projection, 'EPSG:26915');
  });

  it('removes a single param and preserves reserved fields', function () {
    const wrapper = mount([
      { type: 'wms', url: 'https://example.org/wms', params: { LAYERS: 'lc', FORMAT: 'image/png', TILED: true } }
    ]);
    assert.equal(wrapper.find('.workflow-tile-layer-param-row').length, 1);
    wrapper.find('.workflow-tile-layer-param-remove-button').simulate('click');
    assert.deepEqual(lastTileLayers()[0].params, { LAYERS: 'lc', FORMAT: 'image/png' });
  });
});
