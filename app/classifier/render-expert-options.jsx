import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';
import isAdmin from '../lib/is-admin.coffee';
import { VisibilityWrapper } from './classifier-helpers';

const ExpertOption = (props) => {
  return (
    <p>
      <label>
        <input type="checkbox" checked={props.checked} onChange={props.onChange} />
        {' '}
        {props.label}
      </label>
      {' '}
      <TriggeredModalForm trigger={<i className="fa fa-question-circle"></i>}>
        {props.children}
      </TriggeredModalForm>
    </p>
  );
};

ExpertOption.propTypes = {
  checked: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  label: React.PropTypes.string,
  children: React.PropTypes.node,
};

const ExpertOptions = (props) => {
  if (props.expertClassifier) {
    return (
      <TriggeredModalForm trigger={<i className="fa fa-cog fa-fw"></i>}>
        <VisibilityWrapper visible={(props.userRoles.indexOf('owner') > -1) || (props.userRoles.indexOf('expert') > -1)}>
          <ExpertOption
            checked={props.goldStandard}
            onChange={props.handleGoldStandardChange}
            label={'Gold standard mode'}
          >
            <p>
              A “gold standard” classification is one that is known to be completely accurate.
              {' '}We’ll compare other classifications against it during aggregation.
            </p>
          </ExpertOption>
        </VisibilityWrapper>
        <VisibilityWrapper visible={isAdmin() || (props.userRoles.indexOf('owner') > -1) || (props.userRoles.indexOf('collaborator') > -1)}>
          <ExpertOption
            checked={props.demoMode}
            onChange={props.handleDemoModeChange}
            label={'Demo mode'}
          >
            <p>
              In demo mode, classifications <strong>will not be saved</strong>.
              {' '}Use this for quick, inaccurate demos of the classification interface.
            </p>
          </ExpertOption>
        </VisibilityWrapper>
      </TriggeredModalForm>
    );
  } else {
    return null;
  }
};

ExpertOptions.propTypes = {
  expertClassifier: React.PropTypes.bool,
  userRoles: React.PropTypes.array,
  goldStandard: React.PropTypes.bool,
  demoMode: React.PropTypes.bool,
  handleGoldStandardChange: React.PropTypes.func,
  handleDemoModeChange: React.PropTypes.func,
};

export default ExpertOptions;
