import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';
import alert from '../../../lib/alert';
import ChangeListener from '../../../components/change-listener';
import DrawingTaskDetailsEditor from '../drawing-task-details-editor';

export default class SubjectGroupComparisonEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const handleChange = handleInputChange.bind(props.workflow);

    return (
      <div className={`workflow-task-editor ${props.task.type}`}>
        <div><b>Subject Group Comparison Task</b></div>
        <div>
          <AutoSave resource={props.workflow}>
            <span className="form-label">Main text</span>
            <br />
            <textarea name={`${props.taskPrefix}.question`} value={props.task['question']} className="standard-input full" onChange={handleChange} />
          </AutoSave>
          <small className="form-help">Describe the task, or ask the question, in a way that is clear to a non-expert. Markdown can be used only to add images (with alt text), bold and italic text.</small><br />
        </div>
        <div key="details" className="workflow-choice-setting">
          <button type="button" onClick={() => this.editToolDetails(0)}>Sub-tasks ({props.task.details?.length || 0})</button>{' '}
          <small className="form-help">Ask users a question about what they've just drawn.</small>
        </div>
      </div>
    );
  }

  editToolDetails(toolIndex) {
    // Initialize details array if it doesn't exist
    if (!this.props.task.details) {
      this.props.task.details = [];
      // Update the workflow to persist the change
      const changes = {};
      changes[`${this.props.taskPrefix}.details`] = [];
      this.props.workflow.update(changes);
    }

    alert((resolve) => (
      <ChangeListener target={this.props.workflow}>
        {() => (
          <DrawingTaskDetailsEditor
            project={this.props.project}
            workflow={this.props.workflow}
            task={this.props.task}
            toolIndex={toolIndex}
            details={this.props.task.details}
            toolPath={`${this.props.taskPrefix}`}
            onClose={resolve}
          />
        )}
      </ChangeListener>
    ));
  }

}

SubjectGroupComparisonEditor.propTypes = {
  children: PropTypes.node,
  project: PropTypes.object,
  taskPrefix: PropTypes.string,
  task: PropTypes.shape(
    {
      question: PropTypes.string,
      unlinkedTask: PropTypes.string,
      details: PropTypes.array
    }
  ),
  workflow: PropTypes.shape(
    {
      tasks: PropTypes.object,
      update: PropTypes.func
    }
  )
};

SubjectGroupComparisonEditor.defaultProps = {
  task: { },
  workflow: { }
};
