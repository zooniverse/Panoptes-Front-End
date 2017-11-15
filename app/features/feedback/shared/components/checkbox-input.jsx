import React from 'react';
import createUuid from '../../shared/helpers/uuid';

function CheckboxInput({ title, help, onChange, checked, name }) {
  const uuid = createUuid();
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

export default CheckboxInput;
