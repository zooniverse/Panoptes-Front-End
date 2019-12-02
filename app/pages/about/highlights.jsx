import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class Highlights extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('about.highlights.title')}</Markdown>
        <br />
        <Markdown>{counterpart('about.highlights.thanks')}</Markdown>
        <Markdown>{counterpart('about.highlights.paragraphOne')}</Markdown>
        <div className="highlights-separator">
          <img src="/assets/highlights.png" alt="Zooniverse Highlights Book Cover" />
          <div>
            <Markdown>{counterpart('about.highlights.paragraphTwo')}</Markdown>
            <Markdown>{counterpart('about.highlights.paragraphThree')}</Markdown>
          </div>
        </div>
        <Markdown>{counterpart('about.highlights.toDownload')}</Markdown>
        <Markdown>{counterpart('about.highlights.download')}</Markdown>
        <Markdown>{counterpart('about.highlights.toOrder')}</Markdown>
        <Markdown>{counterpart('about.highlights.order')}</Markdown>
        <Markdown>{counterpart('about.highlights.credits')}</Markdown>
      </div>
    );
  }
}

export default Highlights;
