import React from 'react';
import createUuid from '../../shared/helpers/uuid';

function TextInput({ title, help, onChange, name, type = 'text', required = false, value }) {
  const uuid = createUuid();
  return (
    <div>
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
    </div>
  );
}

export default TextInput;
