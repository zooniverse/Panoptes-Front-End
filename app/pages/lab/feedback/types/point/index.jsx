import React, { Component, PropTypes } from 'react';
import ModalFormDialog from 'modal-form/dialog';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

import SingleEditForm from './point-edit-form';

counterpart.registerTranslations('en', {
  PointFeedbackEditor: {
    addType: 'Add a feedback type',
    edit: 'Edit',
    del: 'Delete'
  }
});

class PointFeedbackEditor extends Component {
  constructor(props) {
    super(props);
    this.deleteFeedbackItem = this.deleteFeedbackItem.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.renderFeedbackItem = this.renderFeedbackItem.bind(this);
    this.saveFeedbackChange = this.saveFeedbackChange.bind(this);
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
      required: true
    })
    .catch(error => console.error(error));
  }

  saveFeedbackChange(changed, index) {
    const newFeedback = Object.assign({}, this.props.task.feedback);
    newFeedback.types = newFeedback.types || [];

    if (index > -1) {
      newFeedback.types.splice(index, 1, changed);
    } else {
      newFeedback.types.push(changed);
    }

    this.props.saveFeedbackFn(newFeedback);
  }

  renderFeedbackItem(item, index) {
    const editModalFn = this.openEditModal.bind(this, item, index);
    const deleteItem = this.deleteFeedbackItem.bind(this, index);
    const showIcon = (item.valid) ? null : (<i className="fa fa-exclamation-circle fa-fw" />);

    return (
      <div key={`field-${item.id}`} className="feedback-section__feedback-item">
        {showIcon}
        <span className="feedback-section__feedback-item-label">{item.id}</span>
        <button onClick={editModalFn}>
          <Translate content="PointFeedbackEditor.edit" />
        </button>
        <button onClick={deleteItem}>
          <Translate content="PointFeedbackEditor.del" />
        </button>
      </div>
    );
  }

  render() {
    const { feedback } = this.props.task;
    const isThereFeedback = feedback.types && feedback.types.length;
    const feedbackItems = (isThereFeedback) ? feedback.types.map(this.renderFeedbackItem) : null;

    return (
      <div className="feedback-section">
        <div>
          {feedbackItems}
          <button className="feedback-section__new-feedback-button standard-button" onClick={this.openEditModal}>
            <i className="fa fa-plus-circle" />
            {' '}
            <Translate content="PointFeedbackEditor.addType" />
          </button>
        </div>
      </div>
    );
  }
}

PointFeedbackEditor.propTypes = {
  task: PropTypes.shape({
    feedback: PropTypes.shape({
      types: PropTypes.array(PropTypes.shape({
        answerIndex: PropTypes.string
      }))
    }),
    answers: PropTypes.arrayOf(PropTypes.shape({
      _key: PropTypes.number
    }))
  }),
  saveFeedbackFn: PropTypes.func
};

export default PointFeedbackEditor;
