import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import feedbackTypes from './types';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  feedbackEditor: {
    title: 'Feedback',
    enable: 'Enable feedback on this task',
    notAvailable: 'Feedback is not available for this task.',
    help: 'Feedback can help your volunteers improve their accuracy by checking their classification of known subjects, and reporting back on the results in the classification summary.'
  }
});
/* eslint-enable max-len */

function isFeedbackAvailable(task) {
  return Object.keys(feedbackTypes).includes(task.type);
}

function renderNoFeedback() {
  return <Translate content="feedbackEditor.notAvailable" />;
}

export default class FeedbackEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleEnableFeedback = this.handleEnableFeedback.bind(this);
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
    this.renderFeedbackEnable = this.renderFeedbackEnable.bind(this);
    this.renderFeedbackForm = this.renderFeedbackForm.bind(this);
  }

  handleEnableFeedback(e) {
    const newFeedback = Object.assign({}, this.props.task.feedback);
    newFeedback.enabled = e.target.checked;
    this.handleFeedbackChange(newFeedback);
  }

  handleFeedbackChange(feedback) {
    // Requires a complete representation of the feedback object each time.
    const editedTask = Object.assign({}, this.props.task, { feedback });
    return this.props.saveFn(editedTask);
  }

  renderFeedbackEnable(task) {
    const labelId = 'enable-feedback-button';
    return (
      <div>
        <label className="pill-button" htmlFor={labelId}>
          <input
            id={labelId}
            type="checkbox"
            checked={task.feedback && task.feedback.enabled}
            onChange={this.handleEnableFeedback}
          />
          {' '}
          <Translate content="feedbackEditor.enable" />
        </label>
        {' '}
      </div>
    );
  }

  renderFeedbackForm(task) {
    const FeedbackEditorComponent = feedbackTypes[task.type];
    return <FeedbackEditorComponent task={task} saveFeedbackFn={this.handleFeedbackChange} />;
  }

  render() {
    // Unfortunately, the JSON client mutates an object on update, rather than
    // returning a new instance. So prevProps will always be identical to current
    // props, breaking some of the lifecycle methods. This ensures we always have
    // a new object.
    const task = JSON.parse(JSON.stringify(this.props.task));

    return (
      <div>
        <div className="form-label">
          <Translate content="feedbackEditor.title" />
        </div>
        <small className="form-help">
          <Translate content="feedbackEditor.help" />
        </small>

        { (isFeedbackAvailable(task)) ? this.renderFeedbackEnable(task) : renderNoFeedback() }

        { (task.feedback && task.feedback.enabled) ? this.renderFeedbackForm(task) : null }
      </div>
    );
  }

}

FeedbackEditor.propTypes = {
  task: React.PropTypes.shape({
    type: React.PropTypes.string,
    feedback: React.PropTypes.shape({
      enabled: React.PropTypes.bool
    })
  }),
  saveFn: React.PropTypes.func
};
