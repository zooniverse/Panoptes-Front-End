import PropTypes from 'prop-types';
import React, { Component } from 'react';

import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';

class LimitToggle extends Component {
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

LimitToggle.propTypes = {
  editUser: PropTypes.object.isRequired
};

LimitToggle.defaultProps = {
  editUser: null
};

export default LimitToggle;