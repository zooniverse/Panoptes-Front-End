// ESLint: don't import global React, and don't use .defaultProps.
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */

import { useWorkflowContext } from './context.js';

export default function Tester() {
  const { workflow, update } = useWorkflowContext();

  console.log('+++ workflow: ', workflow);
  console.log('+++ HELLO WORLD!');

  function doUpdate(e) {
    console.log('+++ doUpdate: ', e);
    update({
      display_name: e.target.value || ''
    });
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
