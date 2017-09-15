import { Markdown } from 'markdownz';
import React from 'react';
import GenericTask from '../generic';
import SliderTaskEditor from './editor';

const NOOP = Function.prototype;

const SLIDERTASKDEFAULT = {
  defaultValue: '0',
  help: '',
  instruction: 'Enter an Instruction.',
  max: '1',
  min: '0',
  step: '0.1',
  type: 'slider'
};

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
      value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ])
    }
  ).isRequired
};

const SliderTask = ({ task, annotation, onChange, autoFocus }) => {
  function handleChange(e) {
    let value = e.target.value;
    value = Math.min(parseFloat(value, 10), parseFloat(task.max, 10));
    value = Math.max(parseFloat(value, 10), parseFloat(task.min, 10));
    const newAnnotation = Object.assign({}, annotation, { value });
    onChange(newAnnotation);
  }

  return (
    <div>
      <GenericTask
        question={task.instruction}
        help={task.help}
        required={false}
      >
        <div className="slider-task-container full ">
          <div className="slider-task-range">
            <label className="answer">
              <div>
                <input
                  className="standard-input"
                  type="range"
                  autoFocus={autoFocus}
                  onChange={handleChange}
                  max={task.max}
                  min={task.min}
                  step={task.step}
                  value={annotation.value === null ? task.defaultValue : annotation.value}
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
          <label className="answer slider-task-number">
            <input
              className="standard-input"
              type="number"
              onChange={handleChange}
              max={task.max}
              min={task.min}
              step={task.step}
              value={annotation.value === null ? task.defaultValue : annotation.value}
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
  return SLIDERTASKDEFAULT;
};
SliderTask.getTaskText = (task) => {
  return task.instruction;
};
SliderTask.getDefaultAnnotation = (task) => {
  return { value: task.defaultValue };
};
SliderTask.isAnnotationComplete = (task, annotation) => {
  return (annotation.value !== null);
};

SliderTask.propTypes = {
  annotation: React.PropTypes.shape({
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  }),
  autoFocus: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  task: React.PropTypes.shape({
    answers: React.PropTypes.array,
    defaultValue: React.PropTypes.string,
    help: React.PropTypes.string,
    instruction: React.PropTypes.string,
    max: React.PropTypes.string,
    min: React.PropTypes.string,
    step: React.PropTypes.string
  })
};

SliderTask.defaultProps = {
  annotation: { value: null },
  onChange: NOOP,
  task: SLIDERTASKDEFAULT
};

export default SliderTask;
