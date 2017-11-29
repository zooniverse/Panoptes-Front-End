import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

const AboutHome = () =>
  (<div className="on-secondary-page">
    <Markdown>{counterpart('about.home.title')}</Markdown>
    <Markdown>{counterpart('about.home.whatIsZooniverse')}</Markdown>
    <Markdown>{counterpart('about.home.anyoneCanResearch')}</Markdown>
    <Markdown>{counterpart('about.home.accelerateResearch')}</Markdown>
    <Markdown>{counterpart('about.home.discoveries')}</Markdown>
  </div>);

export default AboutHome;
