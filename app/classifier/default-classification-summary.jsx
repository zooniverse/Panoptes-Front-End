import PropTypes from 'prop-types';
import React from 'react';
import { TextSplit } from 'seven-ten';
import tasks from './tasks';
import TaskTranslations from './tasks/translations';

const DefaultClassificationSummary = (props) => {
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
          <TaskTranslations
            taskKey={annotation.task}
            task={task}
            workflowID={props.workflow.id}
          >
            <SummaryComponent
              task={task}
              annotation={annotation}
              onToggle={props.onToggle}
              workflow={props.workflow}
            />
          </TaskTranslations>
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

DefaultClassificationSummary.defaultProps = {
  workflow: null,
  classification: null,
  classificationCount: null
};

DefaultClassificationSummary.propTypes = {
  workflow: PropTypes.object,
  classification: PropTypes.object,
  classificationCount: PropTypes.number,
  onToggle: PropTypes.func,
  splits: PropTypes.object
};

export default DefaultClassificationSummary;