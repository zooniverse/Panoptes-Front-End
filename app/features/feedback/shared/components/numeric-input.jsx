import PropTypes from 'prop-types';
import React from 'react';

function NumericInput({ help, onChange, min, max, step, placeholder, name, title, value }) {
  return (
    <fieldset>
      <label>
        {title}
        <input
          type="number"
          step={step}
          value={value}
          min={min}
          max={max}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      </label>
      <small className="form-help">
        {help}
      </small>
    </fieldset>
  );
}

NumericInput.propTypes = {
  help: PropTypes.string,
  onChange: PropTypes.func,
  min: PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
  name: PropTypes.string,
  placeholder: PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
};

export default NumericInput;
