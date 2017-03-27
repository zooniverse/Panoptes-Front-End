import React from 'react';
import ModalFormDialog from 'modal-form/dialog';
import SingleEditForm from './single-edit-form'

export default class SingleFeedbackEditor extends React.Component {
  constructor(props) {
    super(props);
    this.checkForBrokenAnswers = this.checkForBrokenAnswers.bind(this);
    this.deleteFeedbackItem = this.deleteFeedbackItem.bind(this)
    this.openEditModal = this.openEditModal.bind(this)
    this.renderFeedbackItem = this.renderFeedbackItem.bind(this)
    this.saveFeedbackChange = this.saveFeedbackChange.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    const { task } = this.props;
    const prevTask = prevProps.task;
    const { feedback, answers } = task;
    if (prevTask && feedback.types && feedback.types.length && answers.length !== prevTask.answers.length) {
      this.checkForBrokenAnswers(task, prevTask);
    }
  }

  render() {
    const { feedback } = this.props.task;
    const feedbackItems = (feedback.types && feedback.types.length)
      ? feedback.types.map(this.renderFeedbackItem)
      : null;

    return (
      <div>
        <div>
          <button onClick={this.openEditModal}>Add a feedback type</button>
          {feedbackItems}
        </div>
      </div>
    );
  }

  checkForBrokenAnswers(task, oldTask) {
    // If an answer is added or deleted, that might break our feedback, as it
    // works by tracking the index of the correct answer. This goes through the
    // answers, tries to match any that have moved, and adds a flag where a
    // required answer has been deleted.
    const newAnswerKeys = task.answers.map(answer => answer._key)
    const oldAnswerKeys = oldTask.answers.map(answer => answer._key)

    const checkedFeedback = task.feedback.types.reduce((changeSet, feedbackType, index) => {
      const answerIndex = parseInt(feedbackType.answerIndex, 10);
      if (newAnswerKeys[answerIndex] !== oldAnswerKeys[answerIndex]) {
        const newAnswerIndex = newAnswerKeys.indexOf(oldAnswerKeys[answerIndex]);
        changeSet[index] = (newAnswerIndex > -1)
          ? { answerIndex: newAnswerIndex.toString() }
          : { answerIndex: '', valid: false };
      }
      return changeSet;
    }, {});

    if (Object.keys(checkedFeedback).length) {
      const fixedFeedback = Object.assign({}, task.feedback);
      Object.keys(checkedFeedback).forEach(index => {
        const fixedFeedbackItem = Object.assign({}, fixedFeedback.types[index], checkedFeedback[index]);
        fixedFeedback.types.splice(index, 1, fixedFeedbackItem);
      });
      this.props.saveFeedbackFn(fixedFeedback);
    }
  }

  deleteFeedbackItem(index) {
    const newFeedback = Object.assign({}, this.props.task.feedback);
    newFeedback.types.splice(index, 1);
    this.props.saveFeedbackFn(newFeedback);
  }

  openEditModal(feedback, index = -1) {
    ModalFormDialog.alert(<SingleEditForm
      feedback={feedback}
      index={index}
      task={this.props.task}
      onSubmit={this.saveFeedbackChange}
    />, {
      required: true,
    });
  }

  renderFeedbackItem(item, index) {
    const editModalFn = this.openEditModal.bind(this, item, index);
    const deleteItem = this.deleteFeedbackItem.bind(this, index);
    const showIcon = (item.valid) ? null : (<i className="fa fa-exclamation-circle fa-fw" style={{ color: "red"}}></i>);

    return (
      <div key={index}>
        {showIcon}
        {item.id}
        <button onClick={editModalFn}>Edit</button>
        <button onClick={deleteItem}>Delete</button>
      </div>
    );
  }

  saveFeedbackChange(changed, index) {
    const newFeedback = Object.assign({}, this.props.task.feedback);
    newFeedback.types = newFeedback.types || [];

    (index > -1)
      ? newFeedback.types.splice(index, 1, changed)
      : newFeedback.types.push(changed);

    this.props.saveFeedbackFn(newFeedback);
  }

}

SingleFeedbackEditor.propTypes = {
  task: React.PropTypes.object,
  saveFeedbackFn: React.PropTypes.func,
};
