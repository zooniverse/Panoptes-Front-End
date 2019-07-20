import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import TextInput from '../../components/text-input';
import CheckboxInput from '../../components/checkbox-input';

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
      pluralFailureMessagesEnabled: {
        title: 'Enable pluralized failure messages',
        help: 'By default, a separate message is displayed for each missed annotation. Check this box to enter a templated pluralized version of the failure message.'
      },
      pluralSuccessMessagesEnabled: {
        title: 'Enable pluralized success messages',
        help: 'By default, a separate message is displayed for each successful annotation. Check this box to enter a templated pluralized version of the success message.'
      },
      defaultPluralFailureMessage: {
        title: 'Default pluralized failure message:',
        help: 'Enter a pluralized failure message here. You can use the "${count}" placeholder to specify the number of failures e.g. "You missed ${count} objects."'
      },
      defaultPluralSuccessMessage: {
        title: 'Default pluralized success message:',
        help: 'Enter a pluralized success message here. You can use the "${count}" placeholder to specify the number of successes e.g. "You found ${count} objects."'
      },
      colorizeUniqueMessagesEnabled: {
        title: 'Use a different marker color for each unique message:',
        help: 'Check this box to use a different colour for each unique message. This only applies if specific subjects override the default failure and success messages.'
      },
      successFailureShapesEnabled: {
        title: 'Use a different shaped markers to indicate success and failure:',
        help: 'Check this box to indicate successes using a circle and failures with a square.'
      },
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
    </div>
  );
}

LabComponent.propTypes = {
  formState: PropTypes.shape({
    defaultTolerance: PropTypes.string,
    hideSubjectViewer: PropTypes.bool,
    pluralSuccessMessagesEnabled: PropTypes.bool,
    pluralFailureMessagesEnabled: PropTypes.bool,
    defaultPluralSuccessMessage: PropTypes.string,
    defaultPluralFailureMessage: PropTypes.string,
    colorizeUniqueMessagesEnabled: PropTypes.bool,
    successFailureShapesEnabled: PropTypes.bool
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default LabComponent;
