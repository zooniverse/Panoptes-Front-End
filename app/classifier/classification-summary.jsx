import PropTypes from 'prop-types';
import React from 'react';
import { Markdown } from 'markdownz';

import DefaultClassificationSummary from './default-classification-summary';
import GSGoldStandardSummary from './gs-gold-standard-summary';
import WorldWideTelescope from './world-wide-telescope';

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

  render() {
    const tools = this.props.project.experimental_tools || [];
    const summariesHook = [];

    if (this.props.hasGSGoldStandard) {
      return (
        <GSGoldStandardSummary
          classification={this.props.classification}
          subject={this.props.subject}
          workflow={this.props.workflow}
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
            project={this.props.project}
            subject={this.props.subject}
            workflow={this.props.workflow}
          />
        </strong>
      );
    }

    if (this.props.workflow.configuration &&
        this.props.workflow.configuration.custom_summary) {
      summariesHook.push(
        <Markdown className='classification-summary'>
          {this.props.workflow.configuration.custom_summary}
        </Markdown>
      );
    }

    if (this.showExoplanetSimFeedback()) {
      return (
        <p style={{ fontWeight: 'bold' }}>Well done! You've found a simulated planet. We include these to help calibrate the project. Keep going to discover a real planet!</p>
      );
    }

    return (
      <div>
        { this.hasExpert ?
          <div className="has-expert-classification">
            Expert classification available.&nbsp;
            { this.state.showExpert ?
              <button type="button" onClick={this.dontShowExpert}>Hide</button> :
              <button type="button" onClick={this.doShowExpert}>Show</button> }
          </div> : '' }

        <div>
          { summariesHook.length ? summariesHook.map(item => item) : null }
          <strong className="classification-summary__title">
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
  project: PropTypes.shape({
    experimental_tools: PropTypes.array
  }).isRequired,
  workflow: PropTypes.shape({
    configuration: PropTypes.object
  }).isRequired,
  subject: PropTypes.object.isRequired,
  classification: PropTypes.object.isRequired,
  expertClassification: PropTypes.object,
  splits: PropTypes.object,
  classificationCount: PropTypes.number,
  hasGSGoldStandard: PropTypes.bool,
  toggleExpertClassification: PropTypes.func
};

export default ClassificationSummary;
