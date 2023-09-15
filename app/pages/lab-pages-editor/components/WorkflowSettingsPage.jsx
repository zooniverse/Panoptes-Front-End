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

      <div className="column-group col-1">
        <fieldset>
          <legend>Associated Subject Sets</legend>
          <p>Choose the set of subjects you want to use for this workflow. Add subject sets in the Subject Sets tab.</p>
          <p>TODO</p>
        </fieldset>

        <fieldset>
          <legend>Associated Tutorial</legend>
          <p>Choose the tutorials you want to use for this workflow. Create tutorials in the Tutorial tab.</p>
          <p>TODO</p>
        </fieldset>

        <hr />

        <fieldset>
          <legend>Subject Retirement</legend>
          <p>
            Set how many people should classify each subject before it is
            &quo;done.&quo; Once a subject has reached the retirement limit it
            will no longer be shown to volunteers.
          </p>
          <p>TODO</p>
          <p className="small-info">
            If you&apos;d like more complex retirement rules such as conditional
            retirement using Caesar, please get in touch via the Contact Us
            page.
          </p>
        </fieldset>
      </div>

      <div className="column-group col-2">
        <fieldset>
          <legend>Subject Viewer</legend>
          <p>Choose how to display your subjects. Refer to the Subject Viewer section of the Glossary for more info.</p>
          <p>TODO</p>
        </fieldset>

        <fieldset className="disabled">
          <legend>Multi-Image Options</legend>
          <p>
            Choose how to display subjects with multiple images.
            If your subjects are in a sequence, such as camera trap images,
            volunteers can play them like a .gif using the Flipbook viewer.
          </p>
          <p>TODO</p>
        </fieldset>

        <hr />

        <fieldset>
          <legend>Classification Tools</legend>
          <p>TODO</p>
        </fieldset>

        <fieldset>
          <legend>Quicktalk</legend>
          <p>TODO</p>
        </fieldset>

      </div>

    </form>
  );
}
