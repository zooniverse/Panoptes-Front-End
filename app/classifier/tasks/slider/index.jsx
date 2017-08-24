import { Markdown } from 'markdownz';
import React from 'react';
import GenericTask from '../generic';
import SliderTaskEditor from './editor';

const NOOP = Function.prototype;

const SliderSummary = (props) => {
  let answer = 'No answer';
  if (props.annotation.value !== null) {
    answer = props.annotation.value;
  }
  return (
    <div>
      <div className="question">
        <Markdown tag="span" inline={true}>
          {props.task.instruction}
        </Markdown>
      </div>
      <div className="answer">
        {answer}
      </div>
    </div>
  );
};

SliderSummary.propTypes = {
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

const SliderTask = ({ task, annotation, onChange, autoFocus }) => {
  const handleChange = (e) => {
    let value = e.target.value;
    if (parseFloat(value, 10) > parseFloat(task.max, 10)) {
      value = task.max;
    } else if (parseFloat(value, 10) < parseFloat(task.min, 10)) {
      value = task.min;
    }
    const newAnnotation = Object.assign({}, annotation, { value });
    onChange(newAnnotation);
  };

  return (
    <div>
      <GenericTask
        question={task.instruction}
        help={task.help}
        required={task.required}
      >
        <div className="slider-task-container full ">
          <div className="slider-task-range">
            <label htmlFor="slider-range" className="answer">
              <div>
                <input
                  className="standard-input"
                  type="range"
                  autoFocus={autoFocus}
                  onChange={handleChange.bind(this)}
                  max={task.max}
                  min={task.min}
                  step={task.step}
                  value={annotation.value || task.defaultValue}
                />
              </div>
              <div className="slider-task-range__label-container">
                <div className="slider-task-range__label-container__left">
                  {task.min}
                </div>
                <div className="slider-task-range__label-container__right">
                  {task.max}
                </div>
              </div>
            </label>
          </div>
          <label htmlFor="slider-number" className="answer slider-task-number">
            <input
              className="standard-input"
              type="number"
              autoFocus={autoFocus}
              onChange={handleChange.bind(this)}
              max={task.max}
              min={task.min}
              step={task.step}
              value={annotation.value || task.defaultValue}
            />
          </label>
        </div>
      </GenericTask>
    </div>
  );
};

SliderTask.displayName = 'SliderTask';
SliderTask.Editor = SliderTaskEditor;
SliderTask.Summary = SliderSummary;
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
