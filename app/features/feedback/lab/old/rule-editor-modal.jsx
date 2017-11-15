import React, { Component, PropTypes } from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  RuleEditorModal: {
    title: 'Edit Feedback',
    cancel: 'Cancel',
    save: 'Save'
  }
});
/* eslint-enable max-len */

class RuleEditorModal extends React.Component {
  render() {
    const { handleSave, saveEnabled } = this.props;
    return (
      <div className="edit-feedback-modal">
        <Translate className="form-label" content="feedbackEditForm.title" />
        <div className="edit-feedback-modal__buttons">
          <button className="minor-button">
            <Translate content="cancel" />
          </button>
          <button
            className="major-button"
            disabled={!saveEnabled}
            onClick={handleSave}
          >
            <Translate content="save" />
          </button>
        </div>
      </div>
    );
  }
}

export default RuleEditorModal;
