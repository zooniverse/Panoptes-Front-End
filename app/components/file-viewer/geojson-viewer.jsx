// MapComponent.js
import { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { defaults as defaultControls } from 'ol/control/defaults';
import ScaleLine from 'ol/control/ScaleLine';
import Feature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { Map, TileLayer, VectorLayer, useMap } from 'react-openlayers';

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
  const featureType = feature.getGeometry().getType();
  if (featureType === 'Point') {
    return getPointStyles(feature, resolution);
  }
  // Add styles for other geometry types as needed here, e.g. LineString, Polygon, etc.
  return undefined; // use OpenLayers default styles for LineString, Polygon, etc. for now.
};

/**
 * A vector layer that fits the map view to its extent.
 * @param {props} props
 * @param {Feature[]} props.features - An array of OpenLayers features to display on the map. 
 * @returns {JSX.Element|null} A vector layer containing the provided features, with the map view fitted to their extent. Returns null if the map is not available.
 */
function FittedVectorLayer({ features }) {
  const vectorSource = useMemo(() => new VectorSource({ features }), [features]);
  const map = useMap();
  if (!map) return null;
  const view = map.getView();
  const extent = vectorSource.getExtent();

  if (extent) {
    view.fit(extent, {
      padding: [100, 100, 100, 100],
      maxZoom: 12,
    });
  }

  return <VectorLayer source={vectorSource} style={getFeatureStyles} />;
}

function ReferenceData({ data }) {
  return (
    <dl>
      {Object.entries(data).map(([key, value]) => (
        <Fragment key={key}>
          <dt>{key}</dt>
          <dd>{value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

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
  const features = useMemo(() => geoJsonFormat.readFeatures(jsonData, {
    dataProjection: 'EPSG:4326', // incoming data is WGS 84.
    featureProjection: 'EPSG:3857', // rendered map is Web Mercator.
    featureClass: RenderFeature // render read-only features on the map.
  }), [jsonData]);
  const referenceData = jsonData.reference_data;
  const osm = useMemo(() => new OSM(), []);
  const controls = useMemo(() => defaultControls().extend([new ScaleLine()]), []);

  return (
    <div className="geojson-viewer" style={style}>
      <Map className="ol-map" controls={controls}>
        <TileLayer source={osm} />
        <FittedVectorLayer features={features} />
      </Map>
      {referenceData && (
        <ReferenceData data={referenceData} />
      )}
    </div>
  );
}

GeoJSONViewer.propTypes = {
  jsonData: PropTypes.object.isRequired,
  style: PropTypes.object,
};

export default GeoJSONViewer;

