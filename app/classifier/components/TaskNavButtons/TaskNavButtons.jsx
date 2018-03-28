import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import NextButton from './components/NextButton';
import DoneButton from './components/DoneButton';
import TalkLink from './components/TalkLink';

export const ButtonsWrapper = styled.span`
  display: flex;
  width: 100%;
  
  > a:first-of-type, button:first-of-type {
    margin-right: 1ch;
  }
`;

export default function TaskNavButtons(props) {
  if (props.showNextButton) {
    return (
      <NextButton
        autoFocus={false}
        onClick={props.addAnnotationForTask}
        waitingForAnswer={props.waitingForAnswer}
      />
    );
  }

  // Shown on summary enabled workflows.
  if (props.completed) {
    return (
      <ButtonsWrapper>
        <TalkLink
          disabled={false}
          onClick={props.nextSubject}
          projectSlug={props.project.slug}
          subjectId={props.subject.id}
        />
        <NextButton
          autoFocus={props.autoFocus}
          onClick={props.nextSubject}
          waitingForAnswer={false}
        />
      </ButtonsWrapper>

    );
  }

  return (
    <ButtonsWrapper>
      {props.showDoneAndTalkLink &&
        <TalkLink
          disabled={props.waitingForAnswer}
          onClick={props.completeClassification}
          projectSlug={props.project.slug}
          subjectId={props.subject.id}
        />}
      <DoneButton
        completed={props.completed}
        demoMode={props.demoMode}
        goldStandardMode={props.classification ? props.classification.gold_standard : false}
        onClick={props.completeClassification}
        disabled={props.waitingForAnswer}
      />
    </ButtonsWrapper>
  );
}

TaskNavButtons.defaultProps = {
  addAnnotationForTask: () => {},
  autoFocus: false,
  completeClassification: () => {},
  completed: false,
  demoMode: false,
  nextSubject: () => {},
  showNextButton: false,
  showDoneAndTalkLink: false,
  waitingForAnswer: false
};

TaskNavButtons.propTypes = {
  addAnnotationForTask: PropTypes.func,
  autoFocus: PropTypes.bool,
  classification: PropTypes.shape({
    gold_standard: PropTypes.bool
  }).isRequired,
  completeClassification: PropTypes.func,
  completed: PropTypes.bool,
  demoMode: PropTypes.bool,
  nextSubject: PropTypes.func,
  showNextButton: PropTypes.bool,
  showDoneAndTalkLink: PropTypes.bool,
  subject: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  project: PropTypes.shape({
    slug: PropTypes.string
  }).isRequired,
  waitingForAnswer: PropTypes.bool
};
