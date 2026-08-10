import React from 'react';
import AutoSave from '../../../components/auto-save.coffee';
import handleInputChange from '../../../lib/handle-input-change.js';

const OVERLAY_LAYERS_PATH = 'configuration.subject_viewer_config.overlay_layers';

export default function MapOverlayLayersEditor({ workflow = null }) {
  const handleChange = handleInputChange.bind(workflow);
  const overlayLayers = workflow.configuration?.subject_viewer_config?.overlay_layers ?? [];

  function writeOverlayLayers(next) {
    workflow.update({ [OVERLAY_LAYERS_PATH]: next });
  }

  function addOverlayLayer() {
    const current = overlayLayers.slice();
    current.push({ type: 'wfs', label: '', url: '', typeName: '' });
    writeOverlayLayers(current);
  }

  function removeOverlayLayer(index) {
    const current = overlayLayers.slice();
    current.splice(index, 1);
    writeOverlayLayers(current);
  }

  return (
    <div className="workflow-overlay-layers-editor">
      <span className="form-label">Map overlay layers</span>
      <br />
      <small className="form-help">Configure WFS / GeoJSON vector overlays rendered on top of the active basemap during classification (e.g. county lines, hydrography, public lands).</small>
      {overlayLayers.map((layer, index) => {
        const urlMissing = !(layer.url ?? '').trim();
        const typeNameMissing = layer.type === 'wfs' && !(layer.typeName ?? '').trim();
        const urlPlaceholder = layer.type === 'geojson'
          ? 'https://example.org/features.geojson'
          : 'https://hydro.nationalmap.gov/arcgis/services/nhd/MapServer/WFSServer?';
        return (
          <div key={index} className="workflow-overlay-layer-row">
            <AutoSave resource={workflow}>
              <div className="workflow-overlay-layer-field workflow-overlay-layer-type-row" data-field="type">
                <label>
                  Type{' '}
                  <br />
                  <select
                    name={`${OVERLAY_LAYERS_PATH}.${index}.type`}
                    value={layer.type || 'wfs'}
                    onChange={handleChange}
                  >
                    <option value="wfs">WFS (OGC Web Feature Service)</option>
                    <option value="geojson">GeoJSON (static or {'{bbox}'}-templated URL)</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="workflow-overlay-layer-remove-button"
                  title="Remove overlay layer"
                  onClick={() => removeOverlayLayer(index)}
                >&times;</button>
              </div>
              <div className="workflow-overlay-layer-field" data-field="label">
                <label>
                  Label
                  <br />
                  <input
                    type="text"
                    className="standard-input full"
                    placeholder="This is what the volunteer will see..."
                    name={`${OVERLAY_LAYERS_PATH}.${index}.label`}
                    value={layer.label || ''}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="workflow-overlay-layer-field" data-field="url">
                <label>
                  URL
                  <br />
                  <input
                    type="text"
                    className="standard-input full"
                    placeholder={urlPlaceholder}
                    name={`${OVERLAY_LAYERS_PATH}.${index}.url`}
                    value={layer.url || ''}
                    onChange={handleChange}
                  />
                </label>
                {urlMissing && (
                  <small className="workflow-overlay-layer-error" data-field="url" role="alert">
                    Overlay layer requires a URL.
                  </small>
                )}
              </div>
              {layer.type === 'wfs' && (
                <div className="workflow-overlay-layer-field" data-field="typeName">
                  <label>
                    typeName
                    <br />
                    <input
                      type="text"
                      className="standard-input full"
                      placeholder="nhd:NHDFlowline"
                      name={`${OVERLAY_LAYERS_PATH}.${index}.typeName`}
                      value={layer.typeName || ''}
                      onChange={handleChange}
                    />
                  </label>
                  {typeNameMissing && (
                    <small className="workflow-overlay-layer-error" data-field="typeName" role="alert">
                      WFS overlays require a typeName (e.g. <code>nhd:NHDFlowline</code>).
                    </small>
                  )}
                </div>
              )}
              <div className="workflow-overlay-layer-field" data-field="attributions">
                <label>
                  Attribution (optional)
                  <br />
                  <input
                    type="text"
                    className="standard-input full"
                    name={`${OVERLAY_LAYERS_PATH}.${index}.attributions`}
                    value={layer.attributions || ''}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </AutoSave>
          </div>
        );
      })}
      <button
        type="button"
        className="workflow-overlay-layer-add-button"
        title="Add overlay layer"
        onClick={addOverlayLayer}
      >+ Add overlay layer</button>
    </div>
  );
}
