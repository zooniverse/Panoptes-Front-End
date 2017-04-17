import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import { Link } from 'react-router';

counterpart.registerTranslations('en', {
  researchHomePage: {
    aboutIntro: `
      The Zooniverse makes an impact.
    `,
    about: `
      Over the past decade, Zooniverse volunteers have helped scientists make pivotal
      discoveries by participating in over 90 projects from the humanities to science and medicine.
      Volunteers have discovered new planets, assisted in disaster-relief, and even documented
      wildlife populations from Chicago to Mozambique. The Zooniverse community grows daily
      with over 1.5 million registered users answering the call to become citizen-science volunteers.
    `,
    classifications: 'Classifications so far',
    labs: 'Zooniverse Labs',
    meetResearchers: 'Meet the researchers who\'ve created projects for free on the Zooniverse.',
    options: 'Sign in or register to get started',
    real: 'Real researchers, real results',
    researcherIntro: 'The Zooniverse is collaborative. ',
    researcher: `
      At the heart of each Zooniverse project is a team of researchers passionate about working with
      volunteers to better understand their data. Researchers take part in project creation, data analysis,
      and even communicate directly with volunteers through Zooniverse Talk.
      `,
    signIn: 'Sign in',
    register: 'Register',
    works: 'The Zooniverse Works'
  }
});

const HomePageResearch = ({ count, screenWidth, showDialog }) => {
  return (
    <section className="home-research">
      <Translate className="tertiary-kicker" content="researchHomePage.works" />
      <h1 className="class-counter">{count.toLocaleString()}</h1>
      <Translate className="main-kicker" content="researchHomePage.classifications" />

      <div className="home-research__columns">
        <Translate className="display-body" content="researchHomePage.aboutIntro" />
        <Translate className="regular-body" content="researchHomePage.about" />
      </div>

      <div className="home-research__buttons">
        <Translate className="tertiary-kicker" content="researchHomePage.options" />
        <br />
        <button type="button" value="sign-in" className="primary-button" onClick={showDialog}>
          <Translate content="researchHomePage.signIn" />
        </button>

        <button type="button" value="register" className="primary-button primary-button--light" onClick={showDialog}>
          <Translate content="researchHomePage.register" />
        </button>
      </div>

      <div className="home-research__researchers">
        <img role="presentation" src="/assets/home-researchers1.jpg" />

        {screenWidth > 550 && (
          <img role="presentation" src="/assets/home-researchers2.jpg" />
        )}

        {screenWidth > 900 && (
          <img role="presentation" src="/assets/home-researchers3.jpg" />
        )}
      </div>

      <div className="home-research__content">
        <Translate className="tertiary-kicker" content="researchHomePage.real" />
        <Translate className="tertiary-headline" content="researchHomePage.meetResearchers" />
        <div>
          <Translate className="display-body" content="researchHomePage.researcherIntro" />
          <Translate className="regular-body" content="researchHomePage.researcher" />
        </div>

        <div>
          <Link to="/lab" className="primary-button primary-button--light">
            <Translate content="researchHomePage.labs" />
          </Link>
        </div>
      </div>

    </section>
  );
};

HomePageResearch.propTypes = {
  count: React.PropTypes.number,
  screenWidth: React.PropTypes.number,
  showDialog: React.PropTypes.func
};

export default HomePageResearch;
