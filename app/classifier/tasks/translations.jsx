import PropTypes from 'prop-types';
import React from 'react';
import merge from 'lodash/merge';
import { connect } from 'react-redux';

function TaskTranslations(props) {
  const { task, taskKey, translations } = props;
  const taskStrings = translations.strings.workflow.tasks ? translations.strings.workflow.tasks[taskKey] : {};
  const translation = merge({}, task, taskStrings);

  return React.cloneElement(props.children, { translation });
}

TaskTranslations.propTypes = {
  children: PropTypes.node,
  task: PropTypes.shape({
    answers: PropTypes.array,
    question: PropTypes.string
  }),
  taskKey: PropTypes.string
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(TaskTranslations);
export { TaskTranslations };
