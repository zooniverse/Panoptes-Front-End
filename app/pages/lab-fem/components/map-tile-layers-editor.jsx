import React from 'react';
import AutoSave from '../../../components/auto-save.coffee';
import handleInputChange from '../../../lib/handle-input-change.js';

// Params with dedicated typed fields (kept out of the generic Configurable Params editor).
const TILE_LAYER_RESERVED_PARAMS = ['LAYERS', 'FORMAT'];
const TILE_LAYERS_PATH = 'configuration.subject_viewer_config.tile_layers';

// A param value is parsed as JSON so [1, 2, 3] / 0 / true become real types; non-JSON stays a string.
function parseTileLayerParamValue(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    return raw;
  }
}

function displayTileLayerParamValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function nextTileLayerParamKey(layer) {
  const existing = Object.keys(layer?.params ?? {});
  let i = 1;
  while (existing.includes(`param${i}`)) i += 1;
  return `param${i}`;
}

export default function MapTileLayersEditor({ workflow = null }) {
  const handleChange = handleInputChange.bind(workflow);
  const tileLayers = workflow.configuration?.subject_viewer_config?.tile_layers ?? [];

  function writeTileLayers(next) {
    workflow.update({ [TILE_LAYERS_PATH]: next });
  }

  function addTileLayer() {
    const current = tileLayers.slice();
    current.push({ label: '', type: 'osm', url: '', params: { FORMAT: 'image/png' } });
    writeTileLayers(current);
  }

  function removeTileLayer(index) {
    const current = tileLayers.slice();
    current.splice(index, 1);
    writeTileLayers(current);
  }

  function setBasemapDefault(index) {
    const next = tileLayers.map((layer, i) => Object.assign({}, layer, { default: i === index }));
    writeTileLayers(next);
  }

  function tileLayerParamEntries(index) {
    const layer = tileLayers[index];
    return Object.entries(layer?.params ?? {}).filter(([key]) => !TILE_LAYER_RESERVED_PARAMS.includes(key));
  }

  function writeTileLayerParams(index, entries) {
    const current = tileLayers.slice();
    const layer = current[index];
    if (!layer) return;
    const params = {};
    Object.entries(layer.params ?? {}).forEach(([key, value]) => {
      if (TILE_LAYER_RESERVED_PARAMS.includes(key)) params[key] = value;
    });
    entries.forEach(([key, value]) => {
      if (key != null && key !== '') params[key] = value;
    });
    current[index] = Object.assign({}, layer, { params });
    writeTileLayers(current);
  }

  function addTileLayerParam(index) {
    const layer = tileLayers[index];
    const entries = tileLayerParamEntries(index);
    entries.push([nextTileLayerParamKey(layer), '']);
    writeTileLayerParams(index, entries);
  }

  function setTileLayerParamKey(index, paramIndex, e) {
    const entries = tileLayerParamEntries(index);
    if (!entries[paramIndex]) return;
    entries[paramIndex] = [e.target.value, entries[paramIndex][1]];
    writeTileLayerParams(index, entries);
  }

  function setTileLayerParamValue(index, paramIndex, e) {
    const entries = tileLayerParamEntries(index);
    if (!entries[paramIndex]) return;
    entries[paramIndex] = [entries[paramIndex][0], parseTileLayerParamValue(e.target.value)];
    writeTileLayerParams(index, entries);
  }

  function removeTileLayerParam(index, paramIndex) {
    const entries = tileLayerParamEntries(index);
    entries.splice(paramIndex, 1);
    writeTileLayerParams(index, entries);
  }

  return (
    <div className="workflow-tile-layers-editor">
      <span className="form-label">Map tile layers</span>
      <br />
      <small className="form-help">Configure basemap layers volunteers can switch between in the map viewer.</small>
      {tileLayers.map((layer, index) => {
        const urlMissingPlaceholders = layer.type === 'xyz'
          && (!/\{x\}/.test(layer.url ?? '') || !/\{y\}/.test(layer.url ?? '') || !/\{z\}/.test(layer.url ?? ''));
        const layersMissing = layer.type === 'wms' && !layer.params?.LAYERS;
        const urlPlaceholder = layer.type === 'xyz'
          ? 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png'
          : 'https://example.org/cgi-bin/wms?';
        const paramEntries = Object.entries(layer.params ?? {})
          .filter(([key]) => !TILE_LAYER_RESERVED_PARAMS.includes(key));
        return (
          <div key={index} className="workflow-tile-layer-row">
            <AutoSave resource={workflow}>
              <div className="workflow-tile-layer-field workflow-tile-layer-type-row" data-field="type">
                <label>
                  Type{' '}
                  <br />
                  <select
                    name={`${TILE_LAYERS_PATH}.${index}.type`}
                    value={layer.type || 'osm'}
                    onChange={handleChange}
                  >
                    <option value="osm">OpenStreetMap (osm)</option>
                    <option value="wms">WMS</option>
                    <option value="xyz">XYZ tiles</option>
                    <option value="cog">Cloud Optimized GeoTIFF (cog)</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="workflow-tile-layer-remove-button"
                  title="Remove tile layer"
                  onClick={() => removeTileLayer(index)}
                >&times;</button>
              </div>
              <div className="workflow-tile-layer-field" data-field="label">
                <label>
                  Label
                  <br />
                  <input
                    type="text"
                    className="standard-input full"
                    placeholder="This is what the volunteer will see..."
                    name={`${TILE_LAYERS_PATH}.${index}.label`}
                    value={layer.label || ''}
                    onChange={handleChange}
                  />
                </label>
              </div>
              {layer.type !== 'osm' && (
                <div className="workflow-tile-layer-field" data-field="url">
                  <label>
                    URL
                    <br />
                    <input
                      type="text"
                      className="standard-input full"
                      placeholder={urlPlaceholder}
                      name={`${TILE_LAYERS_PATH}.${index}.url`}
                      value={layer.url || ''}
                      onChange={handleChange}
                    />
                  </label>
                  {urlMissingPlaceholders && (
                    <small className="workflow-tile-layer-error" data-field="url" role="alert">
                      XYZ URL must contain {'{x}'}, {'{y}'}, and {'{z}'} placeholders.
                    </small>
                  )}
                </div>
              )}
              {layer.type === 'wms' && (
                <div className="workflow-tile-layer-field" data-field="layers">
                  <label>
                    Layer
                    <br />
                    <input
                      type="text"
                      className="standard-input full"
                      placeholder="nlcd_2019_land_cover_l48"
                      name={`${TILE_LAYERS_PATH}.${index}.params.LAYERS`}
                      value={layer.params?.LAYERS || ''}
                      onChange={handleChange}
                    />
                  </label>
                  {layersMissing && (
                    <small className="workflow-tile-layer-error" data-field="layers" role="alert">
                      WMS layer requires a LAYERS parameter.
                    </small>
                  )}
                </div>
              )}
              {layer.type === 'wms' && (
                <div className="workflow-tile-layer-field" data-field="format">
                  <label>
                    FORMAT
                    <br />
                    <select
                      name={`${TILE_LAYERS_PATH}.${index}.params.FORMAT`}
                      value={layer.params?.FORMAT || 'image/png'}
                      onChange={handleChange}
                    >
                      <option value="image/png">PNG (image/png)</option>
                      <option value="image/png; mode=8bit">PNG 8-bit (image/png; mode=8bit)</option>
                      <option value="image/png8">PNG 8-bit (image/png8)</option>
                      <option value="image/jpeg">JPEG (image/jpeg)</option>
                      <option value="image/vnd.jpeg-png">JPEG/PNG hybrid (image/vnd.jpeg-png)</option>
                      <option value="image/vnd.jpeg-png8">JPEG/PNG8 hybrid (image/vnd.jpeg-png8)</option>
                      <option value="image/gif">GIF (image/gif)</option>
                      <option value="image/tiff">TIFF (image/tiff)</option>
                      <option value="image/tiff8">TIFF 8-bit (image/tiff8)</option>
                      <option value="image/geotiff">GeoTIFF (image/geotiff)</option>
                      <option value="image/geotiff8">GeoTIFF 8-bit (image/geotiff8)</option>
                      <option value="image/svg+xml">SVG (image/svg+xml)</option>
                      <option value="image/webp">WebP (image/webp)</option>
                      <option value="image/bmp">BMP (image/bmp)</option>
                      <option value="application/pdf">PDF (application/pdf)</option>
                    </select>
                  </label>
                </div>
              )}
              {layer.type !== 'osm' && (
                <div className="workflow-tile-layer-field" data-field="params">
                  <label>Configurable Params</label>
                  <br />
                  <small className="form-help">Extra options passed to the map source. Values are parsed as JSON, e.g. {'[1, 2, 3]'} or {'0'}; plain text stays a string.</small>
                  {paramEntries.map(([paramKey, paramValue], paramIndex) => (
                    <div key={paramIndex} className="workflow-tile-layer-param-row">
                      <input
                        type="text"
                        className="standard-input"
                        placeholder="key"
                        aria-label="Param key"
                        value={paramKey}
                        onChange={(e) => setTileLayerParamKey(index, paramIndex, e)}
                      />
                      <input
                        type="text"
                        className="standard-input"
                        placeholder="value"
                        aria-label="Param value"
                        value={displayTileLayerParamValue(paramValue)}
                        onChange={(e) => setTileLayerParamValue(index, paramIndex, e)}
                      />
                      <button
                        type="button"
                        className="workflow-tile-layer-param-remove-button"
                        title="Remove param"
                        onClick={() => removeTileLayerParam(index, paramIndex)}
                      >&times;</button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="workflow-tile-layer-param-add-button"
                    title="Add param"
                    onClick={() => addTileLayerParam(index)}
                  >+ Add Param</button>
                </div>
              )}
              {tileLayers.length > 1 && (
                <div className="workflow-tile-layer-field" data-field="default">
                  <label>
                    <input
                      type="radio"
                      name="workflow-tile-layer-default"
                      checked={!!layer.default}
                      onChange={() => setBasemapDefault(index)}
                    />{' '}
                    Default basemap
                  </label>
                </div>
              )}
            </AutoSave>
          </div>
        );
      })}
      <button
        type="button"
        className="workflow-tile-layer-add-button"
        title="Add tile layer"
        onClick={addTileLayer}
      >+ Add tile layer</button>
    </div>
  );
}
