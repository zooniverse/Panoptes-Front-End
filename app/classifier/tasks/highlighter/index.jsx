import React from 'react';
import { Markdown } from 'markdownz';
import GenericTaskEditor from '../generic-editor';
import GenericTask from '../generic';

export default class Highlighter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.createLabels = this.createLabels.bind(this);
  }

  handleChange(toolIndex, e) {
    if (e.target.checked) {
      const newAnnotation = Object.assign({}, this.props.annotation, { _toolIndex: toolIndex });
      this.props.onChange(newAnnotation);
    }
  }
  createLabels(option, index) {
    const checked = index === this.props.annotation._toolIndex;
    let active = '';
    if (checked) {
      active = 'active';
    }
    return (
      <div>
        <label htmlFor={option.label} >
          <input id={option.label} type="checkbox" checked={checked} className="drawing-tool-button-input" value={option.label} autoFocus={this.props.autoFocus && index === 0} onChange={this.handleChange.bind(this.props.annotation._toolIndex, index)} />
          <div className={`minor-button answer-button ${active}`} >
            <i className="fa fa-i-cursor" aria-hidden="true" style={{ color: `${option.color}` }} />
            <Markdown className="answer-button-label">{option.label}</Markdown>
          </div>
        </label>
      </div>
    );
  }
  render() {
    if (this.props.task.highlighterLabels !== null) {
      const labels = this.props.task.highlighterLabels.map(this.createLabels);
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
