import React from 'react';
import tasks from './tasks/index.coffee';

const ClassificationSummary = (props) => {
  let body = 'No annotations';
  if ((props.classification) && (props.classification.annotations.length > 0)) {
    body = [];
    for (const annotation of props.classification.annotations) {
      annotation._key = Math.random();
      const task = props.workflow.tasks[annotation.task];
      const SummaryComponent = tasks[task.type].Summary; // TODO: There's a lot of duplicated code in these modules.
      body.push(
        <div key={annotation._key} className="classification-task-summary">
          <SummaryComponent task={task} annotation={annotation} onToggle={props.onToggle} />
        </div>
      );
    }
  }
  return (
    <div className="classification-summary">
      {body}
    </div>
  );
};

ClassificationSummary.defaultProps = {
  workflow: null,
  classification: null,
};

ClassificationSummary.propTypes = {
  workflow: React.PropTypes.object,
  classification: React.PropTypes.object,
  onToggle: React.PropTypes.func,
};

export default ClassificationSummary;
