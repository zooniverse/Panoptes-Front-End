import React from 'react';
import MetadataBasedFeedback from './metadata-based-feedback.cjsx';
import WorldWideTelescope from './world-wide-telescope';

const RenderSummary = (props) => {
  let metadataBasedFeedback;
  if (props.project.experimental_tools && (props.project.experimental_tools.indexOf('metadata-based-feedback') > -1)) {
    metadataBasedFeedback = (
      <MetadataBasedFeedback
        subject={props.subject}
        classification={props.classification}
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

  let worldWideTelescopeOrExpert;
  if (props.workflow.configuration.custom_summary && (props.workflow.configuration.custom_summary.indexOf('world_wide_telescope') > -1)) {
    worldWideTelescopeOrExpert = (
      <strong>
        <WorldWideTelescope
          annotations={props.classification.annotations}
          subject={props.subject}
          workflow={props.workflow}
        />
      </strong>
    );
  } else if (props.expertClassification) {
    // THIS BIT NEEDS A STATE!
    worldWideTelescopeOrExpert = (
      <div>
        Expert classification available.
        {' '}
      </div>
    );
  }
  return (
    <div>
      Thanks!
      {metadataBasedFeedback}
      {worldWideTelescopeOrExpert}
    </div>
  );
};

RenderSummary.propTypes = {
  project: React.PropTypes.object,
  subject: React.PropTypes.object,
  workflow: React.PropTypes.object,
  classification: React.PropTypes.object,
  expertClassification: React.PropTypes.bool,
};

export default RenderSummary;
