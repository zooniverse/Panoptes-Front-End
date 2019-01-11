import PropTypes from 'prop-types';
import React from 'react';
import merge from 'lodash/merge';
import { connect } from 'react-redux';

function TaskTranslations(props) {
  const { task, taskKey, translations, workflowID } = props;
  const workflowTranslation = translations.strings.workflow[workflowID] || {};
  const taskStrings = workflowTranslation.strings ? workflowTranslation.strings.tasks[taskKey] : {};
  const translation = merge({}, task, taskStrings);

  return React.cloneElement(props.children, { translation });
}

TaskTranslations.propTypes = {
  children: PropTypes.node,
  task: PropTypes.shape({
    answers: PropTypes.array,
    question: PropTypes.string
  }),
  taskKey: PropTypes.string,
  workflowID: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(TaskTranslations);
export { TaskTranslations };
