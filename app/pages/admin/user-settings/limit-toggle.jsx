import React, { Component } from 'react';

import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';

class LimitToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  render() {
    return (
      <div>
        <AutoSave resource={this.props.editUser}>
          Subject Limit:{' '}
          <input type="number" min="1" ref="subjectLimit" name="subject_limit"
            value={this.props.editUser.subject_limit}
            onChange={handleInputChange.bind(this.props.editUser)}
          />
        </AutoSave>
      </div>
    );
  }
}

LimitToggle.defaultProps = {
  editUser: null
};

export default LimitToggle;
