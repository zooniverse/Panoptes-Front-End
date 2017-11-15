import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import ModalFormDialog from 'modal-form/dialog';

import RuleEditorModal from './rule-editor-modal';
import feedbackTypes from './types';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  FeedbackSection: {
    title: 'Feedback',
    enable: 'Enable feedback on this task',
    notAvailable: 'Feedback is not available for this task.',
    help: 'Feedback can help your volunteers improve their accuracy by checking their classification of known subjects, and reporting back on the results in the classification summary.',
    newRule: 'Create new feedback rule'
  }
});
/* eslint-enable max-len */

function isFeedbackAvailable(task) {
  return Object.keys(feedbackTypes).includes(task.type);
}

function showFeedbackRules(task) {
  return task.feedback &&
    task.feedback.enabled &&
    task.feedback.rules &&
    task.feedback.rules.length;
}

export default class FeedbackSection extends React.Component {
  constructor(props) {
    super(props);
    this.handleEnableFeedback = this.handleEnableFeedback.bind(this);
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
    this.renderFeedbackEnable = this.renderFeedbackEnable.bind(this);
    this.renderFeedbackRule = this.renderFeedbackRule.bind(this);
    this.openRuleEditorModal = this.openRuleEditorModal.bind(this);
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
          <Translate content="FeedbackSection.enable" />
        </label>
        {' '}
      </div>
    );
  }

  renderFeedbackRule(rule) {
    // const FeedbackSectionComponent = feedbackTypes[task.type];
    // return <FeedbackSectionComponent task={task} saveFeedbackFn={this.handleFeedbackChange} />;
    console.info(rule)
    return (<div>foo</div>)
  }

  openRuleEditorModal(rule = {}) {
    console.log('open', rule)
    // ModalFormDialog.alert(<SingleEditForm
    //   feedback={feedback}
    //   index={index}
    //   task={this.props.task}
    //   onSubmit={this.saveFeedbackChange}
    // />, {
    //   required: true
    // })
    ModalFormDialog.alert(<RuleEditorModal />, {
      required: true
    })
    .catch(error => console.error(error));
  }

  render() {
    // Unfortunately, the JSON client mutates an object on update, rather than
    // returning a new instance. So prevProps will always be identical to current
    // props, breaking some of the lifecycle methods. This ensures we always have
    // a new object.
    const task = JSON.parse(JSON.stringify(this.props.task));
    const feedbackAvailable = isFeedbackAvailable(task);
    const createNewRule = this.openRuleEditorModal.bind(this, {});

    return (
      <div>
        <div className="form-label">
          <Translate content="FeedbackSection.title" />
        </div>
        <small className="form-help">
          <Translate content="FeedbackSection.help" />
        </small>

        { (feedbackAvailable)
          ? this.renderFeedbackEnable(task)
          : <Translate content="FeedbackSection.notAvailable" /> }

        { (showFeedbackRules(task)) &&
          task.feedback.rules.map(this.renderFeedbackRule) }

        { (feedbackAvailable) &&
          <button onClick={createNewRule}>
            <Translate content="FeedbackSection.newRule" />
          </button> }
      </div>
    );
  }

}

FeedbackSection.propTypes = {
  task: React.PropTypes.shape({
    type: React.PropTypes.string,
    feedback: React.PropTypes.shape({
      enabled: React.PropTypes.bool
    })
  }),
  saveFn: React.PropTypes.func
};
