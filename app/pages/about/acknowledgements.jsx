import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

class Acknowledgements extends React.Component {
  render() {
    return (
      <div>
        <Markdown>{counterpart('about.acknowledgements.title')}</Markdown>
        <Markdown>{counterpart('about.acknowledgements.instructions')}</Markdown>
        <Markdown>{counterpart('about.acknowledgements.supportText')}</Markdown>
        <Markdown>{counterpart('about.acknowledgements.publicationRequest')}</Markdown>
        <Markdown>{counterpart('about.acknowledgements.publicationShareForm')}</Markdown>
        <Markdown>{counterpart('about.acknowledgements.questions')}</Markdown>
      </div>
    );
  }
}

export default Acknowledgements;
