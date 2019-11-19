import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class Highlights extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('about.highlights.title')}</Markdown>
        <br />
        <Markdown>{counterpart('about.highlights.header')}</Markdown>
        <Markdown>{counterpart('about.highlights.paragraphOne')}</Markdown>
        <Markdown>{counterpart('about.highlights.paragraphTwo')}</Markdown>
        <Markdown>{counterpart('about.highlights.paragraphThree')}</Markdown>
        <Markdown>{counterpart('about.highlights.toDownload')}</Markdown>
        <Markdown>{counterpart('about.highlights.download')}</Markdown>
        <Markdown>{counterpart('about.highlights.toOrder')}</Markdown>
        <Markdown>{counterpart('about.highlights.order')}</Markdown>
        <Markdown>{counterpart('about.highlights.thanks')}</Markdown>
      </div>
    );
  }
}

export default Highlights;
