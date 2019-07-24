import React, { Component } from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import ValidationValue from './mobile-validations';

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
      taskQuestionNotTooLong: 'Question has less than 200 characters',
      workflowNotTooManyShortcuts: 'Has less than three shortcuts',
      workflowDoesNotContainShortcuts: 'Has no shortcuts',
      taskFeedbackDisabled: 'Cannot provide feedback',
      workflowQuestionHasOneOrLessImages: 'Task question has no more than one image',
      drawingToolTypeIsValid: 'Drawing tool must be a rectangle tool',
      drawingTaskHasOneTool: 'Drawing task must have only 1 tool',
      drawingTaskHasNoSubtasks: 'Drawing tool must not have any subtasks'
    },
    projectEligible: 'Check this box if you think your question fits in this way.  If you have a Yes/No two choice question, we recommend Yes as the first option listed so that it appears on the right.',
    projectIneligible: 'Sorry, but the mobile app will not currently work for this workflow. The following are the requirements for the swipe workflow.',
    imageWarning: 'It appears that you have more than one image in your task question. While this is allowed for mobile, we will only show the first image.',
    mobileHelp: 'Mobile app:  Check this box if you would like this workflow available in the mobile app',
  }
});

const APP_STORE_LINKS = {
  iphone: 'https://itunes.apple.com/us/app/zooniverse/id1194130243?mt=8',
  android: 'https://play.google.com/store/apps/details?id=com.zooniversemobile&hl=en'
};

const iconFromValidation = (validation) => {
  switch (validation) {
    case ValidationValue.pass:
      return 'fa-check';
    case ValidationValue.fail:
      return 'fa-times';
    case ValidationValue.warning:
      return 'fa-exclamation-triangle';
    default:
      return '';
  }
};

const iconColorFromValidation = (validation) => {
  switch (validation) {
    case ValidationValue.pass:
      return 'green';
    case ValidationValue.fail:
      return 'red';
    case ValidationValue.warning:
      return '#FFCC00';
    default:
      return '';
  }
};

const renderLink = (link, key) => {
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
};

const renderValidation = (validationValue, validationCheckName) => {
  const icon = iconFromValidation(validationValue);
  const color = iconColorFromValidation(validationValue);
  return (
    <li key={validationCheckName}>
      <Translate content={`mobileSection.validations.${validationCheckName}`} component="small" />
      <i className={`fa ${icon}`} style={{ color }} aria-hidden="true" />
    </li>
  );
};

class MobileSection extends Component {

  render() {
    const warningView = (
      <p>
        <i className={'fa fa-exclamation-triangle'} style={{ color: '#FFCC00', paddingRight: 5 }} aria-hidden="true" />
        <Translate content={'mobileSection.imageWarning'} component="small" />
      </p>
    );

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

            {
              this.props.validations.workflowQuestionHasOneOrLessImages === ValidationValue.warning ? warningView : null
            }

            <ul>
              {map(this.props.validations, renderValidation)}
            </ul>

            <p className="form-help">
              <Translate content="mobileSection.download.disclaimer" component="small" />
            </p>

            <p className="form-help">
              <Translate content="mobileSection.download.help" component="small" />
            </p>

            <ul>
              {map(APP_STORE_LINKS, renderLink)}
            </ul>
          </div>

          <div className="workflow-mobile-form-right-panel">
            <img alt="mobile-sample" src="/assets/mobile-sample.png" />
          </div>

        </div>

      </section>
    );
  }
}

MobileSection.propTypes = {
  validations: PropTypes.shape({
    workflowQuestionHasOneOrLessImages: PropTypes.string
  }),
  enabled: PropTypes.bool,
  toggleChecked: PropTypes.func,
  checked: PropTypes.bool
};

export default MobileSection;
