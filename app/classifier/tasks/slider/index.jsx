import React from 'react';
import GenericTask from '../generic';
import SliderTaskEditor from './editor';
import { Markdown } from 'markdownz';

const NOOP = Function.prototype;

class Summary extends React.Component {
  render() {
    let answer = 'No answer';
    if (this.props.annotation.value !== null) {
      answer = this.props.annotation.value;
    }
    return (
      <div>
        <div className="question">
          {this.props.task.instruction}
        </div>
        <div className="answer">
          {answer}
        </div>
      </div>
    );
  }
}
Summary.displayName = 'SliderSummary';

Summary.propTypes = {
  task: React.PropTypes.shape(
    {
      instruction: React.PropTypes.string
    }
  ).isRequired,
  annotation: React.PropTypes.shape(
    {
      value: React.PropTypes.string
    }
  ).isRequired
};

class SliderTask extends React.Component {
  constructor(props) {
    super(props);
    this.task = Object.assign(
      {
        help: '',
        instruction: '',
        required: false,
        max: 1,
        min: 0,
        step: 0.1,
        defaultValue: 0
      },
      this.props.task
    );
    let value = this.task.defaultValue;
    if (this.props.annotation.value !== null) {
      value = this.props.annotation.value;
    }
    this.state = { value };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    let value = 0;
    if (parseFloat(this.numeric.value) !== this.state.value) {
      if (this.numeric.value !== '') {
        value = Math.max(
          Math.min(parseFloat(this.numeric.value), this.task.max),
          this.task.min
        );
      } else return;
    } else {
      value = Math.max(
        Math.min(parseFloat(this.slider.value), this.task.max),
        this.task.min
      );
    }
    value = String(value);
    const newAnnotation = Object.assign(this.props.annotation, { value });
    this.props.onChange(newAnnotation);
    this.setState({ value });
  }
  render() {
    return (
      <div>
        <GenericTask
          question={this.props.task.instruction}
          help={this.props.task.help}
          required={this.props.task.required}
        >
          <div className="standard-input full">
            <label className="answer">
              <input
                type="range"
                autoFocus={this.props.autoFocus}
                ref={ r => { this.slider = r; }}
                onChange={this.handleChange}
                max={this.task.max}
                min={this.task.min}
                step={this.task.step}
                value={this.state.value}
              />
            </label>
            <label className="answer">
              <input
                type="number"
                autoFocus={this.props.autoFocus}
                ref={ r => { this.numeric = r; }}
                onChange={this.handleChange}
                max={this.task.max}
                min={this.task.min}
                step="any"
                value={this.state.value}
                style={{ minWidth: '30px' }}
              />
            </label>
          </div>
        </GenericTask>
      </div>
    );
  }
}
SliderTask.displayName = 'SliderTask';
SliderTask.Editor = SliderTaskEditor;
SliderTask.Summary = Summary;
SliderTask.getDefaultTask = () => {
  return {
    type: 'slider',
    instruction: 'Enter an Instruction.',
    help: '',
    min: '0',
    max: '1',
    step: '0.1',
    defaultValue: '0'
  };
};
SliderTask.getTaskText = (task) => {
  return task.instruction;
};
SliderTask.getDefaultAnnotation = () => {
  return { value: null };
};
SliderTask.isAnnotationComplete = (task, annotation) => {
  return (!task.required || annotation.value !== null);
};
SliderTask.propTypes = {
  task: React.PropTypes.shape(
    {
      answers: React.PropTypes.array,
      help: React.PropTypes.string,
      instruction: React.PropTypes.string,
      required: React.PropTypes.bool,
      max: React.PropTypes.string,
      min: React.PropTypes.string,
      step: React.PropTypes.string,
      defaultValue: React.PropTypes.string
    }
  ),
  annotation: React.PropTypes.shape(
    { value: React.PropTypes.string }
  ),
  onChange: React.PropTypes.func
};

SliderTask.defaultProps = {
  task: {
    help: '',
    instruction: '',
    required: false,
    max: '1',
    min: '0',
    step: '0.1',
    defaultValue: '0'
  },
  annotation: { value: null },
  onChange: NOOP
};

export default SliderTask;
