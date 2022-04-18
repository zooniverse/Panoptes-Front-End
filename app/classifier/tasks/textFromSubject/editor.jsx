import { MarkdownEditor, MarkdownHelp } from 'markdownz';
import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save';
import alert from '../../../lib/alert';
import handleInputChange from '../../../lib/handle-input-change';
import NextTaskSelector from '../next-task-selector';

export default function TextFromSubjectEditor({
  task,
  taskPrefix,
  workflow
}) {
  const handleChange = handleInputChange.bind(workflow);

  return (
    <div className="text-editor">
      <section>
        <div>
          <AutoSave resource={workflow}>
            <span className="form-label">Main text</span>
            <br />
            <textarea
              name={`${taskPrefix}.instruction`}
              value={task.instruction}
              className="standard-input full"
              onChange={handleChange}
            />
          </AutoSave>
          <small className="form-help">
            Describe the task, or ask the question, in a way that is clear to a non-expert. You can use markdown to format this text.
          </small>
          <br />
        </div>
        <br />
        <div>
          <AutoSave resource={workflow}>
            <span className="form-label">Help text</span>
            <br />
            <MarkdownEditor
              name={`${taskPrefix}.help`}
              value={task.help}
              rows="4"
              className="full"
              onChange={handleChange}
              onHelp={() => alert(<MarkdownHelp />)}
            />
          </AutoSave>
          <small className="form-help">
            Add text and images for a help window.
          </small>
        </div>
      </section>
      <hr />
      <AutoSave resource={workflow}>
        <span className="form-label">
          Next task
        </span>
        <br />
        <NextTaskSelector
          task={task}
          workflow={workflow}
          name={`${taskPrefix}.next`}
          value={task.next}
          onChange={handleInputChange.bind(workflow)}
        />
      </AutoSave>
    </div>
  );
}

TextFromSubjectEditor.propTypes = {
  task: PropTypes.shape(
    {
      help: PropTypes.string,
      instruction: PropTypes.string,
      next: PropTypes.string
    }
  ),
  taskPrefix: PropTypes.string,
  workflow: PropTypes.shape(
    {
      tasks: PropTypes.object,
      update: PropTypes.func
    }
  )
};

TextFromSubjectEditor.defaultProps = {
  task: {
    help: '',
    instruction: '',
    next: ''
  },
  taskPrefix: '',
  workflow: { }
};
