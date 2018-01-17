import PropTypes from 'prop-types';
import React from 'react';

function RetirementRules({ data }) {
  return (
    <section>
      <h3>Have default retirement limits been changed?</h3>
      <ul>
      {data.map(({ id, name, retirementHasBeenChanged }) => (
        <li key={id}>
          {name} <small>(#{id})</small> - {retirementHasBeenChanged.toString()}
        </li>
      ))}
      </ul>
    </section>
  );
}

RetirementRules.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    retirementHasBeenChanged: PropTypes.bool.isRequired,
  })),
};

export default RetirementRules;