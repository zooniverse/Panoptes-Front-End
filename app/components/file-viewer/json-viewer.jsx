import { useState, useEffect } from 'react';
import { object, string } from 'prop-types';
import LoadingIndicator from '../loading-indicator';

const cache = {};

function JSONViewer({
  className,
  prefetchedJSON,
  src,
  style
}) {
  const [content, setContent] = useState('Loading…');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!prefetchedJSON);

  function displayJSON(data) {
    const formattedContent = JSON.stringify(data, null, 2);
    setContent(formattedContent);
    setLoading(false);
    setError(null);
  }

  function loadJSON(src) {
    const cachedContent = cache[src];
    if (cachedContent) {
      setContent(cachedContent);
      setLoading(false);
      setError(null);
    } else {
      setLoading(true);
      setError(null);
      setContent('Loading…');
      
      fetch(src)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Format JSON with 2-space indentation
          const formattedContent = JSON.stringify(data, null, 2);
          cache[src] = formattedContent;
          setContent(formattedContent);
          setLoading(false);
          setError(null);
        })
        .catch(error => {
          const errorMessage = `Unable to load JSON: ${error.message}`;
          setError(errorMessage);
          setLoading(false);
          setContent(null);
        });
    }
  }

  useEffect(() => {
    if (prefetchedJSON) {
      displayJSON(prefetchedJSON);
    } else if (src) {
      loadJSON(src);
    }
  }, [src, prefetchedJSON]);

  if (error) {
    return (
      <div className={className} style={style}>
        <div className="json-viewer-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {loading && <LoadingIndicator />}
      {!loading && content && (
        <pre 
          className="json-viewer-content" 
          style={{
            margin: 0,
            padding: '10px',
            overflow: 'auto'
          }}
        >
          {content}
        </pre>
      )}
    </div>
  );
}

JSONViewer.propTypes = {
  className: string,
  prefetchedJSON: object,
  src: string,
  style: object
};

export default JSONViewer;
