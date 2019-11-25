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
        <a href="https://give.adlerplanetarium.org/give/245802/#!/donation/checkout" target="_blank" rel="noopener noreferrer">
          <img className="donate-image" src="/assets/donate-button.png" alt="Donate Button Link" />
        </a>
        <Markdown>{counterpart('about.donate.paragraphThree')}</Markdown>
      </div>
    );
  }
}

export default Highlights;
