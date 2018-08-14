import React from 'react';
import PropTypes from 'prop-types';

function Intervention({ notifications }) {
  const notification = notifications[notifications.length - 1];
  const { message } = notification.data;
  return (
    <div>
      <p>{message}</p>
    </div>
  );
}

Intervention.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.shape({
      message: PropTypes.string
    })
  })).isRequired
};

export default Intervention;
