import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import LoginDialog from '../../partials/login-dialog';

counterpart.registerTranslations('en', {
  discoverPage: {
    signIn: 'Sign in',
    register: 'Register'
  }
});

export default class HomePageDiscover extends React.Component {
  constructor(props) {
    super(props);
    this.showDialog = this.showDialog.bind(this);
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
      <section className="home-discover" ref="discover">
        <div className="home-discover__content">
          <h3 className="secondary-kicker">What&apos;s This?</h3>
          <h1 className="tertiary-headline">Discover, teach, and learn</h1>

          <p className="display-body">
            The Zooniverse enables everyone to take part in real cutting edge
            research in many fields across the sciences, humanities, and more.
            The Zooniverse creates opportunities for you to unlock answers and
            contribute to real discoveries.
          </p>

          <button type="button" value="sign-in" className="primary-button" onClick={this.showDialog}>
            <Translate content="discoverPage.signIn" />
          </button>

          <button type="button" value="register" className="primary-button-light" onClick={this.showDialog}>
            <Translate content="discoverPage.register" />
          </button>

          <hr />

          <h1 className="tertiary-kicker">Zooniverse Newsletter</h1>

          <p className="display-body">Be the first to learn about new projects, new findings, and everything Zooniverse.</p>

          <input type="text" placeholder="your email" /><input type="submit" />

        </div>

        <div className="home-discover__image">
          <img role="presentation" src="/assets/home-computer.png" />
        </div>

      </section>
    );
  }
}
