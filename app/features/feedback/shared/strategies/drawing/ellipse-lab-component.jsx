import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import CheckboxInput from '../../components/checkbox-input';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  StrategyOptions: {
    fields: {
      hideSubjectViewer: {
        title: 'Hide Subject Viewer',
        help: 'By default, the Subject Viewer is shown when a user receives feedback. Check this box to hide it.'
      }
    }
  }
});
/* eslint-enable max-len */

// Provide a shortcut for input translation text
function fieldText(selector) {
  return counterpart(`StrategyOptions.fields.${selector}`);
}

function EllipseLabComponent({ formState, handleInputChange }) {
  return (
    <div>
      <CheckboxInput
        title={fieldText('hideSubjectViewer.title')}
        help={fieldText('hideSubjectViewer.help')}
        name="hideSubjectViewer"
        checked={formState.hideSubjectViewer}
        onChange={handleInputChange.bind(this)}
      />
    </div>
  );
}

EllipseLabComponent.propTypes = {
  formState: PropTypes.shape({
    hideSubjectViewer: PropTypes.bool
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default EllipseLabComponent;
