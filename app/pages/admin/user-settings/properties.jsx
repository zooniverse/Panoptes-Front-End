import PropTypes from 'prop-types';
import React from 'react';

import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';

const UserProperties = (props) => {
  const handleChange = handleInputChange.bind(props.user);

  return (
    <div>
      <ul>
        <li>
          <input type="checkbox" name="admin" checked={props.user.admin} disabled />{' '}
          Admin
        </li>
        <li>
          <input type="checkbox" name="login_prompt" checked={props.user.login_prompt} disabled />{' '}
          Login prompt
        </li>
        <li>
          <input type="checkbox" name="private_profile" checked={props.user.private_profile} disabled />{' '}
          Private profile
        </li>
        <li>
          <AutoSave resource={props.user}>
            <input type="checkbox" name="upload_whitelist" checked={props.user.upload_whitelist} onChange={handleChange} />{' '}
            Whitelist subject uploads
          </AutoSave>
        </li>
        <li>
          <AutoSave resource={props.user}>
            <input type="checkbox" name="banned" checked={props.user.banned} onChange={handleChange} />{' '}
            Ban user
          </AutoSave>
        </li>
      </ul>

    </div>
  );
}

UserProperties.propTypes = {
  user: PropTypes.object
}

export default UserProperties;