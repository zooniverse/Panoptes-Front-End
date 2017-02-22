import React from 'react';
import GenericTask from '../generic';
import SliderTaskEditor from './editor';
import { Markdown } from 'markdownz';

const NOOP = Function.prototype;

class Summary extends React.Component {
  render() {
    return (
      <div>
        <div className="question">
          {this.props.task.instruction}
        </div>
        <div className="answers">
        {this.props.annotation.value ? (
          <div className="answer">
            “<code>{this.props.annotation.value}</code>”
          </div>) : ""}
        </div>
      </div>
    );
  }
}
Summary.displayName = 'SliderSummary';

Summary.defaultProps = {
  task: React.PropTypes.object,
  annotation: React.PropTypes.string,
  expanded: React.PropTypes.bool,
};

class SliderTask extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.val = parseInt(this.props.annotation.value);
  }
  handleChange() {
    if (parseInt(this.slider.value) !== this.val) {
      this.val = Math.max(Math.min(parseInt(this.slider.value), 100), 0);
    } else {
      if (this.numeric.value !== '') {
        this.val = Math.max(Math.min(parseInt(this.numeric.value), 100), 0);
      } else return;
    }
    this.numeric.value = this.val;
    this.slider.value = this.val;
    const newAnnotation = Object.assign(this.props.annotation, {value: this.val});
    this.props.onChange(newAnnotation);
  }
  componentDidMount() {
    if (this.slider) this.slider.value = this.val;
    if (this.numeric) this.numeric.value = this.val;
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
                max={100}
                min={0}
              />
            </label>
            <label className="answer">
              <input
                type="number"
                autoFocus={this.props.autoFocus}
                ref={ r => { this.numeric = r; }}
                onChange={this.handleChange}
                max="100"
                min="0"
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
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0
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
      question: React.PropTypes.string,
      help: React.PropTypes.string,
      required: React.PropTypes.bool
    }
  ),
  annotation: React.PropTypes.shape(
    { value: React.PropTypes.number }
  ),
  onChange: React.PropTypes.func
};

SliderTask.defaultProps = {
  task: {
    answers: [],
    question: '',
    help: '',
    required: false
  },
  annotation: { value: null },
  onChange: NOOP
};

export default SliderTask;
