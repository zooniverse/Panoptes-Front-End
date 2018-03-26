import PropTypes from 'prop-types';
import React from 'react';
import SVGRenderer from '../../annotation-renderer/svg';

export default function MarkingsRenderer(props) {
  // a list that holds the annotations for the current combo task
  let currentComboAnnotations = [];
  const allTaskTypes = props.annotations.map(annotation => props.workflow.tasks[annotation.task].type);
  const i = allTaskTypes.lastIndexOf('combo');
  if (i > -1) {
    currentComboAnnotations = props.annotations[i].value;
  }
  // a list that holds the annotations for all combo tasks
  let allComboAnnotations = [];
  const allComboTypes = [];
  props.annotations.map((annotation) => {
    const taskDescription = props.workflow.tasks[annotation.task];
    if (taskDescription.type === 'combo') {
      allComboAnnotations = allComboAnnotations.concat(annotation.value);
      annotation.value.map((a) => {
        allComboTypes.push(props.workflow.tasks[a.task].type);
      });
    }
  });

  function onChange(annotation) {
    props.onChange(Object.assign({}, props.annotation, { value: currentComboAnnotations }));
  }

  return (
    <g className="combo-task-persist-inside-subject-container">
      {Object.keys(props.taskTypes)
        .filter((taskType) => { return taskType !== 'combo'; })
        .map((taskType) => {
          const TaskComponent = props.taskTypes[taskType];
          if (TaskComponent.AnnotationRenderer === SVGRenderer && TaskComponent.PersistInsideSubject) {
            // when a combo annotation changes make sure the combo annotation updated correctly with only the
            // current combo task's annotatons.  This is a hack to make drawing tasks work in a combo task.
            let { annotation } = props;
            if (annotation &&
              annotation.task &&
              props.workflow.tasks &&
              props.workflow.tasks[annotation.task].type === 'combo'
            ) {
              const idx = allComboTypes.lastIndexOf(taskType);
              if (idx > -1) {
                // if the current annotation is for the combo task pass in the `inner` annotations
                // This is a hack to make drawing tasks work in a combo task.
                annotation = allComboAnnotations[idx];
              }
            }
            return (
              <TaskComponent.PersistInsideSubject
                key={taskType}
                {...props}
                onChange={onChange}
                annotations={allComboAnnotations}
                annotation={annotation}
                tasks={props.workflow.tasks}
              />
            );
          }
        })
      }
    </g>
  );
}

MarkingsRenderer.propTypes = {
  annotations: PropTypes.arrayOf(PropTypes.object),
  taskTypes: PropTypes.object,
  workflow: PropTypes.shape({
    tasks: PropTypes.object
  })
};