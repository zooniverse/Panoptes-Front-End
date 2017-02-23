import { MarkdownEditor } from 'markdownz';
import React from 'react';
import alert from '../../../lib/alert';
import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';
import MarkdownHelp from '../../../partials/markdown-help';
import NextTaskSelector from '../next-task-selector';

const SliderTaskEditor = (props) => {
  const handleChange = handleInputChange.bind(props.workflow);
  const requiredHelp = 'Check this box if this question has to be answered before proceeding. If a marking task is Required, the volunteer will not be able to move on until they have made at least 1 mark.';
  let nextTask;
  let helpBox;
  if (!props.isSubtask) {
    nextTask = (
      <AutoSave resource={props.workflow}>
        <span className="form-label">Next task</span>
        <br />
        <NextTaskSelector
          workflow={props.workflow}
          name={`${props.taskPrefix}.next`}
          value={props.task.next ? props.task.next : ''}
          onChange={handleChange}
        />
      </AutoSave>
    );
    helpBox = (
      <div>
        <AutoSave resource={props.workflow}>
          <span className="form-label">Help text</span>
          <br />
          <MarkdownEditor
            name={`${props.taskPrefix}.help`}
            value={props.task.help ? props.task.help : ''}
            rows="4"
            className="full"
            onChange={handleChange}
            onHelp={() => { return alert(<MarkdownHelp />); }}
          />
        </AutoSave>
        <small className="form-help">Add text and images for a help window.</small>
      </div>
    );
  }
  return (
    <div className="text-editor">
      <section>
        <div>
          <AutoSave resource={props.workflow}>
            <span className="form-label">Main text</span>
            <br />
            <textarea
              name={`${props.taskPrefix}.instruction`}
              value={props.task.instruction}
              className="standard-input full"
              onChange={handleChange}
            />
          </AutoSave>
          <small className="form-help">Describe the task, or ask the question, in a way that is clear to a non-expert. You can use markdown to format this text.</small>
          <br />
          <br />
          {helpBox}
          <hr />
          <span className="form-label">Slider Properties</span>
          <br />
          <span>
            <label className="pill-button" title={requiredHelp} htmlFor="requireCheckbox">
              <AutoSave resource={props.workflow}>
                <input
                  type="checkbox"
                  name={`${props.taskPrefix}.required`}
                  checked={props.task.required}
                  onChange={handleChange}
                  id="requireCheckbox"
                />
                {' '}
                Required
              </AutoSave>
            </label>
            {' '}
          </span>
          <br />
          <small className="form-help">Specify the minimum, maximum, and default values for the slider. You can also specify the step size for the slider.</small>
          <br />
          <AutoSave resource={props.workflow}>
            <label htmlFor="minInput">
              <input
                type="number"
                value={props.task.min}
                name={`${props.taskPrefix}.min`}
                onChange={handleChange}
                step="any"
                id="minInput"
              />
              Minimum value
            </label>
          </AutoSave>
          <br />
          <AutoSave resource={props.workflow}>
            <label htmlFor="maxInput">
              <input
                type="number"
                value={props.task.max}
                name={`${props.taskPrefix}.max`}
                onChange={handleChange}
                step="any"
                id="maxInput"
              />
              Maximum value
            </label>
          </AutoSave>
          <br />
          <AutoSave resource={props.workflow}>
            <label htmlFor="defaultValueInput">
              <input
                type="number"
                value={props.task.defaultValue}
                name={`${props.taskPrefix}.defaultValue`}
                onChange={handleChange}
                min={props.task.min}
                max={props.task.max}
                step="any"
                id="defaultValueInput"
              />
              Default value
            </label>
          </AutoSave>
          <br />
          <AutoSave resource={props.workflow}>
            <label htmlFor="stepInput">
              <input
                type="number"
                value={props.task.step}
                name={`${props.taskPrefix}.step`}
                onChange={handleChange}
                min={0}
                max={0.5 * (props.task.max - props.task.min)}
                step="any"
                id="stepInput"
              />
              Slider step size
            </label>
          </AutoSave>
        </div>
      </section>
      {nextTask}
    </div>
  );
};

SliderTaskEditor.propTypes = {
  isSubtask: React.PropTypes.bool,
  workflow: React.PropTypes.object,
  taskPrefix: React.PropTypes.string,
  task: React.PropTypes.shape(
    {
      next: React.PropTypes.string,
      instruction: React.PropTypes.string,
      help: React.PropTypes.string,
      required: React.PropTypes.bool,
      min: React.PropTypes.string,
      max: React.PropTypes.string,
      defaultValue: React.PropTypes.string,
      step: React.PropTypes.string
    }
  )
};

export default SliderTaskEditor;
