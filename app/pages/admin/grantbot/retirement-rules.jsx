import React from 'react';
  
function retirementRules({ data }) {
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

export default retirementRules;
