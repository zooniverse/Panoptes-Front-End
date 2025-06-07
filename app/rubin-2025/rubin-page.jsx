import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Translate from 'react-translate-component';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { SignInForm } from './sign-in-form.jsx';
import { RegisterForm } from './register-form.jsx';

function RubinPage ({
  user
}) {
  const [tab, setTab] = useState('register')
  const [successMessage, setSuccessMessage] = useState('')

  function onTabClick (e) {
    setTab(e?.currentTarget?.dataset?.tab)
  }

  function onSignInSuccess () {
    setSuccessMessage('successfullySignedIn')
  }

  function onRegisterSuccess () {
    setSuccessMessage('successfullyRegistered')
  }

  return (
    <div className="new-accounts-page content-container">
      <Helmet title={'Zooniverse & Rubin 2025'} />
      <h1>Zooniverse &amp; Rubin 2025</h1>
      <p>Welcome to the Zooniverse, the home of Vera C. Rubin Observatory citizen science. We'll be launching the first projects with Rubin data in the next few weeks, so to be among the first to see data and help our scientists then sign up below, and we'll be in touch. In the meantime, to learn more and to enjoy the first images released by the Observatory go to <a href="https://rubinobservatory.org/" rel="noopener nofollow noreferrer" target="_blank">Rubinobservatory.org.</a></p>

      {user && successMessage && (
        <div className="successMessage">
          <Translate content={`newAccountsPage.${successMessage}`} />
        </div>
      )}

      {user ? (
        <div className="already-signed-in">
          <Translate content="newAccountsPage.alreadySignedIn" name={user?.login} />
          <ul>
            <li><Link to="/"><Translate content='newAccountsPage.alreadySignedInLinks.gotoHomepage' /></Link></li>
            <li><Link to="/projects"><Translate content='newAccountsPage.alreadySignedInLinks.gotoProjects' /></Link></li>
          </ul>
        </div>
      ) : (
        <div className="columns-container">
          <div className="tabbed-content column" data-side="top">
            <nav
              className="tabbed-content-tabs"
              role="tablist"
            >
              <button
                role="tab"
                type="button"
                onClick={onTabClick}
                data-tab="sign-in"
                className={`tabbed-content-tab ${tab !== 'register' ? 'active' : ''}`}
              >
                <Translate content="newAccountsPage.signIn" />
              </button>
              <button
                role="tab"
                type="button" onClick={onTabClick}
                data-tab="register"
                className={`tabbed-content-tab ${tab === 'register' ? 'active' : ''}`}
              >
                <Translate content="newAccountsPage.register" />
              </button>
            </nav>
            {(tab !== 'register')
              ? <SignInForm user={user} onSuccess={onSignInSuccess} />
              : <RegisterForm user={user} onSuccess={onRegisterSuccess} />
            }
          </div>
        </div>
      )}
    </div>
  )
};

RubinPage.propTypes = {
  user: PropTypes.shape({  // .user is provided by app.cjsx via React.cloneElement
    id: PropTypes.string
  })
};

export default RubinPage;
