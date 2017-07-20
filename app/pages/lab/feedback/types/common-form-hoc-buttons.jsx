import React, { PropTypes } from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';

counterpart.registerTranslations('en', {
  save: 'Save',
  cancel: 'Cancel'
});

const CommonFormHOCButtons = ({ disableSave, handleCancel, handleSave }) => (
  <div className="edit-feedback-modal__buttons">
    <button className="minor-button" onClick={handleCancel}>
      <Translate content="cancel" />
    </button>
    <button className="major-button" disabled={disableSave} onClick={handleSave}>
      <Translate content="save" />
    </button>
  </div>
);

CommonFormHOCButtons.propTypes = {
  disableSave: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleSave: PropTypes.func
};

export default CommonFormHOCButtons;
