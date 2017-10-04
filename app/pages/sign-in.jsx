// TODO: Am I being used anywhere? If not, ok to delete this file?
import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

const SignIn = ({ children }) =>
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
        <button><Translate content="signIn.withFacebook" /></button>
      </div>
      <div>
        <button><Translate content="signIn.withGoogle" /></button>
      </div>
    </div>
  </div>);

SignIn.defaultProps = {
  children: null
};

SignIn.propTypes = {
  children: React.PropTypes.node
};

export default SignIn;
