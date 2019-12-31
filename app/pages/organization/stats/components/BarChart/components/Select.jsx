import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

function Select({
  current,
  handleChange,
  options,
  selectFor
}) {
  function handleSelectChange(e) {
    if (e && e.target && e.target.value) {
      handleChange(e.target.value, selectFor);
    }
  }

  return (
    <select
      id={`${selectFor}-select-${current}`}
      value={current}
      onChange={handleSelectChange}
    >
      {options.map(({ label, value }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  );
}

Select.propTypes = {
  current: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ).isRequired,
  selectFor: PropTypes.string.isRequired
};

Select.defaultProps = {
  current: undefined
};

export default Select;
