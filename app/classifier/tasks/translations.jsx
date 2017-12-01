import React from 'react';
import merge from 'lodash/merge';
import { connect } from 'react-redux';

function TaskTranslations(props) {
  const { task } = props;
  const taskStrings = props.translations.strings.workflow;
  let translation = merge({}, task);

  function explodeTranslationKey(translationKey, value) {
    const translationKeys = translationKey.split('.');
    const translationObject = {};
    let temp = translationObject;
    while (translationKeys.length) {
      temp[translationKeys[0]] = (translationKeys.length === 1) ? value : {};
      temp = temp[translationKeys[0]];
      translationKeys.shift();
    }
    return translationObject;
  }

  Object.keys(taskStrings).map((translationKey) => {
    const newTranslation = explodeTranslationKey(translationKey, taskStrings[translationKey]);
    if (newTranslation.tasks && newTranslation.tasks[props.taskKey]) {
      translation = merge(translation, newTranslation.tasks[props.taskKey]);
    }
  });

  return React.cloneElement(props.children, { translation });
}

TaskTranslations.propTypes = {
  children: React.PropTypes.node,
  task: React.PropTypes.shape({
    answers: React.PropTypes.array,
    question: React.PropTypes.string
  }),
  taskKey: React.PropTypes.string
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(TaskTranslations);
export { TaskTranslations };
