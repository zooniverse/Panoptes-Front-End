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
  const [successMessage, setSuccessMessage] = useState('successfullyRegistered')

  function onTabClick (e) {
    setTab(e?.currentTarget?.dataset?.tab)
  }

  function onSignInSuccess () {
    setSuccessMessage('successfullySignedIn')
  }

  function onRegisterSuccess () {
    setSuccessMessage('successfullyRegistered')
  }

  /*
  When a Tab has focus, and user presses left/right keys, switch which tab has focus.
  This code is probably a bit more complicated than it needs to be.
   */
  function onTabKeyPress (keyboardEvent) {
    const currentNode = keyboardEvent?.currentTarget;
    const siblings = currentNode?.parentNode?.childNodes;

    // Find what/where's the current tab, in relation to its siblings.
    let currentIndex = -1;
    siblings.forEach((node, index) => { if (node === currentNode) { currentIndex = index } });
    if (currentIndex < 0) return;  // Error!

    // Choose the next tab we're going to focus on.
    let nextIndex = currentIndex;
    if (keyboardEvent.key === 'ArrowLeft') { nextIndex -= 1 }
    if (keyboardEvent.key === 'ArrowRight') { nextIndex += 1 }
    nextIndex = Math.min(Math.max(0, nextIndex), siblings?.length - 1);

    // Focus on the next tab.
    siblings?.[nextIndex].focus();
  }

  return (
    <div className="new-accounts-page content-container">
      <section>
        <div className="inner">
          <div className="info">
            <Helmet title={'Zooniverse & Rubin 2025'} />
            <h1>Zooniverse &amp; Rubin 2025</h1>
            <p>Welcome to the Zooniverse, the home of Vera C. Rubin Observatory citizen science. We'll be launching the first projects with Rubin data in the next few weeks, so to be among the first to see data and help our scientists then sign up below, and we'll be in touch. In the meantime, to learn more and to enjoy the first images released by the Observatory go to <a href="https://rubinobservatory.org/" rel="noopener nofollow noreferrer" target="_blank">Rubinobservatory.org.</a></p>
          </div>

          {user && successMessage && (
            <div className="success-message">
              <span className="fa fa-check-circle-o" />
              <Translate content={`newAccountsPage.${successMessage}`} />
            </div>
          )}

          {user ? (
            <div className="already-signed-in">
              <p>
                <span className="fa fa-check-circle-o" />
                <Translate content="newAccountsPage.alreadySignedIn" name={user?.login} />
              </p>
              <ul>
                <li><Link to="/"><Translate content='newAccountsPage.alreadySignedInLinks.gotoHomepage' /></Link></li>
                <li><Link to="/projects"><Translate content='newAccountsPage.alreadySignedInLinks.gotoProjects' /></Link></li>
              </ul>
            </div>
          ) : (
            <div className="tabs">
              <nav role="tablist">
                <button
                  role="tab"
                  id="new-accounts-page-tab-sign-in"
                  type="button"
                  onClick={onTabClick}
                  onKeyDown={onTabKeyPress}
                  data-tab="sign-in"
                  className={`tab ${tab !== 'register' ? 'active' : ''}`}
                >
                  <Translate content="newAccountsPage.signIn" />
                </button>
                <button
                  role="tab"
                  id="new-accounts-page-tab-register"
                  type="button"
                  onClick={onTabClick}
                  onKeyDown={onTabKeyPress}
                  data-tab="register"
                  className={`tab ${tab === 'register' ? 'active' : ''}`}
                >
                  <Translate content="newAccountsPage.register" />
                </button>
              </nav>
              {(tab !== 'register')
                ? (
                  <div
                    role="tabpanel"
                    aria-labelledby="new-accounts-page-tab-sign-in"
                  >
                    <SignInForm user={user} onSuccess={onSignInSuccess} />
                  </div>
                ) : (
                  <div
                    role="tabpanel"
                    aria-labelledby="new-accounts-page-tab-register"
                  >
                    <RegisterForm user={user} onSuccess={onRegisterSuccess} />
                  </div>
                )
              }
            </div>
          )}
        </div>
      </section>
    </div>
  )
};

RubinPage.propTypes = {
  user: PropTypes.shape({  // .user is provided by app.cjsx via React.cloneElement
    id: PropTypes.string
  })
};

export default RubinPage;
