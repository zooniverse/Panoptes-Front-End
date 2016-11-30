import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';

const WarningBanner = (props) => {
  return (
    <TriggeredModalForm trigger={props.label} triggerProps={{ className: 'warning-banner' }}>
      {props.children}
    </TriggeredModalForm>
  );
};

WarningBanner.propTypes = {
  label: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired
};

export default WarningBanner;
