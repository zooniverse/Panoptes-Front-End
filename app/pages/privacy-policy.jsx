import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Markdown } from 'markdownz';
import { Link } from 'react-router';

const PrivacyPolicy = () =>
  (<div className="content-container">
    <Translate component="h1" content="privacy.title" />
    <Link to="/youth_privacy">
      <Translate content="privacy.youthPolicy.title" />
    </Link>
    <div className="columns-container">
      <div className="column">
        <Markdown>{counterpart('privacy.userAgreement.summary')}</Markdown>
        <Markdown>{counterpart('privacy.userAgreement.contribution')}</Markdown>
        <Markdown>{counterpart('privacy.userAgreement.data')}</Markdown>
        <Markdown>{counterpart('privacy.userAgreement.legal')}</Markdown>
      </div>
      <div className="column">
        <Markdown>{counterpart('privacy.privacyPolicy.intro')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicy.data')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicy.info')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicy.thirdParties')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicy.cookies')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicy.dataStorage')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicy.security')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicy.dataRemoval')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicy.contactUser')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicy.furtherInfo')}</Markdown>
      </div>
    </div>
  </div>);

export default PrivacyPolicy;
