import React from 'react';
import PropTypes from 'prop-types';
import counterpart from 'counterpart';

function Intervention({ notifications, user }) {
  const notification = notifications[notifications.length - 1];
  const { message } = notification.data;
  const checkbox = React.createRef();

  function onChange() {
    // Invert the checked value because true means do not send me messages.
    user
      .update({ intervention_notifications: !checkbox.current.checked })
      .save();
  }
  return (
    <div>
      <p>{message}</p>
      <label>
        <input
          ref={checkbox}
          type="checkbox"
          onChange={onChange}
        />
        {counterpart('classifier.interventions.optOut')}
      </label>
    </div>
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
