import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

const Contact = () =>
  (<div className="on-secondary-page">
    <Markdown>{counterpart('about.contact.title')}</Markdown>
    <Markdown>{counterpart('about.contact.discussionBoards')}</Markdown>
    <Markdown>{counterpart('about.contact.email')}</Markdown>
    <Markdown>{counterpart('about.contact.collaborating')}</Markdown>
    <Markdown>{counterpart('about.contact.pressInquiries')}</Markdown>
    <Markdown>{counterpart('about.contact.dailyZoo')}</Markdown>
  </div>);

export default Contact;
