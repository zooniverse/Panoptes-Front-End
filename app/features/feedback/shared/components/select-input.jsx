import React from 'react';
import createUuid from '../../shared/helpers/uuid';
import Select from 'react-select';

function SelectInput({ help, onChange, multi = false, name, options, placeholder = '', title, value }) {
  const uuid = createUuid();
  return (
    <div>
      <label htmlFor={uuid}>
        {title}
      </label>
      <Select
        id={uuid}
        name={name}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        value={value}
      />
      <small className="form-help">
        {help}
      </small>
    </div>
  );
}

export default SelectInput;
