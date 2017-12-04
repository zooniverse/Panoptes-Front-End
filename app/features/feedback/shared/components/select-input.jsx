import React, { PropTypes } from 'react';
import Select from 'react-select';
import uuidv4 from 'uuid/v4';

function SelectInput({ help, onChange, multi = false, name, options, placeholder = '', title, value }) {
  const uuid = uuidv4();
  return (
    <fieldset>
      <label htmlFor={uuid}>
        {title}
      </label>
      <Select
        id={uuid}
        multi={multi}
        name={name}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        value={value}
      />
      <small className="form-help">
        {help}
      </small>
    </fieldset>
  );
}

SelectInput.propTypes = {
  help: PropTypes.string,
  onChange: PropTypes.func,
  multi: PropTypes.bool,
  name: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string
};

export default SelectInput;
