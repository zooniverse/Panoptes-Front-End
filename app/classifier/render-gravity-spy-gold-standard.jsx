import React from 'react';
import { Link } from 'react-router';

const RenderGravitySpyGoldStandard = (props) => {
  const choiceLabels = [];
  for (const annotation of props.currentClassification.annotations) {
    if (props.workflow.tasks[annotation.task].type === 'survey') {
      for (const value of annotation.value) {
        choiceLabels.push(props.workflow.tasks[annotation.task].choices[value.choice].lavel);
      }
    }
  }
  const match = choiceLabels.every((label) => { return label === props.subject.metadata['#Label']; });

  let tooMany;
  if (choiceLabels.length > 1) {
    tooMany = (<p>You should only assign 1 label.</p>);
  }

  let message;
  if (match) {
    message = (
      <div>
        <p>Good work!</p>
        <p>When our experts classified this image,<br />they also thought it was a {props.subject.metadata['#Label']}!</p>
        {tooMany}
      </div>
    );
  } else {
    message = (
      <div>
        <p>You responded {choiceLabels.join(', ')}.</p>
        {tooMany}
        <p>When our experts classified this image,<br />they labeled it as a {props.subject.metadata['#Label']}.</p>
        <p>Some of the glitch classes can look quite similar,<br />so please keep trying your best.</p>
        <p>Check out the tutorial and the field guide for more guidance.</p>
      </div>
    );
  }

  let talkLink;
  if (props.owner && props.project) {
    const [ownerName, name] = props.project.slug.split('/');
    talkLink = (
      <Link
        onClick={props.onClickNext}
        to={`/projects/${ownerName}/${name}/talk/subjects/${props.subject.id}`}
        className="talk standard-button"
      >
        Talk
      </Link>
    );
  }
  return (
    <div>
      {message}
      <hr />
      <nav className="task-nav">
        {talkLink}
        <button type="button" autoFocus className="continue major-button" onClick={props.onClickNext}>Next</button>
      </nav>
    </div>
  );
};

RenderGravitySpyGoldStandard.propTypes = {
  workflow: React.PropTypes.object,
  currentClassification: React.PropTypes.object,
  subject: React.PropTypes.object,
  owner: React.PropTypes.object,
  project: React.PropTypes.object,
  onClickNext: React.PropTypes.func,
};

export default RenderGravitySpyGoldStandard;
