import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import DrawingLabComponent from '../drawing/lab-component';

counterpart.registerTranslations('en', {
  GeoStrategyOptions: {
    help: 'Geo strategies grade geoDrawing (map) tasks only. The tolerance is a distance in meters.'
  }
});

function GeoLabComponent({ formState, handleInputChange }) {
  return (
    <div>
      <p className="form-help">{counterpart('GeoStrategyOptions.help')}</p>
      <DrawingLabComponent formState={formState} handleInputChange={handleInputChange} />
    </div>
  );
}

GeoLabComponent.propTypes = {
  formState: PropTypes.shape({
    defaultTolerance: PropTypes.string,
    hideSubjectViewer: PropTypes.bool
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default GeoLabComponent;
