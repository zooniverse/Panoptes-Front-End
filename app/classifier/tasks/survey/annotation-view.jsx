import PropTypes from 'prop-types';
import React from 'react';

function AnnotationView(props) {
  function handleRemove(index) {
    const { annotation, onChange } = props;
    annotation.value.splice(index, 1);
    onChange(annotation);
  }

  function answerByQuestion(identification) {
    const { task } = props;
    return task.questionsOrder.map((questionID) => {
      const answerKeys = Object.keys(identification.answers);

      if (answerKeys.indexOf(questionID) >= 0) {
        const answerLabels = [].concat(identification.answers[questionID]).map((answerID) => {
          return task.questions[questionID].answers[answerID].label;
        });
        return answerLabels.join(', ');
      }
    });
  }

  const { annotation, task } = props;
  if (!annotation.value) return null;

  return (
    <div>
      {annotation.value.map((identification, i) => {
        identification._key = `IDENTIFICATION_KEY_${i}`;
        const answersList = answerByQuestion(identification).filter(Boolean).join('; ');

        return (
          <span key={identification._key}>
            <span className="survey-identification-proxy" title={answersList}>
              {task.choices[identification.choice].label}
              {' '}
              <button
                className="survey-identification-remove"
                onClick={handleRemove.bind(this, i)}
                title="Remove"
                type="button"
              >
                &times;
              </button>
            </span>
          </span>
        );
      })}
    </div>
  );
}

AnnotationView.propTypes = {
  annotation: PropTypes.shape({
    value: PropTypes.array
  }),
  onChange: PropTypes.func.isRequired,
  task: PropTypes.shape({
    choices: PropTypes.object,
    questions: PropTypes.object,
    questionsOrder: PropTypes.array
  })
};

AnnotationView.defaultProps = {
  annotation: null,
  task: null
};

export default AnnotationView;
