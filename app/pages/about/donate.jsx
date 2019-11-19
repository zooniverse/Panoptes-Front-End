import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class Highlights extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('about.donate.title')}</Markdown>
        <Markdown>{counterpart('about.donate.paragraphOne')}</Markdown>
        <Markdown>{counterpart('about.donate.paragraphTwo')}</Markdown>
        <img className="donate-image" src="/assets/donate-button.png" alt="Donate Button Link" />
        <Markdown>{counterpart('about.donate.paragraphThree')}</Markdown>
      </div>
    );
  }
}

export default Highlights;
