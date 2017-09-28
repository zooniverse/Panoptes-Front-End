import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Markdown } from 'markdownz';

const SecurityPolicy = () =>
  (<div className="content-container">
    <Translate component="h1" content="security.title" />
    <div className="columns-container">
      <div className="column">
        <Markdown>{counterpart('security.intro')}</Markdown>
      </div>
      <div className="column">
        <Markdown>{counterpart('security.details')}</Markdown>
      </div>
    </div>
  </div>);

export default SecurityPolicy;
