import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import CheckboxInput from '../../shared/components/checkbox-input';
import getGlobalFeedbackOptionsFromRules from '../../shared/helpers/get-global-feedback-options-from-rules';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  FeedbackSection: {
    title: 'Feedback',
    enable: 'Enable feedback on this task',
    notAvailable: 'Feedback is not available for this task.',
    help: 'Feedback can help your volunteers improve their accuracy by checking their classification of known subjects, and reporting back on the results in the classification summary.',
    newRule: 'Create new feedback rule',
    edit: 'Edit',
    del: 'Delete',
    fields: {
      pluralSuccessMessagesEnabled: {
        title: 'Enable pluralized success messages',
        help: 'By default, a separate message is displayed for each successful annotation. Check this box to enter a templated pluralized version of the success message.'
      },
      pluralFailureMessagesEnabled: {
        title: 'Enable pluralized failure messages',
        help: 'By default, a separate message is displayed for each missed annotation. Check this box to enter a templated pluralized version of the failure message.'
      },
      colorizeUniqueMessagesEnabled: {
        title: 'Use a different marker color for each unique message:',
        help: 'Check this box to use a different colour for each unique message. This only applies if specific subjects override the default failure and success messages.'
      },
      successFailureShapesEnabled: {
        title: 'Use a different shaped markers to indicate success and failure:',
        help: 'Check this box to indicate successes using a circle and failures with a square.'
      }
    }
  }
});
/* eslint-enable max-len */

// Provide a shortcut for input translation text
function fieldText(selector) {
  return counterpart(`FeedbackSection.fields.${selector}`);
}

// function FeedbackSection({ deleteRule, editRule, rules }) {
class FeedbackSection extends Component {

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      form: getGlobalFeedbackOptionsFromRules(this.props.rules),
      valid: false
    };
  }

  handleInputChange({target}) {
    const newState = _.assign({}, this.state);
    newState.form[target.name] = (target.type === 'checkbox')
      ? target.checked
      : target.value;
    this.setState(newState, this.validateRule);
    this.props.rules.map(rule => {
      rule[target.name] = (target.type === 'checkbox')
        ? target.checked
        : target.value;
      // FIXME: This reloads everything on every call!
      this.props.saveRule(rule);
    });
  }

  render() {
    const {rules, deleteRule, editRule} = this.props;

    return (<div className="feedback-section">
      <Translate content="FeedbackSection.title" className="form-label" component="div"/>
      <Translate content="FeedbackSection.help" className="form-help" component="small"/>

      <div className="edit-feedback-global-options">

        <CheckboxInput title={fieldText('pluralSuccessMessagesEnabled.title')} help={fieldText('pluralSuccessMessagesEnabled.help')} name="pluralSuccessMessagesEnabled" checked={this.state.form.pluralSuccessMessagesEnabled} onChange={this.handleInputChange.bind(this)}/>

        <CheckboxInput title={fieldText('pluralFailureMessagesEnabled.title')} help={fieldText('pluralFailureMessagesEnabled.help')} name="pluralFailureMessagesEnabled" checked={this.state.form.pluralFailureMessagesEnabled} onChange={this.handleInputChange.bind(this)}/>

        <CheckboxInput title={fieldText('colorizeUniqueMessagesEnabled.title')} help={fieldText('colorizeUniqueMessagesEnabled.help')} name="colorizeUniqueMessagesEnabled" checked={this.state.form.colorizeUniqueMessagesEnabled} onChange={this.handleInputChange.bind(this)}/>

        <CheckboxInput title={fieldText('successFailureShapesEnabled.title')} help={fieldText('successFailureShapesEnabled.help')} name="successFailureShapesEnabled" checked={this.state.form.successFailureShapesEnabled} onChange={this.handleInputChange.bind(this)}/>
      </div>
      <ul>
        {
          rules.map(rule => <li key={rule.id} className="feedback-section__feedback-item">
            <span className="feedback-section__feedback-item-label">
              {rule.id}
            </span>
            <Translate component="button" content="FeedbackSection.edit" onClick={editRule.bind(this, rule, this.state.form)}/>
            <Translate component="button" content="FeedbackSection.del" onClick={deleteRule.bind(this, rule.id)}/>
          </li>)
        }
      </ul>

      <Translate content="FeedbackSection.newRule" className="form-help" component="button" onClick={editRule.bind(this, {}, this.state.form)}/>
    </div>);
  }
}

FeedbackSection.propTypes = {
  deleteRule: PropTypes.func,
  editRule: PropTypes.func,
  saveRule: PropTypes.func,
  rules: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.string}))
};

export default FeedbackSection;
