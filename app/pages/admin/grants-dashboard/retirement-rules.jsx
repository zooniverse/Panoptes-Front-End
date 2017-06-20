import React from 'react';
  
function retirementRules({ data }) {
  console.info('data', data)
  return (
    <section>
      <h3>Have default retirement limits been changed?</h3>
      <ul>
      {data.map(workflow => (
        <li key={workflow.id}>
          {workflow.name} <small>(#{workflow.id})</small> - {workflow.retirementHasBeenChanged.toString()}
        </li>
      ))}
      </ul>
    </section>
  );
}

export default retirementRules;
