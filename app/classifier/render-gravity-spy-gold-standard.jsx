import React from 'react';
import { Link } from 'react-router';
import { VisibilityWrapper } from './classifier-helpers';

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
  const tooMany = (
    <VisibilityWrapper visible={choiceLabels.length > 1}>
      <p>You should only assign 1 label.</p>
    </VisibilityWrapper>
  );

  return (
    <div>
      <VisibilityWrapper visible={match}>
        <div>
          <p>Good work!</p>
          <p>When our experts classified this image,<br />they also thought it was a {props.subject.metadata['#Label']}!</p>
          {tooMany}
        </div>
      </VisibilityWrapper>
      <VisibilityWrapper visible={!match}>
        <div>
          <p>You responded {choiceLabels.join(', ')}.</p>
          {tooMany}
          <p>When our experts classified this image,<br />they labeled it as a {props.subject.metadata['#Label']}.</p>
          <p>Some of the glitch classes can look quite similar,<br />so please keep trying your best.</p>
          <p>Check out the tutorial and the field guide for more guidance.</p>
        </div>
      </VisibilityWrapper>
      <hr />
      <nav className="task-nav">
        <VisibilityWrapper visible={props.owner && props.project}>
          <Link
            onClick={this.props.onClickNext}
            to={`/projects/${this.props.project.slug}/talk/subjects/${this.props.subject.id}`}
            className="talk standard-button"
          >
            Talk
          </Link>
        </VisibilityWrapper>
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
