import React, { PropTypes } from 'react';
import uuidv4 from 'uuid/v4';

function TextInput({ title, help, onChange, name, type = 'text', required = false, value }) {
  const uuid = uuidv4();
  return (
    <fieldset>
      <label htmlFor={uuid}>
        {title}
      </label>
      <input
        id={uuid}
        name={name}
        onChange={onChange}
        required={required}
        type={type}
        value={value}
      />
      <small className="form-help">
        {help}
      </small>
    </fieldset>
  );
}

TextInput.propTypes = {
  title: PropTypes.string,
  help: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string
};

export default TextInput;
