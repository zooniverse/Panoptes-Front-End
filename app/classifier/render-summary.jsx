import React from 'react';
import MetadataBasedFeedback from './metadata-based-feedback.cjsx';
import WorldWideTelescope from './world-wide-telescope';
import ClassificationSummary from './classification-summary';
import ExpertOptions from './render-expert-options';
import { Link } from 'react-router';

class RenderSummary extends React.Component {
  constructor(props) {
    super(props);
    this.toggleExpertClassificationOn = this.toggleExpertClassification.bind(this, true);
    this.toggleExpertClassificationOff = this.toggleExpertClassification.bind(this, false);
    this.state = {
      showingExpertClassification: false,
    };
  }

  toggleExpertClassification(value) {
    this.setState({ showingExpertClassification: value });
  }

  render() {
    let metadataBasedFeedback;
    if (this.props.project.experimental_tools && (this.props.project.experimental_tools.indexOf('metadata-based-feedback') > -1)) {
      metadataBasedFeedback = (
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

    let toggleButton;
    let showing;
    if (this.state.showingExpertClassification) {
      showing = 'Expert classification';
      toggleButton = (
        <button type="button" onClick={this.toggleExpertClassificationOff}>Hide</button>
      );
    } else {
      showing = 'Your classification';
      toggleButton = (
        <button type="button" onClick={this.toggleExpertClassificationOn}>Show</button>
      );
    }

    let worldWideTelescopeOrExpert;
    if (this.props.workflow.configuration.custom_summary && (this.props.workflow.configuration.custom_summary.indexOf('world_wide_telescope') > -1)) {
      worldWideTelescopeOrExpert = (
        <strong>
          <WorldWideTelescope
            annotations={this.props.classification.annotations}
            subject={this.props.subject}
            workflow={this.props.workflow}
          />
        </strong>
      );
    } else if (this.props.expertClassification) {
      worldWideTelescopeOrExpert = (
        <div>
          Expert classification available.
          {' '}
          {toggleButton}
        </div>
      );
    }

    let talkLink;
    if (this.props.owner && this.props.project) {
      const [ownerName, name] = this.props.project.slug.split('/');
      talkLink = (
        <Link
          onClick={this.props.onClickNext}
          to={`/projects/${ownerName}/${name}/talk/subjects/${this.props.subject.id}`}
          className="talk standard-button"
        >
          Talk
        </Link>
      );
    }

    let expertOptions;
    if (this.props.expertClassifier) {
      expertOptions = (
        <ExpertOptions
          userRoles={this.props.userRoles}
          goldStandard={this.props.classification.gold_standard}
          demoMode={this.props.demoMode}
          {...this.props.expertOptoinsProps}
        />
      );
    }

    return (
      <div>
        Thanks!
        {metadataBasedFeedback}
        {worldWideTelescopeOrExpert}
        <div>
          <strong>{showing}</strong>
          <ClassificationSummary workflow={this.props.workflow} classification={this.props.currentClassification} />
        </div>
        <hr />
        <nav className="task-nav">
          {talkLink}
          <button type="button" autoFocus className="continue major-button" onClick={this.props.onClickNext}>Next</button>
          {expertOptions}
        </nav>
      </div>
    );
  }
}

RenderSummary.propTypes = {
  project: React.PropTypes.object,
  subject: React.PropTypes.object,
  owner: React.PropTypes.object,
  workflow: React.PropTypes.object,
  classification: React.PropTypes.object,
  currentClassification: React.PropTypes.object,
  expertClassification: React.PropTypes.bool,
  onClickNext: React.PropTypes.func,
  demoMode: React.PropTypes.bool,
  userRoles: React.PropTypes.object,
  expertClassifier: React.PropTypes.bool,
  expertOptoinsProps: React.PropTypes.shape({
    handleGoldStandardChange: React.PropTypes.func,
    handleDemoModeChange: React.PropTypes.func,
  }),
};

export default RenderSummary;
