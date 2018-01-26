import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import SubjectViewer from '../../../../components/subject-viewer';
import ModalFocus from '../../../../components/modal-focus';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  FeedbackModal: {
    title: 'Feedback',
    ok: 'OK'
  }
});
/* eslint-enable max-len */

function FeedbackModal({ messages, subjectViewerProps }) {
  return (
    <ModalFocus className="feedbackmodal">
      <Translate content="FeedbackModal.title" component="h2" />
      {subjectViewerProps && (<SubjectViewer {...subjectViewerProps} />)}
      <ul>
        {messages.map(message =>
          <li key={Math.random()}>
            {message}
          </li>
        )}
      </ul>

      <button
        className="standard-button"
        type="submit"
        autoFocus={true}
      >
        <Translate content="FeedbackModal.ok" />
      </button>
    </ModalFocus>
  );
}

FeedbackModal.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string),
  subjectViewerProps: PropTypes.object
};

export default FeedbackModal;