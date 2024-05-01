import { useWorkflowContext } from '../../context.js';
import AssociatedSubjectSets from './components/AssociatedSubjectSets.jsx';
import AssociatedTutorial from './components/AssociatedTutorial.jsx';

export default function WorkflowSettingsPage() {
  const { workflow, update, project } = useWorkflowContext();
  const showSeparateFramesOptions = !!workflow?.configuration?.enable_switching_flipbook_and_separate;

  function onSubmit(e) {
    e.preventDefault();
    // TODO: on Submit, run update() on every available field.
    // also, make sure the 'data-updaterule' rules are implemented.
    return false;
  }

  function doUpdate(e) {
    const key = e?.target?.name;
    let value = e?.target?.value || '';
    const { updaterule } = e?.target?.dataset || {};
    if (!key) return;

    if (updaterule === 'checkbox') value = !!e?.target?.checked;
    if (updaterule === 'convert_to_number') value = parseInt(value);
    if (updaterule === 'undefined_if_empty') value = value || undefined;

    // TODO: due to onBlur={doUpdate}, keyboard navigation may accidentally cause the Workflow to update multiple times.
    // One solution is to check if the new value is different from the existing one.

    update({
      [key]: value
      // 'configuration.classifier_version': '2.0' // TODO: figure out if this needed.
    });
  }

  if (!workflow) return null;

  return (
    <form
      className="workflow-settings-page"
      onSubmit={onSubmit}
    >
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
          <AssociatedSubjectSets project={project} workflow={workflow} />
        </fieldset>

        <fieldset>
          <legend>Associated Tutorial</legend>
          <p>Choose the tutorials you want to use for this workflow. Create tutorials in the Tutorial tab.</p>
          <AssociatedTutorial project={project} workflow={workflow} />
        </fieldset>

        <hr />

        <fieldset>
          <legend>Subject Retirement</legend>
          <p id="subject-retirement-info">
            Set how many people should classify each subject before it is
            &quot;done.&quot; Once a subject has reached the retirement limit it
            will no longer be shown to volunteers.
          </p>
          <div className="flex-row align-start spacing-bottom-XS">
            <select
              aria-label="Retirement criteria"
              className="flex-item"
              defaultValue={workflow?.retirement?.criteria}
              aria-describedby="subject-retirement-info"
              name="retirement.criteria"
              onChange={doUpdate}
            >
              <option value="classification_count">Classification count</option>
              {/* <option value="never_retire">Never retire</option> */}
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
          <legend>Multi-Image Options</legend>
          <p id="multi-image-info">
            Choose how to display subjects with multiple images. If your subjects are in sequence, such as camera trap images, volunteers can play them like a .gif using the Flipbook viewer.
          </p>

          <div className="flex-row align-start spacing-bottom-XS">
            <select
              aria-label="Play iterations"
              className="flex-item"
              defaultValue={ /* If undefined, default value is '3'. If empty string '', it's infinite. */
                (workflow?.configuration?.playIterations === undefined)
                ? '3'
                : workflow?.configuration?.playIterations
              }
              id="playIterations"
              name="configuration.playIterations"
              onChange={doUpdate}
            >
              <option value="">Infinite</option>
              <option value="3">3</option>
              <option value="5">5</option>
            </select>
            <label htmlFor="playIterations">
              Play Iterations - choose how many times the images loop
            </label>
          </div>

          <div className="flex-row align-start spacing-bottom-XS">
            <input
              checked={!!workflow?.configuration?.flipbook_autoplay}
              data-updaterule="checkbox"
              id="flipbook_autoplay"
              name="configuration.flipbook_autoplay"
              onChange={doUpdate}
              type="checkbox"
            />
            <label htmlFor="flipbook_autoplay">
              Autoplay - automatically loop through a subject's images when the page loads
            </label>
          </div>

          <div className="flex-row align-start spacing-bottom-XS">
            <input
              checked={!!workflow?.configuration?.enable_switching_flipbook_and_separate}
              data-updaterule="checkbox"
              id="enable_switching_flipbook_and_separate"
              name="configuration.enable_switching_flipbook_and_separate"
              onChange={doUpdate}
              type="checkbox"
            />
            <label htmlFor="enable_switching_flipbook_and_separate">
              Allow Separate Frames View - volunteers can choose flipbook or a separate frames view
            </label>
          </div>

          <div className="flex-row align-start spacing-bottom-XS">
            <input
              checked={!!workflow?.configuration?.multi_image_clone_markers}
              data-updaterule="checkbox"
              id="multi_image_clone_markers"
              name="configuration.multi_image_clone_markers"
              onChange={doUpdate}
              type="checkbox"
            />
            <label htmlFor="multi_image_clone_markers">
              Clone marks in all frames - for drawing tasks
            </label>
          </div>

        </fieldset>

        <hr />

        <fieldset>
          <legend>Image Display Options</legend>
          <p id="limit-subject-height-info">
            Check "limit subject image height" if you want to limit subject height to always fit in the browser window. The max height will be the image's original pixel height.
          </p>
          <div className="flex-row align-start spacing-bottom-XS">
            <input
              checked={!!workflow?.configuration?.limit_subject_height}
              data-updaterule="checkbox"
              id="limit_subject_height"
              name="configuration.limit_subject_height"
              onChange={doUpdate}
              type="checkbox"
            />
            <label htmlFor="limit_subject_height">
              Limit subject image height
            </label>
          </div>
          <div className="flex-row align-start spacing-bottom-XS">
            <input
              checked={!!workflow?.configuration?.invert_subject}
              data-updaterule="checkbox"
              id="invert_subject"
              name="configuration.invert_subject"
              onChange={doUpdate}
              type="checkbox"
            />
            <label htmlFor="invert_subject">
              Allow users to flip image color
            </label>
          </div>
        </fieldset>

        {/*
        <hr />

        <fieldset>
          <legend>Subject Viewer</legend>
          <p id="subject-viewer-info">
            Choose how to display your subjects.
            Refer to the Subject Viewer section of the Glossary for more info.
          </p>
          <div className="flex-row align-start spacing-bottom-XS">
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

        <fieldset className="disabled">
          <legend>Classification Tools</legend>
          <p>TODO</p>
        </fieldset>

        <fieldset className="disabled">
          <legend>Quicktalk</legend>
          <p>TODO</p>
        </fieldset>
        */}

      </div>
    </form>
  );
}
