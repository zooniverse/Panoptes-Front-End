import React, { Component } from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import map from 'lodash/map';

counterpart.registerTranslations('en', {
  mobileSection: {
    title: 'Mobile App',
    download: {
      disclaimer: 'Please note that projects that are not launch approved will only show in the preview section of the app.',
      help: 'If you haven\'t yet, be sure to download the Zooniverse Mobile App on Android or iPhone!',
      iphone: 'Zooniverse for iPhone',
      android: 'Zooniverse for Android'
    },
    validations: {
      workflowHasSingleTask: 'Has one Task',
      taskHasTwoAnswers: 'Has two available answers (e.g. Yes/No)',
      taskQuestionNotTooLong: 'Question has less than 200 characters',
      workflowNotTooManyShortcuts: 'Has less than three shortcuts',
      workflowFlipbookDisabled: 'Cannot be a flipbook',
      taskFeedbackDisabled: 'Cannot provide feedback',
    },
    projectEligible: 'Check this box if you think your question fits in this way.  If you have a Yes/No question, we recommend Yes as the first option listed so that it appears on the right.',
    projectIneligible: 'Sorry, but the mobile app will not currently work for this workflow. The following are the requirements for the swipe workflow.',
    mobileHelp: 'Mobile app:  Check this box if you would like this workflow available in the mobile app',
  }
});

const APP_STORE_LINKS = {
  iphone: 'https://itunes.apple.com/us/app/zooniverse/id1194130243?mt=8',
  android: 'https://play.google.com/store/apps/details?id=com.zooniversemobile&hl=en'
};

class MobileSection extends Component {
  constructor(props) {
    super(props);
    this.renderLink = this.renderLink.bind(this);
    this.renderValidation = this.renderValidation.bind(this);
  }

  render() {
    const helpTextKey = (this.props.enabled) ? 'projectEligible' : 'projectIneligible';
    return (
      <section>
        <Translate content="mobileSection.title" component="span" className="form-label" />
        <br />

        <div className="workflow-mobile-form">

          <div className="workflow-mobile-form-left-panel">

             <label
              className="pill-button"
              htmlFor="mobile_friendly"
            >
              <input
                id="mobile_friendly"
                type="checkbox"
                disabled={!this.props.enabled}
                onChange={this.props.toggleChecked}
                checked={this.props.checked}
              />
              {' '}
              Enable on mobile app
            </label>

            <p>
              <Translate content={`mobileSection.${helpTextKey}`} component="small" />
            </p>

            <ul>
              {map(this.props.validations, this.renderValidation)}
            </ul>

            <p className="form-help">
              <Translate content="mobileSection.download.disclaimer" component="small" />
            </p>

            <p className="form-help">
              <Translate content="mobileSection.download.help" component="small" />
            </p>

            <ul>
              {map(APP_STORE_LINKS, this.renderLink)}
            </ul>
          </div>

          <div className="workflow-mobile-form-right-panel">
            <img alt="mobile-sample" src="/assets/mobile-sample.png" />
          </div>

        </div>

      </section>
    );
  }

  renderLink(link, key) {
    return (
      <li key={link}>
        <small>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Translate content={`mobileSection.download.${key}`} />
          </a>
        </small>
      </li>
    );
  }

  renderValidation(value, key) {
    const icon = (value) ? 'fa-check' : 'fa-times';
    const color = (value) ? 'green' : 'red';
    return (
      <li key={key}>
        <Translate content={`mobileSection.validations.${key}`} component="small" />
        <i className={`fa ${icon}`} style={{ color }} aria-hidden="true" />
      </li>
    );
  }
}

MobileSection.propTypes = {
  validations: PropTypes.shape({
    workflowQuestionHasOneOrLessImages: PropTypes.func
  }),
  enabled: PropTypes.bool,
  toggleChecked: PropTypes.func,
  checked: PropTypes.bool
};

export default MobileSection;
