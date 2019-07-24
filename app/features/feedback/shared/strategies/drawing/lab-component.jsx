import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import TextInput from '../../components/text-input';
import CheckboxInput from '../../components/checkbox-input';
import NumericInput from '../../components/numeric-input';


/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  StrategyOptions: {
    fields: {
      defaultTolerance: {
        title: 'Default Tolerance',
        help: 'Can be overriden by subject metadata.'
      },
      hideSubjectViewer: {
        title: 'Hide Subject Viewer',
        help: 'By default, the Subject Viewer is shown when a user receives feedback. Check this box to hide it.'
      },
      pluralSuccessMessagesEnabled: {
        title: 'Enable pluralized success messages',
        help: 'By default, a separate message is displayed for each successful annotation. Check this box to enter a templated pluralized version of the success message.'
      },
      defaultOpacity : {
        title: 'Radial Feedback Only: Default marker fill opacity:',
        help: 'Defines the alpha value of the marker fill. A value of 1 implies opaque fill, a value of 0 implies tranparent fill. Can be overriden by subject metadata.'
      }
    }
  }
});
/* eslint-enable max-len */

// Provide a shortcut for input translation text
function fieldText(selector) {
  return counterpart(`StrategyOptions.fields.${selector}`);
}

function LabComponent({ formState, handleInputChange }) {
  return (
    <div>
      <CheckboxInput
        title={fieldText('hideSubjectViewer.title')}
        help={fieldText('hideSubjectViewer.help')}
        name="hideSubjectViewer"
        checked={formState.hideSubjectViewer}
        onChange={handleInputChange.bind(this)}
      />

      <TextInput
        title={fieldText('defaultTolerance.title')}
        help={fieldText('defaultTolerance.help')}
        name="defaultTolerance"
        value={formState.defaultTolerance}
        onChange={handleInputChange.bind(this)}
        type="number"
        required={true}
      />

      <NumericInput
          title={fieldText('defaultOpacity.title')}
          help={fieldText('defaultOpacity.help')}
          name="defaultOpacity"
          onChange={handleInputChange.bind(this)}
          min={0}
          max={1}
          step={0.1}
          value={formState.defaultOpacity}
          placeholder={0.1}
        />
    </div>
  );
}

LabComponent.propTypes = {
  formState: PropTypes.shape({
    defaultTolerance: PropTypes.string,
    hideSubjectViewer: PropTypes.bool,
    defaultOpacity: PropTypes.oneOfType([PropTypes.string,PropTypes.number])
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default LabComponent;
