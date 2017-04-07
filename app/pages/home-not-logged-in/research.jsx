import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import statsClient from 'panoptes-client/lib/stats-client';
import { Link } from 'react-router';
import LoginDialog from '../../partials/login-dialog';

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
    labs: 'Zooniverse Labs',
    meetResearchers: 'Meet the researchers who\'ve created projects for free on the Zooniverse.',
    real: 'Real researchers, real results',
    researcherIntro: 'Some information about researchers. ',
    researcher: 'here is some other text about researchers that we are very proud about and we couldn\'t do it without them',
    signIn: 'Sign in',
    register: 'Register',
    works: 'The Zooniverse Works'
  }
});

export default class HomePageResearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 42000000
    };
    this.showDialog = this.showDialog.bind(this);
  }

  componentDidMount() {
    this.getClassificationCounts();
  }

  getClassificationCounts() {
    let count = 0;
    statsClient.query({
      period: 'year',
      type: 'classification'
    })
    .then((data) => {
      data.map((statObject) => {
        count += statObject.doc_count;
      });
      this.setState({ count });
    });
  }

  showDialog(event) {
    const which = event.currentTarget.value;
    this.context.geordi.logEvent({
      type: which === 'sign-in' ? 'login' : 'register-link'
    });
    alert((resolve) => {
      return <LoginDialog which={which} onSuccess={resolve} contextRef={this.context} />;
    });
  }

  render() {
    return (
      <section className="home-research">
        <Translate className="tertiary-kicker" content="researchHomePage.works" />
        <h1 className="class-counter">{this.state.count.toLocaleString()}</h1>
        <Translate className="main-kicker" content="researchHomePage.classifications" />

        <div className="home-research__content">
          <Translate className="display-body" content="researchHomePage.aboutIntro" />
          <Translate className="regular-body" content="researchHomePage.about" />
        </div>


        <div className="home-research__buttons">
          <h3 className="tertiary-kicker">Sign in or register to get started</h3>
          <button type="button" value="sign-in" className="primary-button" onClick={this.showDialog}>
            <Translate content="researchHomePage.signIn" />
          </button>

          <button type="button" value="register" className="primary-button primary-button--light" onClick={this.showDialog}>
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
  }

}
