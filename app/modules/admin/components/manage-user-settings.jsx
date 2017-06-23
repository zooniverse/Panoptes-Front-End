import React, { Component } from 'react';
import Checkbox from 'grommet/components/Checkbox';
import Heading from 'grommet/components/Heading';

import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';
import UserLimitToggle from './limit-toggle';

class ManageUserSettings extends Component {
  constructor(props) {
    super(props);
    this.boundForceUpdate = this.forceUpdate.bind(this);
  }

  componentDidMount() {
    if (this.props.editUser != null) {
      this.props.editUser.listen('change', this.boundForceUpdate);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.editUser != null) {
      this.props.editUser.stopListening('change', this.boundForceUpdate);
    }
    nextProps.editUser.listen('change', this.boundForceUpdate);
  }

  componentWillUnmount() {
    this.props.editUser.stopListening('change', this.boundForceUpdate);
  }

  render() {
    if (!this.props.editUser) {
      return (
        <div>No user found</div>
      );
    }

    const handleChange = handleInputChange.bind(this.props.editUser);
    return (
      <div className="project-status">
        <Heading tag="h3">Settings</Heading>
        <ul>
          <li>
            <Checkbox 
              checked={this.props.editUser.admin}
              name="admin"
              disabled 
              label="Admin"
            />
          </li>
          <li>
            <Checkbox 
              checked={this.props.editUser.login_prompt}
              name="login_prompt"
              disabled 
              label="Login prompt"
            />
          </li>
          <li>
            <Checkbox 
              checked={this.props.editUser.private_profile} 
              name="private_profile" 
              disabled 
              label="Private profile" 
            />
          </li>
          <li>
            <AutoSave resource={this.props.editUser}>
              <Checkbox 
                checked={this.props.editUser.upload_whitelist} 
                name="upload_whitelist" 
                label="Whitelist subject uploads"
                onChange={handleChange}
              />
            </AutoSave>
          </li>
        </ul>

        <ul>
          <li>Uploaded subjects: {this.props.editUser.uploaded_subjects_count}</li>
          <li><UserLimitToggle editUser={this.props.editUser} /></li>
        </ul>
      </div>
    );
  }
}

ManageUserSettings.propTypes = {
  editUser: React.PropTypes.object
};

ManageUserSettings.defaultProps = {
  editUser: null
};

export default ManageUserSettings;
