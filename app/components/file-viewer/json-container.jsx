import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '../loading-indicator';
import JSONViewer from './json-viewer';
import CanvasViewer from './canvas-viewer';

function JSONContainer(props) {
  const [prefetchedJSON, setPrefetchedJSON] = useState(null);
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
        setPrefetchedJSON(data);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        // On fetch error, still pass through to CanvasViewer
        // CanvasViewer/models will handle the error
        console.warn('JSONContainer fetch error:', err);
        setPrefetchedJSON(null);
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

  // If detected as GeoJSON (type === 'Feature' or 'FeatureCollection'), use JSONViewer
  if (prefetchedJSON?.type === 'Feature' || prefetchedJSON?.type === 'FeatureCollection') {
    return <JSONViewer {...props} prefetchedJSON={prefetchedJSON} />;
  }

  // Otherwise, use CanvasViewer for canvas model rendering
  // Pass prefetchedJSON if available to avoid duplicate src requests
  return (
    <CanvasViewer 
      {...props} 
      prefetchedJSON={prefetchedJSON}
    />
  );
}

JSONContainer.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object
};

export default JSONContainer;
