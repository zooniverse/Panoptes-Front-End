import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class Faq extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('about.faq.title')}</Markdown>
        <Markdown>{counterpart('about.faq.whyNeedHelp')}</Markdown>
        <Markdown>{counterpart('about.faq.amIDoingThisRight')}</Markdown>
        <Markdown>{counterpart('about.faq.whatHappensToClassifications')}</Markdown>
        <Markdown>{counterpart('about.faq.accountInformation')}</Markdown>
        <Markdown>{counterpart('about.faq.featureRequest')}</Markdown>
        <Markdown>{counterpart('about.faq.hiring')}</Markdown>
        <Markdown>{counterpart('about.faq.howToAcknowledge')}</Markdown>
        <Markdown>{counterpart('about.faq.browserSupport')}</Markdown>
        <Markdown>{counterpart('about.faq.furtherHelp')}</Markdown>
      </div>
    );
  }
}

export default Faq;
