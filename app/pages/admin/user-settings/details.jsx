import PropTypes from 'prop-types';
import React from 'react';

import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';

const UserDetails = (props) => {
  const handleUserChange = handleInputChange.bind(props.user);
  const created = new Date(props.user.created_at)

  function onChange(e) {
    handleUserChange(e);
    props.user.save();
  }

  return (
    <div className="user-details">
      <ul>
        <li>ID: {props.user.id}</li>
        <li>Login: {props.user.login}</li>
        <li>Display name: {props.user.display_name}</li>
        <li>Email address: {props.user.email}</li>
        <li>Signed up: {created.toString()}</li>
        <li>
          <label>
            Valid email:{' '}
            <input
              type="checkbox"
              name="valid_email"
              checked={props.user.valid_email}
              onChange={onChange}
            />
          </label>
        </li>
      </ul>

      <form>
        <fieldset>
          <legend>Email preferences</legend>
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  name="global_email_communication"
                  checked={props.user.global_email_communication}
                  onChange={onChange}
                />{' '}
                Zooniverse general emails
              </label>
            </li>
              <label>
                <input
                  type="checkbox"
                  name="beta_email_communication"
                  checked={props.user.beta_email_communication}
                  onChange={onChange}
                />{' '}
                Beta test emails
              </label>
            <li>
            </li>
          </ul>
        </fieldset>
      </form>

    </div>
  );
}

UserDetails.propTypes = {
  user: PropTypes.object
}

export default UserDetails;
