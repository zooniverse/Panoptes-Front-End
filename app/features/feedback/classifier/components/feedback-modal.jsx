import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  FeedbackModal: {
    title: 'Feedback'
  }
});
/* eslint-enable max-len */

function FeedbackModal({ messages }) {
  return (
    <section>
      <Translate content="FeedbackModal.title" component="h2" />

      <ul>
        {messages.map(message =>
          <li key={message}>
            {message}
          </li>
        )}
      </ul>
    </section>
  );
}

FeedbackModal.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string)
};

export default FeedbackModal;
