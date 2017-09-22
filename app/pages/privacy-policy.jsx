import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Markdown } from 'markdownz';

const PrivacyPolicy = () =>
  (<div className="content-container">
    <Translate component="h1" content="privacy.title" />
    <div className="columns-container">
      <div className="column">
        <Markdown>{counterpart('privacy.userAgreementSummary')}</Markdown>
        <Markdown>{counterpart('privacy.userAgreementContribution')}</Markdown>
        <Markdown>{counterpart('privacy.userAgreementData')}</Markdown>
        <Markdown>{counterpart('privacy.userAgreementLegal')}</Markdown>
      </div>
      <div className="column">
        <Markdown>{counterpart('privacy.privacyPolicyIntro')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicyData')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicyInfo')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicyThirdParties')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicyCookies')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicyDataStorage')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicySecurity')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicyDataRemoval')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicyContactUser')}</Markdown>
        <Markdown>{counterpart('privacy.privacyPolicyFurtherInfo')}</Markdown>
      </div>
    </div>
  </div>);

export default PrivacyPolicy;
