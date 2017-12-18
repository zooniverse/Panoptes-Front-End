import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class CallForProjects extends React.Component {
  componentDidMount() {
    if (document) {
      document.documentElement.classList.add('on-secondary-page');
    }
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('on-secondary-page');
  }

  render() {
    return (
      <div>
        <Markdown>{counterpart('getInvolved.callForProjects.header')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.wouldResearchBenefit')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.projectBuilder')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.projectSelection')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.expandFunctionality')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.examples')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.selectionCriteriaTitle')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.selectionCriteriaOne')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.selectionCriteriaTwo')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.selectionCriteriaThree')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.deadline')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.submissionLink')}</Markdown>
      </div>
    );
  }
}

export default CallForProjects;
