import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class CallForProjects extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('getInvolved.callForProjects.general.header')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.general.wouldResearchBenefit')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.general.projectBuilder')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.nasa.header')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.nasa.wouldResearchBenefit')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.nasa.support')}</Markdown>
        <Markdown>{counterpart('getInvolved.callForProjects.nasa.contact')}</Markdown>
      </div>
    );
  }
}

export default CallForProjects;
