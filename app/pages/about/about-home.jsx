import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class AboutHome extends React.Component {
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
        <Markdown>{counterpart('about.home.title')}</Markdown>
        <Markdown>{counterpart('about.home.whatIsZooniverse')}</Markdown>
        <Markdown>{counterpart('about.home.anyoneCanResearch')}</Markdown>
        <Markdown>{counterpart('about.home.accelerateResearch')}</Markdown>
        <Markdown>{counterpart('about.home.discoveries')}</Markdown>
      </div>
    );
  }
}

export default AboutHome;
