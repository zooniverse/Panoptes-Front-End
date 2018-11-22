import React from 'react';
import PropTypes from 'prop-types';
import counterpart from 'counterpart';
import styled from 'styled-components';

const StyledInterventionMessage = styled.div`
  border-bottom: solid 1px;
  margin: 0 2em 1em;
  padding: 0 0 .7em;
  
  label: {
    font-size: 0.7em;
  }
`;

function Intervention({ notifications, user }) {
  const notification = notifications[notifications.length - 1];
  const { message } = notification;
  const checkbox = React.createRef();

  function onChange() {
    // Invert the checked value because true means do not send me messages.
    user
      .update({ intervention_notifications: !checkbox.current.checked })
      .save();
  }
  return (
    <StyledInterventionMessage>
      <p>{message}</p>
      <label>
        <input
          ref={checkbox}
          autoFocus={true}
          type="checkbox"
          onChange={onChange}
        />
        {counterpart('classifier.interventions.optOut')}
      </label>
    </StyledInterventionMessage>
  );
}

Intervention.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.shape({
      message: PropTypes.string
    })
  })).isRequired,
  user: PropTypes.shape({
    intervention_notifications: PropTypes.bool
  }).isRequired
};

export default Intervention;
