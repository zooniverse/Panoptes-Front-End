import React from 'react';
import { useWorkflowContext } from './context.js';

export default function Tester() {
  const { workflow, update } = useWorkflowContext();

  console.log('+++ workflow: ', workflow);
  console.log('+++ HELLO WORLD!');

  function doUpdate(e) {

  }

  if (!workflow) return null;

  return (
    <div>
      <h6>Tester</h6>
      <div>
        Workflow is called
        {workflow?.display_name}
      </div>
      <form onSubmit={() => false}>
        <input defaultValue={workflow?.display_name} onBlur={doUpdate} />
      </form>
    </div>
  );
}
