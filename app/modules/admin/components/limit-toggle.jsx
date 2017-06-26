import React, { PropTypes } from 'react';

import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';

function LimitToggle({ editUser }) {
  return (
    <div>
      <AutoSave resource={editUser}>
        Subject Limit:
        {' '}
        <input 
          type="number" 
          min="1" 
          name="subject_limit"
          value={editUser.subject_limit}
          onChange={handleInputChange.bind(editUser)}
        />
      </AutoSave>
    </div>
  );
}

LimitToggle.propTypes = {
  editUser: PropTypes.object.isRequired,
};

LimitToggle.defaultProps = {
  editUser: null,
};

export default LimitToggle;
