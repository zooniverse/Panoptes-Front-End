import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '../loading-indicator';
import GeoJSONViewer from './geojson-viewer';
import CanvasViewer from './canvas-viewer';

function JSONContainer(props) {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { src } = props;
    
    if (!src || Array.isArray(src)) {
      setLoading(false);
      setError('Invalid source URL');
      return;
    }

    setLoading(true);
    setError(null);
    
    fetch(src)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setJsonData(data);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        // On fetch error, still pass through to CanvasViewer
        // CanvasViewer/models will handle the error
        console.warn('JSONContainer fetch error:', err);
        setJsonData(null);
        setLoading(false);
        setError(err.message);
      });
  }, [props.src]);

  // Show loading while fetching and inspecting the JSON
  if (loading) {
    return (
      <div className="json-container" style={props.style}>
        <LoadingIndicator />
      </div>
    );
  }

  // If detected as GeoJSON (or JSON with type === 'Feature' or 'FeatureCollection'), use GeoJSONViewer
  if (props.format === 'geo+json' || jsonData?.type === 'Feature' || jsonData?.type === 'FeatureCollection') {
    return <GeoJSONViewer {...props} jsonData={jsonData} />;
  }

  // Otherwise, use CanvasViewer for canvas model rendering
  // Pass jsonData if available to avoid duplicate src requests
  return (
    <CanvasViewer 
      {...props} 
      jsonData={jsonData}
    />
  );
}

JSONContainer.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object
};

export default JSONContainer;
