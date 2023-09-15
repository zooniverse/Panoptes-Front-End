/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
/* eslint-disable radix */

import { useWorkflowContext } from '../context.js';
import strings from '../strings.json'; // TODO: move all text into strings

export default function WorkflowSettingsPage() {
  const { workflow, update } = useWorkflowContext();

  function onSubmit(e) {
    e.preventDefault();
    try {
      console.log('+++ onSubmit: ', e);
      // TODO: on Submit, run update() on every available field.
      // also, make sure the 'data-updaterule' rules are implemented.
    } catch (err) {
      console.error('WorkflowSettingsPageError: ', err);
    }
    return false;
  }

  function doUpdate(e) {
    const key = e.target.name;
    let value = e.target.value || '';
    const { updaterule } = e.target.dataset;

    if (updaterule === 'convert_to_number') value = parseInt(value);
    if (updaterule === 'undefined_if_empty') value = value || undefined;

    update({
      [key]: value
      // 'configuration.classifier_version': '2.0' // TODO: figure out if this needs 
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
          <p id="subject-retirement-info">
            Set how many people should classify each subject before it is
            &quot;done.&quot; Once a subject has reached the retirement limit it
            will no longer be shown to volunteers.
          </p>
          <div className="flex-row">
            <select
              aria-label="Retirement criteria"
              className="flex-item"
              defaultValue={workflow?.retirement?.criteria}
              aria-describedby="subject-retirement-info"
              name="retirement.criteria"
              onChange={doUpdate}
            >
              <option value="classification_count">Classification count</option>
              <option value="never_retire">Never retire</option>
              {/* TODO: this is just a POC - never_retire should be removed, even though it's a valid option on the API. */}
            </select>
            <input
              aria-label="Retirement count"
              className="small-width"
              defaultValue={workflow?.retirement?.options?.count}
              data-updaterule="convert_to_number"
              max="100"
              min="1"
              name="retirement.options.count"
              onBlur={doUpdate}
              placeholder="∞"
              type="number"
            />
          </div>
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
          <p id="subject-viewer-info">
            Choose how to display your subjects.
            Refer to the Subject Viewer section of the Glossary for more info.
          </p>
          <div className="flex-row">
            <select
              aria-label="Subject viewer"
              className="flex-item"
              data-updaterule="undefined_if_empty"
              defaultValue={workflow?.configuration?.subject_viewer || ''}
              aria-describedby="subject-viewer-info"
              name="configuration.subject_viewer"
              onChange={doUpdate}
            >
              <option value="">None selected (default)</option>
              <option value="imageAndText">Image and Text</option>
              <option value="jsonData">JSON data charts</option>
              <option value="multiFrame">Multi-Frame</option>
              <option value="singleImage">Single Image</option>
              <option value="singleText">Single Text</option>
              <option value="subjectGroup">Subject Group</option>
            </select>
          </div>
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
