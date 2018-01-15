import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  FeedbackSection: {
    title: 'Feedback',
    enable: 'Enable feedback on this task',
    notAvailable: 'Feedback is not available for this task.',
    help: 'Feedback can help your volunteers improve their accuracy by checking their classification of known subjects, and reporting back on the results in the classification summary.',
    newRule: 'Create new feedback rule',
    edit: 'Edit',
    del: 'Delete'
  }
});
/* eslint-enable max-len */

function FeedbackSection({ deleteRule, editRule, rules }) {
  return (
    <div className="feedback-section">
      <Translate
        content="FeedbackSection.title"
        className="form-label"
        component="div"
      />
      <Translate
        content="FeedbackSection.help"
        className="form-help"
        component="small"
      />

      <ul>
        {rules.map(rule =>
          <li key={rule.id} className="feedback-section__feedback-item">
            <span className="feedback-section__feedback-item-label">
              {rule.id}
            </span>
            <Translate
              component="button"
              content="FeedbackSection.edit"
              onClick={editRule.bind(this, rule)}
            />
            <Translate
              component="button"
              content="FeedbackSection.del"
              onClick={deleteRule.bind(this, rule.id)}
            />
          </li>
        )}
      </ul>

      <Translate
        content="FeedbackSection.newRule"
        className="form-help"
        component="button"
        onClick={editRule.bind(this, {})}
      />
    </div>
  );
}

FeedbackSection.propTypes = {
  deleteRule: PropTypes.func,
  editRule: PropTypes.func,
  rules: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string
  }))
};

export default FeedbackSection;