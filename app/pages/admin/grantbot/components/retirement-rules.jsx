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
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    retirementHasBeenChanged: React.PropTypes.bool.isRequired,
  })),
};

export default RetirementRules;
