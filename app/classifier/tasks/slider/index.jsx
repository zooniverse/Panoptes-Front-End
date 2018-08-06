import { Markdown } from 'markdownz';
import PropTypes from 'prop-types';
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
  task: PropTypes.shape(
    {
      instruction: PropTypes.string
    }
  ).isRequired,
  annotation: PropTypes.shape(
    {
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    }
  ).isRequired
};

const SliderTask = ({ task, translation, annotation, onChange, autoFocus }) => {
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
        question={translation.instruction}
        help={translation.help}
        required={false}
      >
        <div className="slider-task-container full ">
          <div className="slider-task-range">
            <label className="answer">
              <div>
                <input
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
  annotation: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }),
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  task: PropTypes.shape({
    answers: PropTypes.array,
    defaultValue: PropTypes.string,
    max: PropTypes.string,
    min: PropTypes.string,
    step: PropTypes.string
  }),
  translation: PropTypes.shape({
    help: PropTypes.string,
    instruction: PropTypes.string
  })
};

SliderTask.defaultProps = {
  annotation: { value: null },
  onChange: NOOP,
  task: SLIDERTASKDEFAULT,
  translation: SLIDERTASKDEFAULT
};

export default SliderTask;