import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class Education extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('getInvolved.education.title')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.becomeCitizenScientist')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.resources')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.zooTeach')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.educationPages')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.joinConversationTitle')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.joinConversationBody')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.howEducatorsUseZooniverse')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.inspiration')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.floatingForests')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.cosmicCurves')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.snapshotSerengeti')}</Markdown>
        <Markdown>{counterpart('getInvolved.education.contactUs')}</Markdown>
      </div>
    );
  }
}

export default Education;
