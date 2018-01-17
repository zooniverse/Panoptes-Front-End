import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

const SignInPage = ({ children }) =>
  (<div className="sign-in-page content-container">
    <Helmet title={counterpart('signIn.register')} />
    <Translate component="h1" content="signIn.withZooniverse" />
    <Translate component="p" content="signIn.whyHaveAccount" />

    <div className="columns-container">
      <div className="tabbed-content column" data-side="top">
        <nav className="tabbed-content-tabs">
          <Link to="/accounts/sign-in" className="tabbed-content-tab"><Translate content="signIn.signIn" /></Link>
          <Link to="/accounts/register" className="tabbed-content-tab"><Translate content="signIn.register" /></Link>
        </nav>
        {children}
      </div>
    </div>
    <div className="oauth-providers">
      <Translate content="signIn.orThirdParty" />
      <br />
      <div>
        <button type="button"><Translate content="signIn.withFacebook" /></button>
      </div>
      <div>
        <button type="button"><Translate content="signIn.withGoogle" /></button>
      </div>
    </div>
  </div>);

SignInPage.defaultProps = {
  children: null
};

SignInPage.propTypes = {
  children: PropTypes.node
};

export default SignInPage;