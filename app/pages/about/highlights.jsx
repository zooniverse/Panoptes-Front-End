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
        <Markdown>{counterpart('about.highlights.sectionHeader', { volumeNumber: '2', year: '2020' })}</Markdown>
        <div className='highlights__book-section'>
          <img
            alt={counterpart('about.highlights.imageAlt', { year: '2020' })}
            className='highlights__book-image'
            src="/assets/highlights-book-2020.png" 
          />
          <div className='highlights__book-description'>
            <Markdown>{counterpart('about.highlights.toDownload', { url: 'https://bit.ly/zoonibook20-pdf' })}</Markdown>
            <Markdown>{counterpart('about.highlights.paragraphThree', { purchaseSource: 'Blurb.com', url: 'https://bit.ly/zoonibook20-buy' })}</Markdown>
            <Markdown>{counterpart('about.highlights.bookTwoThanks')}</Markdown>
          </div>
        </div>
        <Markdown>{counterpart('about.highlights.sectionHeader', { volumeNumber: '1', year: '2019' })}</Markdown>
        <div className='highlights__book-section'>
          <img
            alt={counterpart('about.highlights.imageAlt', { year: '2019' })}
            className='highlights__book-image'
            src="/assets/highlights-book-2019.png"
          />
          <div className='highlights__book-description'>
            <Markdown>{counterpart('about.highlights.toDownload', { url: 'https://bit.ly/zoonibook19-pdf-new' })}</Markdown>
            <Markdown>{counterpart('about.highlights.paragraphThree', { purchaseSource: 'Lulu.com', url: 'https://bit.ly/zoonibook19-buy-new' })}</Markdown>
            <Markdown>{counterpart('about.highlights.bookTwoThanks')}</Markdown>
          </div>
        </div>
      </section>
    );
  }
}

export default Highlights;
