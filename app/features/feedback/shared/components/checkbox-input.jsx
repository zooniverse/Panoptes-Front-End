import React, { PropTypes } from 'react';
import uuidv4 from 'uuid/v4';


function CheckboxInput({ title, help, onChange, checked, name }) {
  const uuid = uuidv4();
  return (
    <div>
      <label htmlFor={uuid}>
        <input
          id={uuid}
          type="checkbox"
          name={name}
          onChange={onChange}
          checked={checked}
        />
        {title}
      </label>
      <small className="form-help">
        {help}
      </small>
    </div>
  );
}

CheckboxInput.propTypes = {
  title: PropTypes.string,
  help: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  name: PropTypes.string
};

export default CheckboxInput;
