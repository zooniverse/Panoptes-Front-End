import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  FeedbackModal: {
    title: 'Feedback',
    ok: 'OK'
  }
});
/* eslint-enable max-len */

function FeedbackModal({ messages }) {
  console.info('messages', messages);
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

      <input
        type="submit"
        value={counterpart('FeedbackModal.ok')}
      />
    </section>
  );
}

FeedbackModal.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string)
};

export default FeedbackModal;
