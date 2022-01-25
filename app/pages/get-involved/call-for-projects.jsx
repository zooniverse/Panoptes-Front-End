import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class CallForProjects extends React.Component {
  render() {
    return (
      <div>
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
