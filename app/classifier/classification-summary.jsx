import React from 'react';
import tasks from './tasks/index.coffee';
import { TextSplit } from 'seven-ten';
import tasks from './tasks';

const ClassificationSummary = (props) => {
  let firstTimeClassified;
  if (props.classificationCount === 0) {
    firstTimeClassified = (
      <TextSplit
        splitKey="subject.first-to-classify"
        textKey="message"
        splits={props.splits}
        default={''}
        elementType={"p"}
      />
    );
  }
  let body = 'No annotations';
  if ((props.classification) && (props.classification.annotations.length > 0)) {
    body = [];
    props.classification.annotations.map((annotation) => {
      annotation._key = Math.random();
      const task = props.workflow.tasks[annotation.task];
      const SummaryComponent = tasks[task.type].Summary; // TODO: There's a lot of duplicated code in these modules.
      body.push(
        <div key={annotation._key} className="classification-task-summary">
          <SummaryComponent task={task} annotation={annotation} onToggle={props.onToggle} />
        </div>
      );
    });
  }
  return (
    <div className="classification-summary">
      {firstTimeClassified}
      {body}
    </div>
  );
};

ClassificationSummary.defaultProps = {
  workflow: null,
  classification: null,
  classificationCount: null
};

ClassificationSummary.propTypes = {
  workflow: React.PropTypes.object,
  classification: React.PropTypes.object,
  classificationCount: React.PropTypes.number,
  onToggle: React.PropTypes.func,
  splits: React.PropTypes.object
};

export default ClassificationSummary;
