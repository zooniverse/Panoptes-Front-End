import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import NextButton from './components/NextButton';
import DoneButton from './components/DoneButton';
import BackButton from './components/BackButton';
import TalkLink from './components/TalkLink';

export const ButtonsWrapper = styled.span`
  display: flex;
  width: 100%;
  
  > a:first-of-type, > div:first-of-type, > span:first-of-type {
    margin-right: 1ch;
  }
`;

export default function TaskNavButtons(props) {
  if (props.showNextButton) {
    return (
      <ButtonsWrapper>
        {props.showBackButton &&
          <BackButton
            areAnnotationsNotPersisted={props.areAnnotationsNotPersisted}
            onClick={props.destroyCurrentAnnotation}
          />}
        <NextButton
          autoFocus={false}
          onClick={props.addAnnotationForTask}
          disabled={props.waitingForAnswer}
        />
      </ButtonsWrapper>
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
          translateContent="classifier.talk"
        />
        <NextButton
          autoFocus={props.autoFocus}
          disabled={false}
          onClick={props.nextSubject}
        />
      </ButtonsWrapper>
    );
  }

  return (
    <ButtonsWrapper>
      {props.showBackButton &&
        <BackButton
          areAnnotationsNotPersisted={props.areAnnotationsNotPersisted}
          onClick={props.destroyCurrentAnnotation}
        />}
      {props.showDoneAndTalkLink &&
        <TalkLink
          disabled={props.waitingForAnswer}
          onClick={props.completeClassification}
          projectSlug={props.project.slug}
          subjectId={props.subject.id}
          translateContent="classifier.doneAndTalk"
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
  areAnnotationsNotPersisted: false,
  autoFocus: false,
  completeClassification: () => {},
  completed: false,
  demoMode: false,
  destroyCurrentAnnotation: () => {},
  nextSubject: () => {},
  showBackButton: false,
  showNextButton: false,
  showDoneAndTalkLink: false,
  waitingForAnswer: false
};

TaskNavButtons.propTypes = {
  addAnnotationForTask: PropTypes.func,
  areAnnotationsNotPersisted: PropTypes.bool,
  autoFocus: PropTypes.bool,
  classification: PropTypes.shape({
    gold_standard: PropTypes.bool
  }).isRequired,
  completeClassification: PropTypes.func,
  completed: PropTypes.bool,
  demoMode: PropTypes.bool,
  destroyCurrentAnnotation: PropTypes.func,
  nextSubject: PropTypes.func,
  showBackButton: PropTypes.bool,
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
