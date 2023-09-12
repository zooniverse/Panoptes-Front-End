/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */

import { useWorkflowContext } from '../context.js';
import strings from '../strings.json';

export default function WorkflowSettingsPage() {
  const { workflow, update } = useWorkflowContext();

  function onSubmit(e) {
    e.preventDefault();
    try {
      console.log('+++ onSubmit: ', e);
    } catch (err) {
      console.error('WorkflowSettingsPageError: ', err);
    }
    return false;
  }

  function doUpdate(e) {
    const key = e.target.name;
    const value = e.target.value || '';

    update({
      [key]: value
    });
  }

  if (!workflow) return null;

  return (
    <form className="workflow-settings-page" onSubmit={onSubmit}>
      <label htmlFor="display_name">
        Workflow Name
        <input
          type="text"
          name="display_name"
          defaultValue={workflow?.display_name || ''}
          onBlur={doUpdate}
        />
      </label>
    </form>
  );
}
