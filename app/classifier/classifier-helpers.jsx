import React from 'react';
import Intervention from '../lib/intervention.cjsx';

export const VisibilityWrapper = (props) => {
  if (props.visible) {
    return props.children;
  } else {
    return null;
  }
};

VisibilityWrapper.propTypes = {
  visible: React.PropTypes.any,
  children: React.PropTypes.node,
};

export const RenderNextOrDoneButton = (props) => {
  if (props.nextVisible) {
    return (
      <button
        type="button"
        className="continue major-button"
        disabled={props.disabled}
        onClick={props.onNext}
      >
        Next
      </button>
    );
  } else {
    let icon;
    if (props.demoMode) {
      icon = <i className="fa fa-trash fa-fw"></i>;
    } else if (props.goldMode) {
      icon = <i className="fa fa-star fa-fw"></i>;
    }
    return (
      <button
        type="button"
        className="continue major-button"
        disabled={props.disabled}
        onClick={props.onDone}
      >
        {icon}{' '}Done
      </button>
    );
  }
};

RenderNextOrDoneButton.propTypes = {
  nextVisible: React.PropTypes.bool,
  demoMode: React.PropTypes.bool,
  goldMode: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  onNext: React.PropTypes.func,
  onDone: React.PropTypes.func,
};

const Warning = (props) => {
  return (
    <p style={{ textAlign: 'center' }}>
      <i className={`fa ${props.iconClass}`}></i>
      {' '}
      <small>
        {props.children}
      </small>
    </p>
  );
};

Warning.propTypes = {
  children: React.PropTypes.node,
  iconClass: React.PropTypes.string,
};

export const RenderDemoOrGoldWarning = (props) => {
  if (props.demoMode) {
    return (
      <Warning iconClass="fa-trash">
        <strong>Demo mode:</strong>
        <br />
        No classifications are being recorded.
        {' '}
        <button type="button" className="secret-button" onClick={props.onChangeDemoMode}>
          <u>Disable</u>
        </button>
      </Warning>
    );
  } else if (props.goldMode) {
    return (
      <Warning iconClass="fa-star">
        <strong>Gold standard mode:</strong>
        <br />
        Please ensure this classification is completely accurate.
        {' '}
        <button
          type="button"
          className="secret-button"
          onClick={props.onChangeGoldMode}
        >
          <u>Disable</u>
        </button>
      </Warning>
    );
  } else {
    return null;
  }
};

RenderDemoOrGoldWarning.propTypes = {
  demoMode: React.PropTypes.bool,
  goldMode: React.PropTypes.bool,
  onChangeDemoMode: React.PropTypes.func,
  onChangeGoldMode: React.PropTypes.func,
};

export const RenderIntervention = (props) => {
  const interventionProps = Object.assign({}, props);
  delete interventionProps.visible;
  delete interventionProps.interventionMonitor;
  delete interventionProps.experimentsClient;
  if (props.visible) {
    return (
      <Intervention
        {...interventionProps}
        expermentName={props.interventionMonitor.latestFromSugar.experiment_name}
        interventionID={props.interventionMonitor.latestFromSugar.next_event}
        interventionDetails={props.experimentsClient.constructInterventionFromSugarData(props.interventionMonitor.latestFromSugar)}
      />
    );
  } else {
    return null;
  }
};

RenderIntervention.propTypes = {
  visible: React.PropTypes.bool,
  interventionMonitor: React.PropTypes.object,
  experimentsClient: React.PropTypes.object,
};
