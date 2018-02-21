import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class Volunteering extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('getInvolved.volunteering.title')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.introduction')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.projectVolunteeringTitle')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.projectVolunteeringDescription')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.projectLink')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.betaTesterTitle')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.betaTesterDescription')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.betaTesterSignUp')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.projectModeratorTitle')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.projectModeratorBody')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.furtherInformationTitle')}</Markdown>
        <Markdown>{counterpart('getInvolved.volunteering.contactUs')}</Markdown>
      </div>
    );
  }
}

export default Volunteering;
