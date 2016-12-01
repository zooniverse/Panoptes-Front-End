import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';
import isAdmin from '../lib/is-admin';

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
  let goldStandardMode;
  if ((props.userRoles.indexOf('owner') > -1) || (props.userRoles.indexOf('expert') > -1)) {
    goldStandardMode = (
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
    );
  }
  let demoMode;
  if (isAdmin() || (this.props.userRoles.indexOf('owner') > -1) || (this.props.userRoles.indexOf('collaborator') > -1)) {
    demoMode = (
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
    );
  }
  return (
    <TriggeredModalForm trigger={<i className="fa fa-cog fa-fw"></i>}>
      {goldStandardMode}
      {demoMode}
    </TriggeredModalForm>
  );
};

ExpertOptions.propTypes = {
  userRoles: React.PropTypes.object,
  goldStandard: React.PropTypes.bool,
  demoMode: React.PropType.bool,
  handleGoldStandardChange: React.PropTypes.func,
  handleDemoModeChange: React.PropTypes.func,
};

export default ExpertOptions;
