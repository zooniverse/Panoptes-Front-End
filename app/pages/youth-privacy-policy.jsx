import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Markdown } from 'markdownz';
import { Link } from 'react-router';

const YouthPrivacyPolicy = () => (
  <div className="content-container">
    <Translate component="h1" content="privacy.youthPolicy.title" />
    <Link to="/privacy">
      <Translate content="privacy.title" />
    </Link>
    <div className="container">
      <Markdown>{counterpart('privacy.youthPolicy.content')}</Markdown>
    </div>
  </div>
);

export default YouthPrivacyPolicy;
