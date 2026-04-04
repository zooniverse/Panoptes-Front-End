// MapComponent.js
import { Fragment, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control/defaults';
import ScaleLine from 'ol/control/ScaleLine';
import Feature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Circle, Fill, Stroke, Style } from 'ol/style';

const geoJsonFormat = new GeoJSON();

const pointStyle = {
  radius: 8,
  fill: new Fill({
    color: 'red'
  }),
  stroke: new Stroke({
    color: 'white',
    width: 2,
  }),
};

const pointMarkerStyle = new Style({
  image: new Circle(pointStyle)
});

function getUncertaintyStyle(radiusPixels) {
  return new Style({
    image: new Circle({
      radius: radiusPixels,
      stroke: new Stroke({ color: 'red', width: 2, lineDash: [5, 10] })
    })
  });
}

function getPointStyles(feature, resolution) {
  if (feature.getGeometry().getType() !== 'Point') return [];
  const uncertaintyRadius = feature.get('uncertainty_radius');
  const uncertaintyRadiusPixels = uncertaintyRadius ? uncertaintyRadius / resolution : 0;
  const styles = [pointMarkerStyle];

  if (uncertaintyRadius) {
    styles.unshift(getUncertaintyStyle(uncertaintyRadiusPixels));
  }

  return styles;
};

function getFeatureStyles(feature, resolution) {
  if (feature.getGeometry().getType() === 'Point') {
    return getPointStyles(feature, resolution);
  }
  // Add styles for other geometry types as needed
  return [];
};

/**
 * Initialise a map and vector source with a list of geoJSON features.
 * @param {HTMLElement} target 
 * @param {Feature[]} features 
 * @returns {{map: Map, vectorSource: VectorSource}}
 */
function createMap(target, features) {
  const osmLayer = new TileLayer({
    preload: Infinity,
    source: new OSM(),
  });
  const view = new View();
  const controls = defaultControls().extend([
    new ScaleLine()
  ]);
  
  const vectorSource = new VectorSource({ features });
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: getFeatureStyles
  });
  const layers = [osmLayer, vectorLayer];
  const extent = vectorSource.getExtent();
  if (extent) {
    view.fit(extent, {
      padding: [100, 100, 100, 100],
      maxZoom: 12,
      duration: 250
    });
  }
  const map = new Map({ target, layers, view, controls });

  return { map, vectorSource };
};

/**
 * A subject viewer for WGS 84 GeoJSON features. Displays features on an OpenLayers map,
 * and optionally displays reference data in a definition list beneath the map.
 * @param {Object} props
 * @param {Object} props.jsonData - The GeoJSON data to display, including an optional `reference_data` object.
 * @param {Feature[]} props.jsonData.features - An array of GeoJSON features to display on the map.
 * @param {Record<string, string>} [props.jsonData.reference_data] - Optional reference data to display alongside the map.
 * @param {Object} [props.style] - Optional styles to apply to the viewer container. 
 * @returns 
 */
function GeoJSONViewer({
  jsonData,
  style
}) {
  const mapRef = useRef(null);
  const features = useMemo(() => geoJsonFormat.readFeatures(jsonData, {
    dataProjection: 'EPSG:4326', // incoming data is WGS 84.
    featureProjection: 'EPSG:3857', // rendered map is Web Mercator.
    featureClass: RenderFeature // render read-only features on the map.
  }), [jsonData]);
  const referenceData = jsonData.reference_data;

  useEffect(() => {
    if (!mapRef.current) return;
    const { map, vectorSource} = createMap(mapRef.current, features);

    return () => {
      map.setTarget(undefined);
      vectorSource?.clear();
    };
  }, [features]);

  return (
    <div className="geojson-viewer" style={style}>
      <div
        className="ol-map"
        ref={mapRef}
        tabIndex={0}
      />
      {referenceData && (
        <dl>
          {Object.entries(referenceData || {}).map(([key, value]) => (
            <Fragment key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
      )}
    </div>
  );
}

GeoJSONViewer.propTypes = {
  jsonData: PropTypes.object.isRequired,
  style: PropTypes.object,
};

export default GeoJSONViewer;

