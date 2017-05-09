import React from 'react';
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
          <SummaryComponent task={task} annotation={annotation} onToggle={props.onToggle} />
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
  annotation: React.PropTypes.shape(
    { value: React.PropTypes.array }
  ).isRequired,
  onToggle: React.PropTypes.func
};

export default ComboTaskSummary;
