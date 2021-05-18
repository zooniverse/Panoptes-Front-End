import PropTypes from 'prop-types';
import React from 'react';

import TaskTranslations from '../translations'

export function AnnotationView({
  annotation = null,
  onChange,
  task = null,
  translation = null,
}) {
  function handleRemove(index) {
    annotation.value.splice(index, 1);
    onChange(annotation);
  }

  function answerByQuestion(identification) {
    return task.questionsOrder.map((questionID) => {
      const answerKeys = Object.keys(identification.answers);

      if (answerKeys.indexOf(questionID) >= 0) {
        const answerLabels = [].concat(identification.answers[questionID]).map((answerID) => {
          return translation.questions[questionID].answers[answerID].label;
        });
        return answerLabels.join(', ');
      }
    });
  }

  if (!annotation.value) return null;

  return (
    <>
      {annotation.value.map((identification, i) => {
        identification._key = `IDENTIFICATION_KEY_${i}`;
        const answersList = answerByQuestion(identification).filter(Boolean).join('; ').trim();
        const answersLabel = answersList ? `(${answersList})` : ''

        return (
          <span key={identification._key}>
            <span className="survey-identification-proxy">
              {translation.choices[identification.choice].label} {answersLabel}
              {' '}
              <button
                className="survey-identification-remove"
                onClick={i => handleRemove(i)}
                aria-label="Remove"
                type="button"
              >
                &times;
              </button>
            </span>
          </span>
        );
      })}
    </>
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

export default function LocalisedAnnotationView({
  annotation = null,
  onChange,
  task = null,
  workflow = null
}) {
  return (
    <TaskTranslations
      taskKey={annotation.task}
      task={task}
      workflowID={workflow.id}
    >
      <AnnotationView
        annotation={annotation}
        onChange={onChange}
        task={task}
      />
    </TaskTranslations>
  )
};
