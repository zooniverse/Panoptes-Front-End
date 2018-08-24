import React from 'react';
import PropTypes from 'prop-types';

function Intervention({ notifications, user }) {
  const notification = notifications[notifications.length - 1];
  const { message } = notification.data;
  function optOut() {
    user
      .update({ intervention_notifications: false })
      .save();
  }
  return (
    <div>
      <p>{message}</p>
      <button
        onClick={optOut}
      >
        Don&apos;t show me these messages again
      </button>
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
