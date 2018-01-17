import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import Thumbnail from '../../components/thumbnail';

counterpart.registerTranslations('en', {
  discoverHomePage: {
    appAnnounce: 'Bring the Zooniverse with you. Download the app for iOS and Android devices.',
    discover: 'Discover, teach, and learn',
    doScience: 'Do science, anywhere',
    signIn: 'Sign in',
    register: 'Register',
    research: `
      The Zooniverse enables everyone to take part in real cutting edge
      research in many fields across the sciences, humanities, and more.
      The Zooniverse creates opportunities for you to unlock answers and
      contribute to real discoveries.
    `,
    what: 'What\'s this?'
  }
});

const HomePageDiscover = (({ showDialog }) =>
  <section className="home-discover">
    <div className="home-discover__content">
      <Translate className="secondary-kicker" component="h2" content="discoverHomePage.what" />

      <Translate className="tertiary-headline" component="h3" content="discoverHomePage.discover" />

      <Translate className="display-body" component="p" content="discoverHomePage.research" />

      <button type="button" value="sign-in" className="primary-button" onClick={showDialog}>
        <Translate content="discoverHomePage.signIn" />
      </button>

      <button type="button" value="register" className="primary-button primary-button--light" onClick={showDialog}>
        <Translate content="discoverHomePage.register" />
      </button>

      <hr />

      <Translate className="tertiary-kicker" component="h3" content="discoverHomePage.doScience" />

      <Translate className="regular-body" component="p" content="discoverHomePage.appAnnounce" />

      <a href="https://itunes.apple.com/us/app/zooniverse/id1194130243?mt=8">
        <img role="presentation" src="/assets/home-appStore.png" />
      </a>

      <a href="http://play.google.com/store/apps/details?id=com.zooniversemobile">
        <img role="presentation" src="/assets/home-googlePlay.png" />
      </a>

    </div>

    <div className="home-discover__image">
      <Thumbnail role="presentation" src="//www.zooniverse.org/assets/home-computer.png" width={450} />
    </div>

  </section>
);

HomePageDiscover.propTypes = {
  showDialog: PropTypes.func
};

export default HomePageDiscover;