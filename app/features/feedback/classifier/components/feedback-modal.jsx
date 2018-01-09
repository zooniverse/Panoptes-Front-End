
import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import SubjectViewer from '../../../../components/subject-viewer';

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
    <section className="feedbackmodal">
      <Translate content="FeedbackModal.title" component="h2" />
      {subjectViewerProps && (<SubjectViewer {...subjectViewerProps} />)}
      <ul>
        {messages.map(message =>
          <li key={Math.random()}>
            {message}
          </li>
        )}
      </ul>

      <input
        type="submit"
        value={counterpart('FeedbackModal.ok')}
      />
    </section>
  );
}

FeedbackModal.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string),
  subjectViewerProps: PropTypes.object
};

export default FeedbackModal;
