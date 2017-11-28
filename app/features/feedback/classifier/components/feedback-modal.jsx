import React from 'react';
// import strategies from '';

function FeedbackModal({ feedback }) {
  console.info('feedback')
  return (
    <section>
      <h2>
        Feedback
      </h2>

      <ul>
        {feedback.map(message =>
          <li key={message}>
            {message}
          </li>
        )}
      </ul>
    </section>
  );
}

export default FeedbackModal;
