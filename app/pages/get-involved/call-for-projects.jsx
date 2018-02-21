import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class CallForProjects extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.header')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.intro')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.seekingProposals')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.projectSelection')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.requirements')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.audioCompatibility')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.selectionCriteriaTitle')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.selectionCriteriaOne')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.selectionCriteriaTwo')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.selectionCriteriaThree')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.selectionCriteriaFour')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.selectionCriteriaFive')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.selectionCriteriaSix')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.furtherNotes')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.imlsGrantInfo')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.deadline')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.contact')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.submissionLink')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.audio.break')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.header')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.wouldResearchBenefit')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.projectBuilder')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.projectSelection')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.expandFunctionality')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.examples')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.selectionCriteriaTitle')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.selectionCriteriaOne')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.selectionCriteriaTwo')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.selectionCriteriaThree')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.deadline')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.bio.submissionLink')}</Markdown>
      </div>
    );
  }
}

export default CallForProjects;
