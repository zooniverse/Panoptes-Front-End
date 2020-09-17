import PropTypes from 'prop-types';
import React from 'react';

import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';

const UserDetails = (props) => {
  const handleChange = handleInputChange.bind(props.user);

  return (
    <div className="user-details">
      <ul>
        <li>ID: {props.user.id}</li>
        <li>Login: {props.user.login}</li>
        <li>Display name: {props.user.display_name}</li>
        <li>Email address: {props.user.email}</li>
      </ul>

    </div>
  );
}

UserDetails.propTypes = {
  user: PropTypes.object
}

export default UserDetails;
