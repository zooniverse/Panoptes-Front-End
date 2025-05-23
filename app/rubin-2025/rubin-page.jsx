import PropTypes from 'prop-types';
import React, { useState } from 'react';
// import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import Helmet from 'react-helmet';
import { SignInForm } from './sign-in-form.jsx';
import { RegisterForm } from './register-form.jsx';

function RubinPage ({
  user
}) {
  const [tab, setTab] = useState('sign-in')

  function onTabClick (e) {
    setTab(e?.currentTarget?.dataset?.tab)
  }

  function onSignInSuccess () {
    alert('You have successfully signed in!')
  }

  function onRegisterSuccess () {
    alert('You have successfully registered. Welcome to the Zooniverse!')
  }

  return (
    <div className="sign-in-page content-container">
      <Helmet title={'RUBIN 2025'} />
      <h1>RUBIN 2025</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut dapibus augue. Aliquam varius, lorem id tempor lacinia, nibh mauris ultrices odio, id aliquam purus metus et eros. Maecenas in felis nulla. Quisque nec urna orci. Integer odio lectus, vehicula ac faucibus eget, blandit eget libero. Morbi sed nunc interdum, aliquam orci sed, euismod orci. Vivamus in porttitor nunc. Proin vestibulum tempor aliquam. Nullam leo risus, posuere et venenatis sit amet, tincidunt pharetra neque. Duis aliquam mauris vel posuere fermentum. In nec euismod velit. Phasellus rutrum nulla at lorem facilisis blandit. Vestibulum eget massa leo. Fusce lobortis tortor id consequat aliquam. In eget turpis dignissim, fringilla ligula sed, porta magna.</p>
      <p>Quisque tempus, ante condimentum tempus auctor, massa erat convallis quam, sit amet bibendum dui quam id leo. Vivamus hendrerit nibh ipsum, ut dapibus ante dapibus ut. Sed non sapien sit amet sapien cursus varius. Vestibulum faucibus sed enim ac placerat. Ut nec ex ac tortor auctor lobortis. Etiam a pulvinar nisl, vel pharetra enim. Donec vitae neque in sapien faucibus porttitor. Aenean tincidunt tellus ut nisl tristique pulvinar. Suspendisse ultricies nisl a diam imperdiet, sit amet pellentesque purus imperdiet.</p>

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
    </div>
  )
};

RubinPage.propTypes = {
  user: PropTypes.shape({  // .user is provided by app.cjsx via React.cloneElement
    id: PropTypes.string
  })
};

export default RubinPage;
