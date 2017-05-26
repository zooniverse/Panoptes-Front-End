import React from 'react';

/* eslint-disable multiline-ternary, react/forbid-prop-types */

const GSGoldStandardSummary = ({ classification, subject, workflow }) => {
  const choiceLabels = [];

  classification.annotations
    .filter((annotation) => { return workflow.tasks[annotation.task].type === 'survey'; })
    .forEach((annotation) => {
      annotation.value.forEach((value) => {
        choiceLabels.push(workflow.tasks[annotation.task].choices[value.choice].label);
      });
    });

  const isMatch = choiceLabels.every((label) => { return label === subject.metadata['#Label']; });

  if (isMatch) {
    return (<div>
      <p>Good work!</p>
      <p>When our experts classified this image,<br />they also thought it was a {subject.metadata['#Label']}!</p>
      {choiceLabels.length > 1 ?
        <p>You should only assign 1 label.</p> :
        null
      }
    </div>);
  }

  if (subject.metadata['#Label'] === 'special') {
    return (
      <div>
        <p>{subject.metadata['#feedback_1_message']}</p>
      </div>
    );
  }

  return (
    <div>
      <p>You responded {choiceLabels.join(', ')}.</p>
      {choiceLabels.length > 1 ?
        <p>You should only assign 1 label.</p> :
        null
      }
      <p>When our experts classified this image,<br />they labeled it as a {subject.metadata['#Label']}.</p>
      <p>Some of the glitch classes can look quite similar,<br />so please keep trying your best.</p>
      <p>Check out the tutorial and the field guide for more guidance.</p>
    </div>
  );
};

GSGoldStandardSummary.propTypes = {
  classification: React.PropTypes.object,
  subject: React.PropTypes.object,
  workflow: React.PropTypes.object
};

export default GSGoldStandardSummary;
