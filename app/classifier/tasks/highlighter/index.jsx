import React from 'react';
import { Markdown } from 'markdownz';
import GenericTaskEditor from '../generic-editor';
import GenericTask from '../generic';
import LabelRenderer from './label-renderer';
import HighlighterSummary from './summary';

export default class Highlighter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.createButtons = this.createButtons.bind(this);
    this.createLabelAnnotation = this.createLabelAnnotation.bind(this);
  }

  handleChange(toolIndex, e) {
    let selection = document.getSelection();
    this.createLabelAnnotation(selection, toolIndex);
  }

  createLabelAnnotation(selection, toolIndex) {
    // currently we only deal with one selection at a time
    const range = selection.getRangeAt(0);
    const start = range.startOffset;
    const end = range.endOffset;
    const task = this.props.workflow.tasks[this.props.annotation.task];
    const labelInformation = task.highlighterLabels[toolIndex];
    const newAnnotation = Object.assign({}, this.props.annotation, { _toolIndex: toolIndex });
    newAnnotation.value.push({
      labelInformation: labelInformation,
      start: start,
      end: end
    });
    this.props.onChange(newAnnotation);
    selection.collapseToEnd();
  }

  createButtons(option, index) {
    const checked = index === this.props.annotation._toolIndex;
    let active = '';
    if (checked) {
      active = 'active';
    }
    return (
      <div>
        <button className="minor-button answer-button" value={option.label} onClick={this.handleChange.bind(this.props.annotation._toolIndex, index)} >
          <i className="fa fa-i-cursor" aria-hidden="true" style={{ color: `${option.color}` }} />
          <Markdown className="answer-button-label">{option.label}</Markdown>
        </button>
      </div>
    );
  }
  render() {
    if (this.props.task.highlighterLabels !== null) {
      const labels = this.props.task.highlighterLabels.map(this.createButtons);
      return (
        <div>
          <GenericTask question={this.props.task.instruction} help={this.props.task.help} answers={labels} required={this.props.task.required} />
        </div>
      );
    } else {
      return (
        <div>{'No labels for the Highlighter Tool'}</div>
      );
    }
  }

}

Highlighter.Editor = GenericTaskEditor;

Highlighter.InsideSubject = LabelRenderer;

Highlighter.Summary = HighlighterSummary;

Highlighter.getDefaultTask = () => {
  return (
    {
      type: 'highlighter',
      instruction: 'Highlight the text',
      help: '',
      highlighterLabels: []
    }
  );
};

Highlighter.getTaskText = (task) => {
  return (task.instruction);
};

Highlighter.getDefaultAnnotation = () => {
  return ({
    _toolIndex: 0,
    value: []
  });
};

Highlighter.defaultProps = {
  task: {
    type: 'highlighter',
    instruction: 'Highlight the text',
    help: '',
    highlighterLabels: []
  }
};

Highlighter.propTypes = {
  task: React.PropTypes.shape({
    type: React.PropTypes.string,
    instruction: React.PropTypes.string,
    help: React.PropTypes.string,
    tools: React.PropTypes.array,
    required: React.PropTypes.bool,
    highlighterLabels: React.PropTypes.array
  }),
  onChange: React.PropTypes.func,
  annotation: React.PropTypes.shape({
    _toolIndex: React.PropTypes.number,
    tools: React.PropTypes.array
  }),
  autoFocus: React.PropTypes.bool
};
