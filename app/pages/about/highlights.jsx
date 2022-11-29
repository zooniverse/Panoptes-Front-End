import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class Highlights extends React.Component {
  render() {
    return (
      <section>
        <Markdown>{counterpart('about.highlights.title')}</Markdown>
        <Markdown>{counterpart('about.highlights.paragraphOne')}</Markdown>
        <Markdown>{counterpart('about.highlights.paragraphTwo')}</Markdown>
        <Markdown>{counterpart('about.highlights.paragraphThree')}</Markdown>
        <Markdown>{counterpart('about.highlights.sectionHeader', { volumeNumber: '4', year: '2022' })}</Markdown>
        <div className="highlights__book-section">
          <img
            alt={counterpart('about.highlights.imageAlt', { year: '2022' })}
            className="highlights__book-image"
            src="/assets/highlights-book-2022.jpg"
          />
          <div className="highlights__book-description">
            <Markdown>{counterpart('about.highlights.toDownload', { url: 'https://bit.ly/zoonibook22-download-pdf' })}</Markdown>
            <Markdown>{counterpart('about.highlights.toPurchase', { purchaseSource: 'Blurb.com', url: 'https://bit.ly/zoonibook22-buy' })}</Markdown>
          </div>
        </div>
        <Markdown>{counterpart('about.highlights.sectionHeader', { volumeNumber: '3', year: '2021' })}</Markdown>
        <div className="highlights__book-section">
          <img
            alt={counterpart('about.highlights.imageAlt', { year: '2021' })}
            className="highlights__book-image"
            src="/assets/highlights-book-2021.png"
          />
          <div className="highlights__book-description">
            <Markdown>{counterpart('about.highlights.toDownload', { url: 'https://bit.ly/zoonibook21-download-pdf' })}</Markdown>
            <Markdown>{counterpart('about.highlights.toPurchase', { purchaseSource: 'Blurb.com', url: 'https://bit.ly/zoonibook21-buy' })}</Markdown>
          </div>
        </div>
        <Markdown>{counterpart('about.highlights.sectionHeader', { volumeNumber: '2', year: '2020' })}</Markdown>
        <div className="highlights__book-section">
          <img
            alt={counterpart('about.highlights.imageAlt', { year: '2020' })}
            className="highlights__book-image"
            src="/assets/highlights-book-2020.jpg"
          />
          <div className="highlights__book-description">
            <Markdown>{counterpart('about.highlights.toDownload', { url: 'https://bit.ly/zoonibook20-download' })}</Markdown>
            <Markdown>{counterpart('about.highlights.toPurchase', { purchaseSource: 'Blurb.com', url: 'https://bit.ly/zoonibook20-buy' })}</Markdown>
          </div>
        </div>
        <Markdown>{counterpart('about.highlights.sectionHeader', { volumeNumber: '1', year: '2019' })}</Markdown>
        <div className="highlights__book-section">
          <img
            alt={counterpart('about.highlights.imageAlt', { year: '2019' })}
            className="highlights__book-image"
            src="/assets/highlights-book-2019.png"
          />
          <div className="highlights__book-description">
            <Markdown>{counterpart('about.highlights.toDownload', { url: 'https://bit.ly/zoonibook19-download' })}</Markdown>
            <Markdown>{counterpart('about.highlights.toPurchase', { purchaseSource: 'Lulu.com', url: 'https://bit.ly/zoonibook19-buy-new' })}</Markdown>
          </div>
        </div>
      </section>
    );
  }
}

export default Highlights;
