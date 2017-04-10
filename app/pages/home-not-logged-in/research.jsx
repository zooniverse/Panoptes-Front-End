import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import { Link } from 'react-router';

counterpart.registerTranslations('en', {
  researchHomePage: {
    aboutIntro: `
      Here is some text to talk about what the Zooniverse is all about.
    `,
    about: `
      We will provide some good stuff here and everyone will get excited
      and want to join the Zooniverse. We will have a ton of classifications every day and people will be quite excited. A bunch of universities
      will also decide to work with us and we will have some neat stories published and whatnot.
    `,
    classifications: 'Classifications so far',
    meetResearchers: 'Meet the researchers who\'ve created projects for free on the Zooniverse.',
    options: 'Sign in or register to get started',
    real: 'Real researchers, real results',
    researcherIntro: 'Some information about researchers. ',
    researcher: 'here is some other text about researchers that we are very proud about and we couldn\'t do it without them',
    signIn: 'Sign in',
    register: 'Register',
    works: 'The Zooniverse Works'
  }
});

const HomePageResearch = ({ count, showDialog }) => {
  return (
    <section className="home-research">
      <Translate className="tertiary-kicker" content="researchHomePage.works" />
      <h1 className="class-counter">{count.toLocaleString()}</h1>
      <Translate className="main-kicker" content="researchHomePage.classifications" />

      <div className="home-research__content">
        <Translate className="display-body" content="researchHomePage.aboutIntro" />
        <Translate className="regular-body" content="researchHomePage.about" />
      </div>

      <div className="home-research__buttons">
        <Translate className="tertiary-kicker" component="h3" content="researchHomePage.options" />
        <button type="button" value="sign-in" className="primary-button" onClick={showDialog}>
          <Translate content="researchHomePage.signIn" />
        </button>

        <button type="button" value="register" className="primary-button primary-button--light" onClick={showDialog}>
          <Translate content="researchHomePage.register" />
        </button>
      </div>

      <div className="home-research__researchers">
        <img role="presentation" src="/assets/home-researchers1.jpg" />
        <img role="presentation" src="/assets/home-researchers2.jpg" />
        <img role="presentation" src="/assets/home-researchers3.jpg" />
      </div>

      <div className="home-research__container">
        <Translate className="tertiary-kicker" content="researchHomePage.real" />
        <Translate className="tertiary-headline" content="researchHomePage.meetResearchers" />
        <div>
          <Translate className="display-body" content="researchHomePage.researcherIntro" />
          <Translate className="regular-body" content="researchHomePage.researcher" />
        </div>

        <div className="home-research__buttons">
          <Link to="/lab" className="primary-button primary-button--light">Zooniverse Labs</Link>
        </div>
      </div>

    </section>
  );
};

HomePageResearch.propTypes = {
  count: React.PropTypes.number,
  showDialog: React.PropTypes.func
};

export default HomePageResearch;
