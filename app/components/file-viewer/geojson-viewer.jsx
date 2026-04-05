// MapComponent.js
import { Fragment, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Map, View } from 'ol';
import Feature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { getCenter } from 'ol/extent';
import { Circle, Stroke, Style } from 'ol/style';
import RBush from 'ol/geom/Point';
import { Vector } from 'ol/source';

const geoJsonFormat = new GeoJSON();

const pointStyle = {
  radius: 8,
  color: 'red',
  stroke: new Stroke({
    color: 'white',
    width: 2,
  }),
};

function getStyles(feature, resolution) {
  const uncertaintyRadius = feature.get('uncertainty_radius');
  const uncertaintyRadiusPixels = uncertaintyRadius ? uncertaintyRadius / resolution : 0;
  const styles = [
    new Style({
      image: new Circle(pointStyle)
    })
  ];
  if (uncertaintyRadius) {
    styles.unshift(new Style({
      image: new Circle({
        radius: uncertaintyRadiusPixels,
        stroke: new Stroke({ color: 'red', width: 2, lineDash: [5, 10] })
      })
    }));
  }
  return styles;
};

/**
 * Initialise a map and vector source with a list of geoJSON features.
 * @param {HTMLElement} target 
 * @param {Feature[]} features 
 * @returns {{map: Map, vectorSource: VectorSource}}
 */
function createMap(target, features) {
  const center = getCenter(features[0].getGeometry().getExtent());
  const osmLayer = new TileLayer({
    preload: Infinity,
    source: new OSM(),
  });
  const vectorLayer = new VectorLayer();
  const view = new View({
    center,
    zoom: 15,
  });
  const resolution = view.getResolution();
  const layers = [osmLayer];
  if (vectorLayer) {
    layers.push(vectorLayer);
  }
  const map = new Map({ target, layers, view,});
  features.forEach(feature => {
    feature.setStyle(getStyles(feature, resolution));
  });

  let vectorSource;
  try {
    // this throws: InternalError: too much recursion, in RBush, even though spatial indexing is disabled.
    vectorSource = new VectorSource({ useSpatialIndex: false });
  } catch (error) {
    console.error("Error creating vector source:", error);
  }
  vectorSource?.addFeatures(features);
  vectorLayer.setSource(vectorSource);
  const extent = vectorSource?.getFeatures()?.getExtent();
  if (extent) {
    view.fit(extent, {
      padding: [32, 32, 32, 32],
      maxZoom: 12,
      duration: 250
    });
  }

  return { map, vectorSource };
};

/**
 * 
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
    dataProjection: 'EPSG:4326', // WGS 84
    featureProjection: 'EPSG:3857', // Web Mercator
    featureClass: RenderFeature
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

