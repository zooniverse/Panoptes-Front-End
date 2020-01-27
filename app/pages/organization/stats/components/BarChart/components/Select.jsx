import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

export const StyledSelect = styled.select`
  margin: 0 3px;
`;

export const HiddenLabel = styled.label`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

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
    <>
      <HiddenLabel htmlFor={`${selectFor}-select-${current}`}>
        {`Select ${selectFor}`}
      </HiddenLabel>
      <StyledSelect
        id={`${selectFor}-select-${current}`}
        value={current}
        onChange={handleSelectChange}
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </StyledSelect>
    </>
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
