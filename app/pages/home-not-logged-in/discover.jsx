import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

counterpart.registerTranslations('en', {
  discoverHomePage: {
    appAnnounce: 'Bring the Zooniverse with you. Download the app for iOS and Android devices.',
    signIn: 'Sign in',
    register: 'Register',
    research: `
      The Zooniverse enables everyone to take part in real cutting edge
      research in many fields across the sciences, humanities, and more.
      The Zooniverse creates opportunities for you to unlock answers and
      contribute to real discoveries.
    `
  }
});

const HomePageDiscover = ({ showDialog }) => {
  return (
    <section className="home-discover">
      <div className="home-discover__content">
        <h3 className="secondary-kicker">What&apos;s This?</h3>
        <h1 className="tertiary-headline">Discover, teach, and learn</h1>

        <Translate className="display-body" component="p" content="discoverHomePage.research" />

        <button type="button" value="sign-in" className="primary-button" onClick={showDialog}>
          <Translate content="discoverHomePage.signIn" />
        </button>

        <button type="button" value="register" className="primary-button primary-button--light" onClick={showDialog}>
          <Translate content="discoverHomePage.register" />
        </button>

        <hr />

        <h1 className="tertiary-kicker">Do science, anywhere</h1>

        <Translate className="display-body display-body--regular" component="p" content="discoverHomePage.appAnnounce" />

        <img role="presentation" src="/assets/home-appStore.png" />
        <img role="presentation" src="/assets/home-googlePlay.png" />

      </div>

      <div className="home-discover__image">
        <img role="presentation" src="/assets/home-computer.png" />
      </div>

    </section>
  );
};

HomePageDiscover.propTypes = {
  showDialog: React.PropTypes.func
};

export default HomePageDiscover;
