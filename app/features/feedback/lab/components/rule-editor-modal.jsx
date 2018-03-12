import PropTypes from 'prop-types';
import React, { Component } from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import _ from 'lodash';

import TextInput from '../../shared/components/text-input';
import CheckboxInput from '../../shared/components/checkbox-input';
import SelectInput from '../../shared/components/select-input';
import strategies from '../../shared/strategies';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  RuleEditorModal: {
    title: 'Edit Feedback',
    strategy: 'Feedback strategy',
    fields: {
      id: {
        title: 'ID',
        help: 'The unique identifier for a feedback rule.'
      },
      successEnabled: {
        title: 'Enable positive feedback',
        help: 'Shows a feedback message to the user when they correctly identify a known subject.'
      },
      defaultSuccessMessage: {
        title: 'Default success message',
        help: 'The message to show to the volunteer when they make a correct classification. Can be overridden using subject metadata.'
      },
      failureEnabled: {
        title: 'Enable negative feedback',
        help: 'Shows a feedback message to the user when they incorrectly identify a known subject.'
      },
      defaultFailureMessage: {
        title: 'Default failure message',
        help: 'The message to show to the volunteer when they make an incorrect classification. Can be overridden using subject metadata.'
      }
    },
    buttons: {
      save: 'Save rule'
    }
  }
});
/* eslint-enable max-len */

// Provide a shortcut for input translation text
function fieldText(selector) {
  return counterpart(`RuleEditorModal.fields.${selector}`);
}

// Return the lab component for a given strategy
function getStrategyComponent(strategy) {
  return _.get(strategies, `${strategy}.labComponent`, null);
}

// Create values for the strategy select dropdown
const strategyOptions = _.map(strategies, strategy => ({
  value: strategy.id,
  label: strategy.title
}));

class RuleEditorModal extends Component {
  constructor(props) {
    super(props);
    this.strategySelectInterface = this.strategySelectInterface.bind(this);
  }

  // Convert the react-select output to an object that can be parsed by the
  // handleInputChange prop, which expects an input event.
  strategySelectInterface(option) {
    const payload = {
      target: {
        name: 'strategy',
        value: (option) ? option.value : ''
      }
    };
    return this.props.handleInputChange(payload);
  }

  render() {
    const { formState, handleInputChange, handleSave, valid } = this.props;
    const StrategyComponent = getStrategyComponent(formState.strategy);
    return (
      <div className="edit-feedback-modal">

        <Translate className="form-label" content="RuleEditorModal.title" />

        <TextInput
          title={fieldText('id.title')}
          help={fieldText('id.help')}
          name="id"
          value={formState.id}
          onChange={handleInputChange.bind(this)}
          required={true}
        />

        <CheckboxInput
          title={fieldText('successEnabled.title')}
          help={fieldText('successEnabled.help')}
          name="successEnabled"
          checked={formState.successEnabled}
          onChange={handleInputChange.bind(this)}
        />

        {formState.successEnabled && (
          <TextInput
            title={fieldText('defaultSuccessMessage.title')}
            help={fieldText('defaultSuccessMessage.help')}
            name="defaultSuccessMessage"
            value={formState.defaultSuccessMessage}
            onChange={handleInputChange.bind(this)}
          />
        )}

        <CheckboxInput
          title={fieldText('failureEnabled.title')}
          help={fieldText('failureEnabled.help')}
          name="failureEnabled"
          checked={formState.failureEnabled}
          onChange={handleInputChange.bind(this)}
        />

        {formState.failureEnabled && (
          <TextInput
            title={fieldText('defaultFailureMessage.title')}
            help={fieldText('defaultFailureMessage.help')}
            name="defaultFailureMessage"
            value={formState.defaultFailureMessage}
            onChange={handleInputChange.bind(this)}
          />
        )}

        <Translate className="form-label" content="RuleEditorModal.strategy" />

        <SelectInput
          name="strategy"
          value={formState.strategy}
          placeholder="Select a strategy"
          options={strategyOptions}
          onChange={this.strategySelectInterface}
        />

        {(StrategyComponent) &&
          <StrategyComponent formState={formState} handleInputChange={handleInputChange} />
        }

        <div className="edit-feedback-modal__buttons">
          <input
            disabled={!valid}
            className="major-button"
            onClick={handleSave.bind(this)}
            type="submit"
            value={counterpart('RuleEditorModal.buttons.save')}
          />
        </div>

      </div>
    );
  }
}

RuleEditorModal.propTypes = {
  formState: PropTypes.shape({
    defaultFailureMessage: PropTypes.string,
    defaultSuccessMessage: PropTypes.string,
    failureEnabled: PropTypes.bool,
    id: PropTypes.string,
    strategy: PropTypes.string,
    successEnabled: PropTypes.bool
  }),
  handleInputChange: PropTypes.func,
  handleSave: PropTypes.func,
  valid: PropTypes.bool
};

export default RuleEditorModal;
