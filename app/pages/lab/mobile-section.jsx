import React from 'react';
import AutoSave from '../../components/auto-save';

export default class MobileSection extends React.Component {
  constructor(props) {
    super(props);
    this.toggleSwipeEnabled = this.toggleSwipeEnabled.bind(this);
  }

  toggleSwipeEnabled({ target }) {
    const changes = {};
    changes['configuration.swipe_enabled'] = target.checked;
    this.props.workflow.update(changes).save();
    if (target.checked) {
      this.props.project.update({ mobile_friendly: target.checked }).save();
    }
  }

  render() {
    const nonShortCutTasks = Object.keys(this.props.workflow.tasks).filter((key) => { return this.props.workflow.tasks[key].type !== 'shortcut'; });
    const shortcut = this.props.workflow.tasks[this.props.task.unlinkedTask];
    const config = this.props.workflow.configuration;

    // the following are criteria for the swipe app
    const hasTwoAnswers = this.props.task.answers.length === 2;
    const hasSingleTask = nonShortCutTasks.length === 1;
    const questionNotTooLong = this.props.task.question.length < 200;
    const notTooManyShortcuts = shortcut ? shortcut.answers.length <= 2 : true;
    const isNotFlipbook = config ? config.multi_image_mode !== 'flipbook' : true;
    const doesNotUseFeedback = this.props.task.feedback ? !this.props.task.feedback.enabled : true;

    const swipeEligible = hasTwoAnswers && hasSingleTask && questionNotTooLong && notTooManyShortcuts && isNotFlipbook && doesNotUseFeedback;

    const ineligibleText = (
      <small className="form-help">
        Sorry, but the mobile app will not currently work for this workflow.
        <br />
        The following are the requirements for the swipe workflow.
        <ul>
          <li>Has one Task { hasSingleTask ? meets : doesntMeet }</li>
          <li>Has two available answers (e.g. Yes/No) { hasTwoAnswers ? meets : doesntMeet }</li>
          <li>Question has less than 200 characters { questionNotTooLong ? meets : doesntMeet }</li>
          <li>Has less than three shortcuts { notTooManyShortcuts ? meets : doesntMeet }</li>
          <li>Cannot be a flipbook { isNotFlipbook ? meets : doesntMeet }</li>
          <li>Cannot provide feedback { doesNotUseFeedback ? meets : doesntMeet }</li>
        </ul>
      </small>
    );
    
    const swipeEnabledChecked = !!this.props.workflow.configuration.swipe_enabled && swipeEligible;
    
    const launchApproved = this.props.project.launch_approved;

    return (
      <div>
        <span className="form-label">Mobile App</span>
        <br />
        <div className="workflow-mobile-form">
          <div className="workflow-mobile-form-left-panel">
            <label
              className="pill-button"
              htmlFor="swipe_enabled"
              title={mobileHelp}
              style={(swipeEligible && launchApproved) ? null : disabledStyle}
            >
              <AutoSave resource={this.props.workflow}>
                <input
                  id="swipe_enabled"
                  type="checkbox"
                  disabled={!swipeEligible || !launchApproved}
                  onChange={this.toggleSwipeEnabled}
                  checked={swipeEnabledChecked}
                />
                {' '}
                Enable on mobile app
              </AutoSave>
            </label>
            <br />

            { swipeEligible ? eligibleText : ineligibleText }

            { launchApproved ? null : approvedHelp }

            <p className="form-help">
              <small>
                If you haven&apos;t yet, be sure to download the Zooniverse Mobile App on Android or iPhone!
              </small>
            </p>

            <ul>
              <li>
                <small>
                  <a href="https://itunes.apple.com/us/app/zooniverse/id1194130243?mt=8" target="_blank" rel="noopener noreferrer">Zooniverse for iPhone</a>
                </small>
              </li>
              <li>
                <small>
                  <a href="https://play.google.com/store/apps/details?id=com.zooniversemobile&hl=en" target="_blank" rel="noopener noreferrer">Zooniverse for Android</a>
                </small>
              </li>
            </ul>

          </div>
          <div className="workflow-mobile-form-right-panel">
            <img alt="mobile-sample" src="/assets/mobile-sample.png" />
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

const disabledStyle = {
  opacity: 0.5,
  pointerEvents: 'none'
};

const doesntMeet =
  <i className="fa fa-times" style={{ color: 'red' }} aria-hidden="true" />;

const meets =
  <i className="fa fa-check" style={{ color: 'green' }} aria-hidden="true" />;

const eligibleText = (
  <p className="form-help">
    <small>
      Check this box if you think your question fits in this way.  If you have a Yes/No question, we recommend Yes is the first option listed so that it appears on the right.
    </small>
  </p>
);

const mobileHelp = 'Mobile app:  Check this box if you would like this workflow available in the mobile app';

const approvedHelp = (
    <p className="form-help error">
      <small>
        Your project must be approved for launch to be enabled on the mobile app.
      </small>
    </p>
);

MobileSection.propTypes = {
  task: React.PropTypes.shape(
    {
      question: React.PropTypes.string,
      unlinkedTask: React.PropTypes.string,
      answers: React.PropTypes.array,
      feedback: React.PropTypes.object
    }
  ),
  workflow: React.PropTypes.shape(
    {
      tasks: React.PropTypes.object,
      update: React.PropTypes.func,
      configuration: React.PropTypes.object
    }
  ),
  project: React.PropTypes.shape(
    {
      update: React.PropTypes.func
    }
  )
};

MobileSection.defaultProps = {
  task: { },
  workflow: { },
  project: { }
};
