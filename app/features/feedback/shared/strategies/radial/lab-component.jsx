import React, { PropTypes } from 'react';
import counterpart from 'counterpart';
import TextInput from '../../components/text-input';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  RadialStrategyOptions: {
    fields: {
      defaultTolerance: {
        title: 'Default Tolerance',
        help: 'Can be overriden by subject metadata.'
      }
    }
  }
});
/* eslint-enable max-len */

// Provide a shortcut for input translation text
function fieldText(selector) {
  return counterpart(`RadialStrategyOptions.fields.${selector}`);
}

function RadialLabComponent({ formState, handleInputChange }) {
  return (
    <div>
      <TextInput
        title={fieldText('defaultTolerance.title')}
        help={fieldText('defaultTolerance.help')}
        name="defaultTolerance"
        value={formState.defaultTolerance}
        onChange={handleInputChange.bind(this)}
        type="number"
        required={true}
      />
    </div>
  );
}

RadialLabComponent.propTypes = {
  formState: PropTypes.shape({
    defaultTolerance: PropTypes.number
  }),
  handleInputChange: PropTypes.func
};

export default RadialLabComponent;
