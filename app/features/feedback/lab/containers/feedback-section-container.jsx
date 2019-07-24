import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ModalFormDialog from 'modal-form/dialog';
import _ from 'lodash';
import FeedbackSection from '../components/feedback-section';
import RuleEditorModal from './rule-editor-modal-container';

class FeedbackSectionContainer extends Component {
  constructor(props) {
    super(props);
    this.deleteRule = this.deleteRule.bind(this);
    this.openRuleEditorModal = this.openRuleEditorModal.bind(this);
    this.saveRule = this.saveRule.bind(this);
    this.saveRules = this.saveRules.bind(this);
    this.saveTaskChanges = this.saveTaskChanges.bind(this);
  }

  deleteRule(ruleId) {
    const editedTask = _.assign({}, this.props.task);
    editedTask.feedback.rules = _.reject(editedTask.feedback.rules, ['id', ruleId]);
    this.saveTaskChanges(editedTask);
  }

  openRuleEditorModal(rule = {}, feedbackOptions = {}) {
    const modalComponent = (<RuleEditorModal
      rule={rule}
      saveRule={this.saveRule}
      feedbackOptions={feedbackOptions}
    />);
    const modalOptions = {
      closeButton: true
    };

    // We return false in the catch, as ModalFormDialog rejects its promise
    // if the dialog is cancelled, and that doesn't need to be logged.
    ModalFormDialog.alert(modalComponent, modalOptions)
      .catch(() => false);
  }

  saveRule(rule) {
    const editedTask = _.defaults({}, this.props.task, {
      feedback: {
        enabled: false,
        rules: []
      }
    });
    console.log(editedTask.rules);
    editedTask.feedback.rules = _.unionBy([rule], editedTask.feedback.rules, 'id');
    console.log(editedTask.feedback.rules);
    this.saveTaskChanges(editedTask);
  }

  saveRules(rules) {
    const editedTask = _.defaults({}, this.props.task, {
      feedback: {
        enabled: false,
        rules: []
      }
    });
    console.log(editedTask.rules);
    editedTask.feedback.rules = _.unionBy(rules, editedTask.feedback.rules, 'id');
    console.log(editedTask.feedback.rules);
    this.saveTaskChanges(editedTask);
  }

  saveTaskChanges(task) {
    const editedTask = _.assign({}, task);
    editedTask.feedback.enabled = editedTask.feedback.rules.length > 0;
    this.props.saveFn(editedTask);
  }

  render() {
    const rules = _.get(this.props.task, 'feedback.rules', []);

    return (
      <FeedbackSection
        deleteRule={this.deleteRule}
        editRule={this.openRuleEditorModal}
        saveRule={this.saveRule}
        saveRules={this.saveRules}
        rules={rules}
      />
    );
  }
}

FeedbackSectionContainer.propTypes = {
  task: PropTypes.shape({
    type: PropTypes.string,
    feedback: PropTypes.shape({
      enabled: PropTypes.bool
    })
  }),
  saveFn: PropTypes.func
};

export default FeedbackSectionContainer;
