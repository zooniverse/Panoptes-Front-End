import { useWorkflowContext } from '../../context.js';
import AssociatedSubjectSets from './components/AssociatedSubjectSets.jsx';
import AssociatedTutorial from './components/AssociatedTutorial.jsx';
import WorkflowVersion from '../WorkflowVersion.jsx';

// Use ?advanced=true to enable advanced mode.
// - switches from simpler "linear workflow" to "manual workflow".
// - enables Experimental Panel.
// - shows hidden options in workflow settings.
function getAdvancedMode() {
  const params = new URLSearchParams(window?.location?.search);
  return !!params.get('advanced');
}

export default function WorkflowSettingsPage() {
  const { workflow, update, project } = useWorkflowContext();
  const advancedMode = getAdvancedMode();
  const showSeparateFramesOptions = workflow?.configuration?.multi_image_mode === 'separate';

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
      <div className="workflow-title">
        <label htmlFor="display_name">
          Workflow Name
        </label>
        <div className="flex-row">
          <div className="flex-item flex-row position-relative">
            <input
              id="display_name"
              type="text"
              name="display_name"
              defaultValue={workflow?.display_name || ''}
              onBlur={doUpdate}
            />
            <span className="workflow-id">#{workflow.id}</span>
          </div>
          <WorkflowVersion />
        </div>
      </div>

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
              disabled={!advancedMode}
              aria-describedby="subject-retirement-info"
              name="retirement.criteria"
              onChange={doUpdate}
            >
              <option value="classification_count">Classification count</option>
              {/* Reason for removal (May 2024): standardisation. PFE/FEM Lab doesn't allow "never retire" option, nor setting the retirement count. */}
              {(advancedMode || workflow?.retirement?.criteria === 'never_retire') &&
                <option value="never_retire">Never retire</option>
              }
            </select>
            {(workflow?.retirement?.criteria === 'classification_count') && (
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
            )}
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
              aria-label="Viewer for multiple images"
              className="flex-item"
              defaultValue={workflow?.configuration?.multi_image_mode ?? 'flipbook'}
              id="multi_image_mode"
              name="configuration.multi_image_mode"
              onChange={doUpdate}
            >
              <option value="flipbook">Flipbook Viewer (default)</option>
              <option value="separate">Separate Frames Viewer</option>
            </select>
          </div>

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
              Play Iterations <span className="small-info">- choose how many times the images loop</span>
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
              Autoplay <span className="small-info">- automatically loop through a subject's images when the page loads</span>
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
              Allow Separate Frames View <span className="small-info">- volunteers can choose flipbook or a separate frames view</span>
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
              Clone marks in all frames <span className="small-info">- for drawing tasks</span>
            </label>
          </div>

          {showSeparateFramesOptions && (<>
            <p>Show separate frames as:</p>
            <ul className="input-group">
              <li key="separate-frames-as-col">
                <input
                  checked={workflow?.configuration?.multi_image_layout === 'col' || workflow?.configuration?.multi_image_layout === undefined /* Default option */}
                  id="separate-frames-as-col"
                  onChange={doUpdate}
                  name="configuration.multi_image_layout"
                  value="col"
                  type="radio"
                />
                <label htmlFor="separate-frames-as-col">
                  Single column <span className="small-info">- all frames stacked vertically (recommended for landscape subjects; default for mobile devices)</span>
                </label>
              </li>
              <li key="separate-frames-as-row">
                <input
                  checked={workflow?.configuration?.multi_image_layout === 'row'}
                  id="separate-frames-as-row"
                  name="configuration.multi_image_layout"
                  onChange={doUpdate}
                  value="row"
                  type="radio"
                />
                <label htmlFor="separate-frames-as-row">
                  Single row <span className="small-info">- all frames side by side horizontally (recommended only for portrait subjects)</span>
                </label>
              </li>
              <li key="separate-frames-as-grid2">
                <input
                  checked={workflow?.configuration?.multi_image_layout === 'grid2'}
                  id="separate-frames-as-grid2"
                  name="configuration.multi_image_layout"
                  onChange={doUpdate}
                  value="grid2"
                  type="radio"
                />
                <label htmlFor="separate-frames-as-grid2">
                  Grid <span className="small-info">- frames distributed evenly over 2 columns</span>
                </label>
              </li>
              <li key="separate-frames-as-grid3">
                <input
                  checked={workflow?.configuration?.multi_image_layout === 'grid3'}
                  id="separate-frames-as-grid3"
                  name="configuration.multi_image_layout"
                  onChange={doUpdate}
                  value="grid3"
                  type="radio"
                />
                <label htmlFor="separate-frames-as-grid3">
                  Grid <span className="small-info">- frames distributed evenly over 3 columns</span>
                </label>
              </li>
            </ul>
          </>)}
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

        {advancedMode && (<>  {/* Reason for removal (Apr 2024): we want users to use automatic subject viewer selection, to reduce complexity and complications. */}
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
        </>)}

      </div>
    </form>
  );
}
