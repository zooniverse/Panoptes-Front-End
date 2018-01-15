import PropTypes from 'prop-types';
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
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default WarningBanner;