import { MarkdownEditor, MarkdownHelp } from 'markdownz';
import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save';
import alert from '../../../lib/alert';
import handleInputChange from '../../../lib/handle-input-change';
import NextTaskSelector from '../next-task-selector';

export default class TextFromSubjectEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const handleChange = handleInputChange.bind(props.workflow);

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
            <small className="form-help">
              Describe the task, or ask the question, in a way that is clear to a non-expert. You can use markdown to format this text.
            </small>
            <br />
          </div>
          <br />
          <div>
            <AutoSave resource={props.workflow}>
              <span className="form-label">Help text</span>
              <br />
              <MarkdownEditor
                name={`${props.taskPrefix}.help`}
                value={props.task.help}
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
        <AutoSave resource={props.workflow}>
          <span className="form-label">
            Next task
          </span>
          <br />
          <NextTaskSelector
            task={props.task}
            workflow={props.workflow}
            name={`${props.taskPrefix}.next`}
            value={props.task.next}
            onChange={handleInputChange.bind(props.workflow)}
          />
        </AutoSave>
      </div>
    );
  }
}

TextFromSubjectEditor.propTypes = {
  taskPrefix: PropTypes.string,
  task: PropTypes.shape(
    {
      help: PropTypes.string,
      instruction: PropTypes.string,
      next: PropTypes.string
    }
  ),
  workflow: PropTypes.shape(
    {
      tasks: PropTypes.object,
      update: PropTypes.func
    }
  )
};

TextFromSubjectEditor.defaultProps = {
  taskPrefix: 'T0',
  task: {
    help: '',
    instruction: '',
    next: ''
  },
  workflow: { }
};
