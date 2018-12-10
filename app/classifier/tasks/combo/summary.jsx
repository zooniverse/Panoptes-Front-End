import PropTypes from 'prop-types';
import React from 'react';
import TaskTranslations from '../translations';
import tasks from '..';

const ComboTaskSummary = (props) => {
  let body = 'No annotations';
  if (props.annotation.value.length > 0) {
    body = [];
    props.annotation.value.map((annotation) => {
      if (!annotation._key) {
        annotation._key = Math.random();
      }
      const task = props.workflow.tasks[annotation.task];
      const SummaryComponent = tasks[task.type].Summary;
      body.push(
        <div key={annotation._key} className="classification-task-summary">
          <TaskTranslations
            taskKey={annotation.task}
            task={task}
            workflowID={props.workflow.id}
          >
            <SummaryComponent task={task} annotation={annotation} onToggle={props.onToggle} />
          </TaskTranslations>
        </div>
      );
    });
  }
  return (
    <div>
      {body}
    </div>
  );
};

ComboTaskSummary.propTypes = {
  annotation: PropTypes.shape(
    { value: PropTypes.array }
  ).isRequired,
  onToggle: PropTypes.func
};

export default ComboTaskSummary;