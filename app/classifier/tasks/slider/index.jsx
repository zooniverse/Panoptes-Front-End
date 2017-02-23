import { Markdown } from 'markdownz';
import React from 'react';
import GenericTask from '../generic';
import SliderTaskEditor from './editor';

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
          <Markdown tag="span" inline={true}>
            {this.props.task.instruction}
          </Markdown>
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
    let value = this.props.task.defaultValue;
    if (this.props.annotation.value !== null) {
      value = this.props.annotation.value;
    }
    this.state = { value };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const newAnnotation = Object.assign({}, this.props.annotation, { value: this.props.task.defaultValue });
    this.props.onChange(newAnnotation);
  }

  handleChange(e) {
    let value = e.target.value;
    if (parseFloat(value, 10) > parseFloat(this.props.task.max, 10)) {
      value = this.props.task.max;
    } else if (parseFloat(value, 10) < parseFloat(this.props.task.min, 10)) {
      value = this.props.task.min;
    }
    this.setState({ value });
    const newAnnotation = Object.assign({}, this.props.annotation, { value });
    this.props.onChange(newAnnotation);
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
            <label htmlFor="sliderInput" className="answer">
              <input
                type="range"
                autoFocus={this.props.autoFocus}
                onChange={this.handleChange}
                max={this.props.task.max}
                min={this.props.task.min}
                step={this.props.task.step}
                value={this.state.value}
                id="sliderInput"
              />
            </label>
            <label htmlFor="textInput" className="answer">
              <input
                type="number"
                autoFocus={this.props.autoFocus}
                onChange={this.handleChange}
                max={this.props.task.max}
                min={this.props.task.min}
                step="any"
                value={this.state.value}
                style={{ minWidth: '30px' }}
                id="textInput"
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
  onChange: React.PropTypes.func,
  autoFocus: React.PropTypes.bool
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
