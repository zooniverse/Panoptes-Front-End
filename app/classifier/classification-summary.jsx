import React from 'react';

import DefaultClassificationSummary from './default-classification-summary';
import GSGoldStandardSummary from './gs-gold-standard-summary';
import MetadataBasedFeedback from './metadata-based-feedback';
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

  render() {
    const tools = this.props.project.experimental_tools || [];

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
  project: React.PropTypes.object.isRequired,
  workflow: React.PropTypes.object.isRequired,
  subject: React.PropTypes.object.isRequired,
  classification: React.PropTypes.object.isRequired,
  expertClassification: React.PropTypes.object,
  splits: React.PropTypes.object,
  classificationCount: React.PropTypes.number,
  hasGSGoldStandard: React.PropTypes.bool,
  toggleExpertClassification: React.PropTypes.func
};

export default ClassificationSummary;
