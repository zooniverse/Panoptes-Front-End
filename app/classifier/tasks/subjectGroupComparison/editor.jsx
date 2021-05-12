import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';

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
          <small className="form-help">Describe the task, or ask the question, in a way that is clear to a non-expert. You can use markdown to format this text.</small><br />
        </div>
      </div>
    );
  }

}

SubjectGroupComparisonEditor.propTypes = {
  children: PropTypes.node,
  task: PropTypes.shape(
    {
      question: PropTypes.string,
      unlinkedTask: PropTypes.string
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