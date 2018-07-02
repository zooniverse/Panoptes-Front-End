import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import Dialog from 'modal-form/dialog';
import Translate from 'react-translate-component';
import { Markdown } from 'markdownz';
import { Provider } from 'react-redux';
import animatedScrollTo from 'animated-scrollto';
import MediaCard from '../components/media-card';

import Translations from './translations';

const completedThisSession = {};
if (window) window.tutorialsCompletedThisSession = completedThisSession;

export default class Tutorial extends React.Component {
  constructor(props) {
    super(props);

    this.previousActiveElement = document.activeElement;
    this.goPrevious = this.goPrevious.bind(this);
    this.goNext = this.goNext.bind(this);
    this.goTo = this.goTo.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      stepIndex: props.defaultStepIndex
    }
  }

  static find(workflow) {
    // Prefer fetching the tutorial for the workflow, if a workflow is given.
    if (workflow) {
      return apiClient.type('tutorials').get({ workflow_id: workflow.id })
        .then((tutorials) => {
          // Backwards compatibility for null kind values. We assume these are standard tutorials.
          const onlyStandardTutorials = tutorials.filter((tutorial) => {
            return ['tutorial', null].includes(tutorial.kind);
          });
          return onlyStandardTutorials[0];
        })
    } else {
      return Promise.resolve();
    }
  }

  static startIfNecessary(tutorial, user, projectPreferences, geordi, store) {
    if (tutorial) {
      this.checkIfCompleted(tutorial, user, projectPreferences).then((completed) => {
        if (!completed) {
          this.start(tutorial, user, projectPreferences, geordi, store);
        }
      });
    }
  }

  static checkIfCompleted(tutorial, user, projectPreferences) {
    if (user) {
      window.prefs = projectPreferences
      if (projectPreferences && projectPreferences.preferences && projectPreferences.preferences.tutorials_completed_at) {
        return Promise.resolve(!!projectPreferences.preferences.tutorials_completed_at[tutorial.id]);
      }
    }

    return Promise.resolve(!!completedThisSession[tutorial.id]);
  }

  static start(tutorial, user, projectPreferences, geordi, store) {
    const TutorialComponent = this;

    if (tutorial.steps.length !== 0) {
      const awaitTutorialMedia = tutorial.get('attached_images')
        .catch(() => {
          // Checking for attached images throws if there are none.
          return [];
        }).then((mediaResources) => {
          const mediaByID = {};
          mediaResources.forEach((mediaResource) => {
            mediaByID[mediaResource.id] = mediaResource;
          });

          return mediaByID;
        });

      awaitTutorialMedia.then((mediaByID) => {
        const tutorialContent = (
          <Provider store={store}>
            <Translations original={tutorial} type="tutorial">
              <TutorialComponent tutorial={tutorial} media={mediaByID} projectPreferences={projectPreferences} user={user} geordi={geordi} />
            </Translations>
          </Provider>
        );
        Dialog.alert(tutorialContent, {
          className: 'tutorial-dialog',
          required: true,
          closeButton: true
        }).catch((e) => {
          console.warn(e);
          return null; // We don't really care if the user canceled or completed the tutorial.
        });
      });
    }
  }

  static propTypes = {
    defaultStepIndex: PropTypes.number,
    geordi: PropTypes.object,
    projectPreferences: PropTypes.shape({
      preferences: PropTypes.object,
    }),
    tutorial: PropTypes.shape({
      steps: PropTypes.arrayOf(PropTypes.shape({
        media: PropTypes.string,
        content: PropTypes.string,
      })),
    }),
    translation: PropTypes.shape({
      steps: PropTypes.arrayOf(PropTypes.shape({
        content: PropTypes.string,
      })),
    }),
    user: PropTypes.object
  }

  static defaultProps = {
    defaultStepIndex: 0,
    geordi: {},
    media: {},
    projectPreferences: null,
    tutorial: {},
    user: null
  }

  componentDidMount() {
    addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    this.handleUnmount();    
    removeEventListener('keydown', this.handleKeyDown);
  }

  goPrevious(total) {
    const previousStep = this.state.stepIndex - 1;
    if (previousStep >= 0) this.handleStep(total, previousStep);
  }

  goNext(total, event) {
    if (event) event.preventDefault();
    const nextStep = this.state.stepIndex + 1;
    if (nextStep <= (total - 1)) this.handleStep(total, nextStep);
  }

  goTo(total, index) {
    this.handleStep(total, index)
  }

  handleStep(total, index) {
    this.setState({
      stepIndex: ((index % total) + total) % total
    }, this.handleScroll);
  }

  handleKeyDown(e) {
    const total = this.props.tutorial.steps.length;
    switch (e.which) {
      // left
      case 37:
        e.preventDefault();
        this.goPrevious(total);
        break;
      // right
      case 39:
        e.preventDefault();
        this.goNext(total);
        break;
    }
  }

  handleScroll() {
    setTimeout(animatedScrollTo(this.div, this.div.offsetTop, 0), 500);
  }

  handleUnmount() {
    if (this.previousActiveElement) this.previousActiveElement.focus();

    const now = new Date().toISOString();
    completedThisSession[this.props.tutorial.id] = now;

    if (this.props.user) {
      const { projectPreferences } = this.props;
      // Build this manually. Having an index (even as a strings) keys creates an array.
      if (!projectPreferences.preferences) {
        projectPreferences.preferences = {};
      }
      if (!projectPreferences.preferences.tutorials_completed_at) {
        projectPreferences.preferences.tutorials_completed_at = {};
      }
      let { tutorials_completed_at } = projectPreferences.preferences;
      if (Array.isArray(tutorials_completed_at)) {
        const new_completed_at = tutorials_completed_at.reduce((accumulator, currentValue, index) => {
          if (currentValue) {
            const tutorial_id = index.toString();
            accumulator[tutorial_id] = currentValue;
          }
          return accumulator;
        }, {});
        tutorials_completed_at = new_completed_at;
      }
      tutorials_completed_at[this.props.tutorial.id] = now;
      projectPreferences
        .update({'preferences.tutorials_completed_at': tutorials_completed_at})
        .save();
      this.logToGeordi(now);
    }
  }

  logToGeordi(datetime) {
    this.props.geordi.logEvent({
      type: "tutorial-completion",
      data: {
        tutorial: this.props.tutorial.id,
        tutorialCompleted: datetime
      }
    });
  }

  render() {
    let tutorialStyle;
    const isIE = Object.keys(window).includes('ActiveXObject');
    if (isIE) {
      tutorialStyle = { height: '85vh' };
    }
    const totalSteps = this.props.tutorial.steps.length;
    const allSteps = Array.from(Array(totalSteps).keys());
    const currentStep = this.props.tutorial.steps[this.state.stepIndex];
    const mediaCardSrc = this.props.media[currentStep.media] ? this.props.media[currentStep.media].src : '';

    return (
      <div ref={(component) => { this.div = component; }} className="tutorial-steps" style={tutorialStyle}>
        <MediaCard className="tutorial-step" src={mediaCardSrc}>
          <Markdown>{this.props.translation.steps[this.state.stepIndex].content}</Markdown>
          <hr />          
        </MediaCard>
        <p style={{ textAlign: 'center' }}>
          {(this.state.stepIndex === this.props.tutorial.steps.length - 1) ?
            <button type="submit" className="major-button">
              <Translate content="classifier.letsGo" />
            </button> :
            <button type="button" className="standard-button" onClick={this.goNext.bind(this, totalSteps)}>
              <Translate content="classifier.continue" />
            </button>}
        </p>
        {totalSteps > 1 &&
          <div className="step-through-controls" style={{ position: 'relative' }}>
            <button
              type="button"
              className="step-through-direction step-through-previous"
              aria-label="Previous step"
              title="Previous"
              disabled={this.state.stepIndex === 0}
              onClick={this.goPrevious.bind(this, totalSteps)}
            >
              ◀
          </button>

            <span className="step-through-pips">
              {allSteps.map(thisStep =>
                <label key={thisStep} className="step-through-pip" title={`Step ${thisStep + 1}`}>
                  <input
                    type="radio"
                    className="step-through-pip-input"
                    aria-label={`Step ${thisStep + 1} of ${totalSteps}`}
                    checked={thisStep === this.state.stepIndex}
                    autoFocus={thisStep === this.state.stepIndex}
                    onChange={this.goTo.bind(this, totalSteps, thisStep)}
                  />
                  <span className="step-through-pip-number">{thisStep + 1}</span>
                </label>
              )}
            </span>

            <button
              type="button"
              className="step-through-direction step-through-next"
              aria-label="Next step" title="Next"
              disabled={this.state.stepIndex === totalSteps - 1}
              onClick={this.goNext.bind(this, totalSteps)}
            >
              ▶
          </button>

          </div>}
      </div>
    );
  }
}
