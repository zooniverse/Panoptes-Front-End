import React from 'react';

import DefaultClassificationSummary from './default-classification-summary';
import GSGoldStandardSummary from './gs-gold-standard-summary';
import MetadataBasedFeedback from './metadata-based-feedback';
import WorldWideTelescope from './world-wide-telescope';
import FeedbackSummary from './feedback/feedback-summary-container';

/* eslint-disable multiline-ternary, react/forbid-prop-types */

class ClassificationSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showExpert: false };
    this.dontShowExpert = () => {
      this.setState({ showExpert: false });
      this.props.toggleExpertClassification(false);
    };
    this.doShowExpert = () => {
      this.setState({ showExpert: true });
      this.props.toggleExpertClassification(true);
    };

    this.hasExpert = !!this.props.expertClassification;

    this.isFeedbackEnabled = this.isFeedbackEnabled.bind(this);
  }

  isSubjectASim() {
    const simMetadataField = this.props.subject.metadata['#sim'];

    if (typeof simMetadataField === 'string') {
      return simMetadataField.toLowerCase() === 'true';
    } else if (typeof simMetadataField === 'boolean') {
      return simMetadataField;
    }

    return false;
  }

  showExoplanetSimFeedback() {
    return (this.props.workflow.configuration &&
      this.props.workflow.configuration.sim_notification &&
      this.isSubjectASim() &&
      this.props.classification.annotations[0].value === 0
    );
  }

  isFeedbackEnabled() {
    if (this.props.project && this.props.project.experimental_tools.includes('general feedback')) {
      const { tasks } = this.props.workflow;
      return Object.keys(tasks)
        .map(key => tasks[key].feedback && tasks[key].feedback.enabled)
        .includes(true);
    }
    return false;
  }

  render() {
    const tools = this.props.project.experimental_tools || [];
    const summariesHook = [];

    if (this.isFeedbackEnabled()) {
      summariesHook.push(
        <FeedbackSummary
          classification={this.props.classification}
          subject={this.props.subject}
          workflow={this.props.workflow}
        />
      );
    }

    if (this.props.hasGSGoldStandard) {
      return (
        <GSGoldStandardSummary
          classification={this.props.classification}
          subject={this.props.subject}
          workflow={this.props.workflow}
        />
      );
    }

    if (tools.includes('metadata based feedback')) {
      return (
        <MetadataBasedFeedback
          subject={this.props.subject}
          classification={this.props.classification}
          dudLabel="DUD"
          simLabel="SIM"
          subjectLabel="SUB"
          metaTypeFieldName="#Type"
          metaSuccessMessageFieldName="#F_Success"
          metaFailureMessageFieldName="#F_Fail"
          metaSimCoordXPattern="#X"
          metaSimCoordYPattern="#Y"
          metaSimTolPattern="#Tol"
        />
      );
    }

    if (this.props.workflow.configuration &&
        this.props.workflow.configuration.custom_summary &&
        this.props.workflow.configuration.custom_summary.includes('world_wide_telescope')) {
      return (
        <strong>
          <WorldWideTelescope
            annotations={this.props.classification.annotations}
            subject={this.props.subject}
            workflow={this.props.workflow}
          />
        </strong>
      );
    }

    if (this.showExoplanetSimFeedback()) {
      return (
        <p style={{ fontWeight: 'bold' }}>Well done! You've found a simulated planet. We include these to help calibrate the project. Keep going to discover a real planet!</p>
      );
    }

    return (
      <div>
        { summariesHook.length ? summariesHook : null }
        { this.hasExpert ?
          <div className="has-expert-classification">
            Expert classification available.&nbsp;
            { this.state.showExpert ?
              <button type="button" onClick={this.dontShowExpert}>Hide</button> :
              <button type="button" onClick={this.doShowExpert}>Show</button> }
          </div> : '' }

        <div>
          <strong>
            { this.state.showExpert ? 'Expert Classification:' : 'Your classification:' }
          </strong>
          <DefaultClassificationSummary
            workflow={this.props.workflow}
            classification={this.state.showExpert ? this.props.expertClassification : this.props.classification}
            classificationCount={this.props.classificationCount}
            splits={this.props.splits}
          />
        </div>
      </div>
    );
  }
}

ClassificationSummary.propTypes = {
  project: React.PropTypes.shape({
    experimental_tools: React.PropTypes.array
  }).isRequired,
  workflow: React.PropTypes.shape({
    configuration: React.PropTypes.object
  }).isRequired,
  subject: React.PropTypes.object.isRequired,
  classification: React.PropTypes.object.isRequired,
  expertClassification: React.PropTypes.object,
  splits: React.PropTypes.object,
  classificationCount: React.PropTypes.number,
  hasGSGoldStandard: React.PropTypes.bool,
  toggleExpertClassification: React.PropTypes.func
};

export default ClassificationSummary;
