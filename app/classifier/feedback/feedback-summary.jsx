import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

counterpart.registerTranslations('en', {
  feedbackSummary: {
    title: 'Feedback on your classification'
  }
});

const FeedbackSummary = ({ feedback }) => {
  const textFeedback = feedback.reduce((result, item) => {
    if (item.target === 'summary') {
      const questionIndex = result.indexOf(feedbackItem => feedbackItem.question === item.question);
      if (questionIndex > -1) {
        result[questionIndex].messages.push(item.message);
      } else {
        result.push({
          question: item.question,
          messages: [item.message]
        });
      }
    }
    return result;
  }, []);

  return (
    <section>
      <strong>
        <Translate content="feedbackSummary.title" />
      </strong>
      <div className="classification-task-summary-with-feedback">
        {textFeedback.map(item => (
          <ul key={item.question}>
            <li>
              <p>{item.question}</p>
              <ul>
                {item.messages.map(message => <li key={message}>{message}</li>)}
              </ul>
            </li>
          </ul>
        ))}
      </div>
    </section>
  );
};

FeedbackSummary.propTypes = {
  feedback: PropTypes.arrayOf(PropTypes.shape({
    target: PropTypes.string,
    question: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.string)
  }))
};

export default FeedbackSummary;