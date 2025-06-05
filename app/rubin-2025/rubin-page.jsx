import PropTypes from 'prop-types';
import React, { useState } from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { SignInForm } from './sign-in-form.jsx';
import { RegisterForm } from './register-form.jsx';

counterpart.registerTranslations('en', {
  newAccountsPage: {
    successfullySignedIn: `You've successfully signed in!`,
    successfullyRegistered: `You've successfully registered!`,
    alreadySignedInLinks: {
      gotoHomepage: 'Go to the homepage',
      gotoProjects: 'Find a new project to explore'
    }
  }
});

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
      <Helmet title={'RUBIN 2025'} />
      <h1>RUBIN 2025</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut dapibus augue. Aliquam varius, lorem id tempor lacinia, nibh mauris ultrices odio, id aliquam purus metus et eros. Maecenas in felis nulla. Quisque nec urna orci. Integer odio lectus, vehicula ac faucibus eget, blandit eget libero. Morbi sed nunc interdum, aliquam orci sed, euismod orci. Vivamus in porttitor nunc. Proin vestibulum tempor aliquam. Nullam leo risus, posuere et venenatis sit amet, tincidunt pharetra neque. Duis aliquam mauris vel posuere fermentum. In nec euismod velit. Phasellus rutrum nulla at lorem facilisis blandit. Vestibulum eget massa leo. Fusce lobortis tortor id consequat aliquam. In eget turpis dignissim, fringilla ligula sed, porta magna.</p>
      <p>Quisque tempus, ante condimentum tempus auctor, massa erat convallis quam, sit amet bibendum dui quam id leo. Vivamus hendrerit nibh ipsum, ut dapibus ante dapibus ut. Sed non sapien sit amet sapien cursus varius. Vestibulum faucibus sed enim ac placerat. Ut nec ex ac tortor auctor lobortis. Etiam a pulvinar nisl, vel pharetra enim. Donec vitae neque in sapien faucibus porttitor. Aenean tincidunt tellus ut nisl tristique pulvinar. Suspendisse ultricies nisl a diam imperdiet, sit amet pellentesque purus imperdiet.</p>

      {user && successMessage && (
        <div className="successMessage">
          <Translate content={`newAccountsPage.${successMessage}`} />
        </div>
      )}

      {user ? (
        <div className="already-signed-in">
          <Translate content="signIn.alreadySignedIn" name={user?.login} />
          <ul>
            <li><Link to="/"><Translate content='newAccountsPage.alreadySignedInLinks.gotoHomepage' /></Link></li>
            <li><Link to="/projects"><Translate content='newAccountsPage.alreadySignedInLinks.gotoProjects' /></Link></li>
          </ul>
        </div>
      ) : (
        <div className="columns-container">
          <div className="tabbed-content column" data-side="top">
            <nav className="tabbed-content-tabs">
              <button type="button" onClick={onTabClick} data-tab="sign-in" className="tabbed-content-tab"><Translate content="signIn.signIn" /></button>
              <button type="button" onClick={onTabClick} data-tab="register" className="tabbed-content-tab"><Translate content="signIn.register" /></button>
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
