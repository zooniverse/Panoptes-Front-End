import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import { Link } from 'react-router';

counterpart.registerTranslations('en', {
  researchHomePage: {
    aboutIntro: `
      A vibrant community.
    `,
    about: `
      Zooniverse gives people of all ages and backgrounds the chance to participate
      in real research with over 50 active online citizen science projects. Work with
      1.6 million registered users around the world to contribute to research
      projects led by hundreds of researchers.
    `,
    classifications: 'Classifications so far by',
    labs: 'Zooniverse Labs',
    meetResearchers: 'Meet the researchers who\'ve created projects for free on the Zooniverse',
    options: 'Sign in or register to get started',
    real: 'Real researchers, real results',
    registeredUsers: 'registered volunteers',
    researcherIntro: 'Meet the researchers who’ve created projects for free on the Zooniverse ',
    researcher: `
      From classifying animals in the Serengeti to discovering new exoplanets using
      the Kepler space telescope, researchers of all backgrounds have used the free
      project builder to create engaging, accessible citizen science projects.
      Our researchers have used the data from their projects to publish over 100
      peer-reviewed publications that encourage many fascinating discoveries. Researchers
      take part in project creation, data analysis, and even communicate directly
      with volunteers through Zooniverse Talk.
    `,
    signIn: 'Sign in',
    register: 'Register',
    works: 'The Zooniverse Works'
  }
});

const HomePageResearch = (({ count, screenWidth, showDialog, volunteerCount }) =>
  <section className="home-research">
    <Translate className="tertiary-kicker" component="h2" content="researchHomePage.works" />
    <span className="class-counter">{count.toString().replace(/.(?=(?:.{3})+$)/g, '$&,')}</span>
    <Translate className="main-kicker" component="h3" content="researchHomePage.classifications" />
    <div>
      <h3 className="main-kicker">{volunteerCount.toLocaleString()}</h3>{' '}
      <Translate className="main-kicker" component="h3" content="researchHomePage.registeredUsers" />
    </div>

    <div className="home-research__columns">
      <Translate className="display-body" component="h2" content="researchHomePage.aboutIntro" />
      <Translate className="regular-body" component="p" content="researchHomePage.about" />
    </div>

    <div className="home-research__buttons">
      <Translate className="tertiary-kicker" component="h2" content="researchHomePage.options" />
      <button type="button" value="sign-in" className="primary-button" onClick={showDialog}>
        <Translate content="researchHomePage.signIn" />
      </button>

      <button type="button" value="register" className="primary-button primary-button--light" onClick={showDialog}>
        <Translate content="researchHomePage.register" />
      </button>
    </div>

    <div className="home-research__researchers">
      <div><img role="presentation" src="/assets/home-researchers1.jpg" /></div>

      {screenWidth > 550 && (
        <div><img role="presentation" src="/assets/home-researchers2.jpg" /></div>
      )}

      {screenWidth > 900 && (
        <div><img role="presentation" src="/assets/home-researchers3.jpg" /></div>
      )}
    </div>

    <div className="home-research__content">
      <Translate className="tertiary-kicker" component="h2" content="researchHomePage.real" />
      <Translate className="tertiary-headline" component="h3" content="researchHomePage.meetResearchers" />
      <div>
        <Translate className="display-body" component="h3" content="researchHomePage.researcherIntro" />
        <Translate className="regular-body" component="p" content="researchHomePage.researcher" />
      </div>

      <div>
        <Link to="/lab" className="primary-button primary-button--light">
          <Translate content="researchHomePage.labs" />
        </Link>
      </div>
    </div>

  </section>
);

HomePageResearch.propTypes = {
  count: React.PropTypes.number,
  screenWidth: React.PropTypes.number,
  showDialog: React.PropTypes.func,
  volunteerCount: React.PropTypes.number
};

export default HomePageResearch;
