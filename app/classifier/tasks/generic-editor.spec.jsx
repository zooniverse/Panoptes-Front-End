/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */

import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import GenericTaskEditor from './generic-editor';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';

const geoDrawingTask = {
  type: 'geoDrawing',
  instruction: 'Mark stuff on the map',
  help: '',
  tools: [
    { type: 'Point', label: 'Tool name', color: '#00ff00' }
  ]
};

const drawingTask = {
  type: 'drawing',
  instruction: 'Draw stuff',
  help: '',
  tools: []
};

describe('GenericTaskEditor: tile_layers editor (geoDrawing)', function () {
  let workflow;
  let wrapper;

  beforeEach(function () {
    workflow = mockPanoptesResource('workflows', {
      configuration: {
        subject_viewer_config: {
          tile_layers: []
        }
      }
    });
    wrapper = shallow(
      <GenericTaskEditor
        task={geoDrawingTask}
        workflow={workflow}
        taskPrefix="tasks.T0"
        project={{ experimental_tools: [] }}
      />
    );
  });

  it('renders an "Add tile layer" button when the task is a geoDrawing task', function () {
    const addButton = wrapper.find('.workflow-tile-layer-add-button');
    assert.equal(addButton.length, 1, 'expected an add-tile-layer button');
  });

  it('clicking "Add tile layer" appends a default tile-layer entry to workflow configuration', function () {
    wrapper.find('.workflow-tile-layer-add-button').simulate('click');
    sinon.assert.calledWith(
      workflow.update,
      sinon.match({
        'configuration.subject_viewer_config.tile_layers': sinon.match.array
      })
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
    workflow.configuration.subject_viewer_config.tile_layers = [
      { label: 'OpenStreetMap', type: 'osm' },
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms' }
    ];
    wrapper = shallow(
      <GenericTaskEditor
        task={geoDrawingTask}
        workflow={workflow}
        taskPrefix="tasks.T0"
        project={{ experimental_tools: [] }}
      />
    );
    const rows = wrapper.find('.workflow-tile-layer-row');
    assert.equal(rows.length, 2);

    const firstLabel = wrapper.find('input[name="configuration.subject_viewer_config.tile_layers.0.label"]');
    assert.equal(firstLabel.length, 1, 'expected a label input on row 0');

    const firstTypeSelect = wrapper.find('select[name="configuration.subject_viewer_config.tile_layers.0.type"]');
    assert.equal(firstTypeSelect.length, 1, 'expected a type select on row 0');

    const secondUrl = wrapper.find('input[name="configuration.subject_viewer_config.tile_layers.1.url"]');
    assert.equal(secondUrl.length, 1, 'expected a url input on row 1');
  });

  it('clicking the remove button on a row drops that entry from the workflow configuration', function () {
    workflow.configuration.subject_viewer_config.tile_layers = [
      { label: 'OpenStreetMap', type: 'osm' },
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms' }
    ];
    wrapper = shallow(
      <GenericTaskEditor
        task={geoDrawingTask}
        workflow={workflow}
        taskPrefix="tasks.T0"
        project={{ experimental_tools: [] }}
      />
    );
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

describe('GenericTaskEditor: tile_layers validation (geoDrawing)', function () {
  function mountWithLayers(tile_layers) {
    const workflow = mockPanoptesResource('workflows', {
      configuration: { subject_viewer_config: { tile_layers } }
    });
    const wrapper = shallow(
      <GenericTaskEditor
        task={geoDrawingTask}
        workflow={workflow}
        taskPrefix="tasks.T0"
        project={{ experimental_tools: [] }}
      />
    );
    return { workflow, wrapper };
  }

  it('renders a LAYERS input on WMS rows bound to the params.LAYERS path', function () {
    const { wrapper } = mountWithLayers([
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms' }
    ]);
    const layersInput = wrapper.find(
      'input[name="configuration.subject_viewer_config.tile_layers.0.params.LAYERS"]'
    );
    assert.equal(layersInput.length, 1, 'expected a LAYERS input on the WMS row');
  });

  it('does not render a LAYERS input on OSM or XYZ rows', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OSM', type: 'osm' },
      { label: 'OpenTopoMap', type: 'xyz', url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png' }
    ]);
    const wmsLayerInputs = wrapper.find('input[name$=".params.LAYERS"]');
    assert.equal(wmsLayerInputs.length, 0);
  });

  it('shows a validation error on a WMS row missing params.LAYERS', function () {
    const { wrapper } = mountWithLayers([
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms' }
    ]);
    const errors = wrapper.find('.workflow-tile-layer-error[data-field="layers"]');
    assert.equal(errors.length, 1, 'expected a LAYERS validation error');
  });

  it('does not show the LAYERS validation error when params.LAYERS is set', function () {
    const { wrapper } = mountWithLayers([
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms', params: { LAYERS: 'fsa2023' } }
    ]);
    const errors = wrapper.find('.workflow-tile-layer-error[data-field="layers"]');
    assert.equal(errors.length, 0);
  });

  it('shows a validation error on an XYZ row with a URL missing {x}/{y}/{z} placeholders', function () {
    const { wrapper } = mountWithLayers([
      { label: 'Bad XYZ', type: 'xyz', url: 'https://example.org/tiles' }
    ]);
    const errors = wrapper.find('.workflow-tile-layer-error[data-field="url"]');
    assert.equal(errors.length, 1, 'expected a URL placeholder validation error');
  });

  it('does not show the URL validation error when an XYZ URL has {x}/{y}/{z} placeholders', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OpenTopoMap', type: 'xyz', url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png' }
    ]);
    const errors = wrapper.find('.workflow-tile-layer-error[data-field="url"]');
    assert.equal(errors.length, 0);
  });

  it('does not show validation errors on OSM rows even when url and params are absent', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OpenStreetMap', type: 'osm' }
    ]);
    const errors = wrapper.find('.workflow-tile-layer-error');
    assert.equal(errors.length, 0);
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

    // WMS row: default + label + type + url + layers + format
    assert.equal(rows.at(1).find('.workflow-tile-layer-field').length, 6);
    assert.equal(rows.at(1).find('.workflow-tile-layer-field[data-field="layers"]').length, 1);
    assert.equal(rows.at(1).find('.workflow-tile-layer-field[data-field="format"]').length, 1);

    // XYZ row: default + label + type + url
    assert.equal(rows.at(2).find('.workflow-tile-layer-field').length, 4);
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

describe('GenericTaskEditor: tile_layers basemap selector (geoDrawing)', function () {
  function mountWithLayers(tile_layers) {
    const workflow = mockPanoptesResource('workflows', {
      configuration: { subject_viewer_config: { tile_layers } }
    });
    const wrapper = shallow(
      <GenericTaskEditor
        task={geoDrawingTask}
        workflow={workflow}
        taskPrefix="tasks.T0"
        project={{ experimental_tools: [] }}
      />
    );
    return { workflow, wrapper };
  }

  it('renders one basemap radio input per tile-layer row', function () {
    const { wrapper } = mountWithLayers([
      { label: 'OSM', type: 'osm' },
      { label: '2023 imagery', type: 'wms', url: 'https://example.org/wms', params: { LAYERS: 'fsa2023' } },
      { label: 'OpenTopoMap', type: 'xyz', url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png' }
    ]);
    const radios = wrapper.find('input[type="radio"][name="workflow-tile-layer-default"]');
    assert.equal(radios.length, 3);
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
    const radios = wrapper.find('input[type="radio"][name="workflow-tile-layer-default"]');
    assert.equal(radios.length, 0);
  });
});

describe('GenericTaskEditor: tile_layers editor (non-geoDrawing tasks)', function () {
  it('does not render the tile-layer editor for non-geoDrawing tasks', function () {
    const workflow = mockPanoptesResource('workflows', { configuration: {} });
    const wrapper = shallow(
      <GenericTaskEditor
        task={drawingTask}
        workflow={workflow}
        taskPrefix="tasks.T0"
        project={{ experimental_tools: [] }}
      />
    );
    assert.equal(wrapper.find('.workflow-tile-layer-add-button').length, 0);
  });
});
