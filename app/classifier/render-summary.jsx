import React from 'react';
import ClassificationSummary from './classification-summary';
import MetadataBasedFeedback from './metadata-based-feedback.cjsx';
import WorldWideTelescope from './world-wide-telescope.cjsx';
import { Link } from 'react-router';
import { VisibilityWrapper } from './classifier-helpers';

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

    return (
      <div>
        Thanks!
        <VisibilityWrapper visible={this.props.project.experimental_tools && (this.props.project.experimental_tools.indexOf('metadata-based-feedback') > -1)}>
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
        </VisibilityWrapper>
        <VisibilityWrapper visible={this.props.workflow.configuration.custom_summary && (this.props.workflow.configuration.custom_summary.indexOf('world_wide_telescope') > -1)}>
          <WorldWideTelescope
            visible={this.props.workflow.configuration.custom_summary && (this.props.workflow.configuration.custom_summary.indexOf('world_wide_telescope') > -1)}
            annotations={this.props.classification.annotations}
            subject={this.props.subject}
            workflow={this.props.workflow}
          />
        </VisibilityWrapper>
        <VisibilityWrapper visible={this.props.expertClassification}>
          <div>
            Expert classification available.
            {' '}
            {toggleButton}
          </div>
        </VisibilityWrapper>
        <div>
          <strong>{showing}</strong>
          <ClassificationSummary workflow={this.props.workflow} classification={this.props.currentClassification} />
        </div>
        <hr />
        <nav className="task-nav">
          <VisibilityWrapper visible={this.props.owner && this.props.project}>
            <Link
              onClick={this.props.onClickNext}
              to={`/projects/${this.props.project.slug}/talk/subjects/${this.props.subject.id}`}
              className="talk standard-button"
            >
              Talk
            </Link>
          </VisibilityWrapper>
          <button type="button" autoFocus className="continue major-button" onClick={this.props.onClickNext}>Next</button>
          {this.props.children}
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
  userRoles: React.PropTypes.array,
  expertClassifier: React.PropTypes.bool,
  children: React.PropTypes.node,
};

export default RenderSummary;
