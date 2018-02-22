import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class Contact extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('about.contact.title')}</Markdown>
        <Markdown>{counterpart('about.contact.discussionBoards')}</Markdown>
        <Markdown>{counterpart('about.contact.email')}</Markdown>
        <Markdown>{counterpart('about.contact.collaborating')}</Markdown>
        <Markdown>{counterpart('about.contact.pressInquiries')}</Markdown>
        <Markdown>{counterpart('about.contact.dailyZoo')}</Markdown>
      </div>
    );
  }
}

export default Contact;
